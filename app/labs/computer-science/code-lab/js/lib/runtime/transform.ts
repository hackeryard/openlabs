// ─── Code Transform ────────────────────────────────────────────
// Rewrites user source before it runs in the sandbox:
//   0. every loop body (while/do-while/for/for-in/for-of) gets a
//      __loopTick() call injected at its top, so a synchronous
//      infinite loop trips the loop-guard budget instead of hanging
//      the tab forever — nothing else in this engine can catch a
//      tight loop that never yields to the scheduler.
//   1. async/await  →  generator + __runAsync/__await, so each await
//      continuation is an explicit, recordable microtask.
//   2. every user function gets __enter/__exit calls so the Call Stack
//      panel reflects real function entry/exit.
//   3. __line(n) markers so the editor can highlight the active line.
// Uses only @babel/parser + traverse + generator + types (already
// installed in the repo).

import { parse } from '@babel/parser';
import _traverse, { type NodePath } from '@babel/traverse';
import _generate from '@babel/generator';
import * as t from '@babel/types';

// Interop: these packages ship as CJS with a `.default`, but are
// sometimes imported as ESM namespaces depending on the bundler.
const traverse = ((_traverse as unknown as { default?: typeof _traverse }).default ?? _traverse) as typeof _traverse;
const generate = ((_generate as unknown as { default?: typeof _generate }).default ?? _generate) as typeof _generate;

export interface TransformResult {
  code: string;
  error?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function transform(source: string): TransformResult {
  let ast: t.File;
  try {
    ast = parse(source, { sourceType: 'script', allowReturnOutsideFunction: false }) as unknown as t.File;
  } catch (e) {
    return { code: '', error: `Syntax error: ${(e as Error).message}` };
  }

  try {
    // Pass 0 — loop-iteration guard. Must run before Pass 2's
    // call-stack instrumentation wraps loop bodies in try/finally,
    // though order isn't actually load-bearing here since this pass
    // only touches Loop nodes and Pass 2 only touches Function nodes.
    traverse(ast, {
      Loop(path) { instrumentLoop(path); },
    });

    // Pass 1 — async/await. `exit` = innermost functions first, so a
    // nested async function is fully rewritten before its parent.
    traverse(ast, {
      Function: { exit(path) { transformAsync(path); } },
    });

    // Pass 2 — call-stack instrumentation.
    traverse(ast, {
      Function(path) { instrument(path); },
    });

    // Pass 3 — active-line markers.
    traverse(ast, {
      Statement(path) { injectLine(path); },
    });

    const { code } = generate(ast, { compact: false, comments: false });
    return { code };
  } catch (e) {
    return { code: '', error: `Could not prepare code: ${(e as Error).message}` };
  }
}

// ── loop-iteration guard ────────────────────────────────────────
function instrumentLoop(path: NodePath<t.Loop>): void {
  const node = path.node as any;
  if (node._sbLoopGuarded) return;
  node._sbLoopGuarded = true;

  let block: t.BlockStatement;
  if (t.isBlockStatement(node.body)) {
    block = node.body;
  } else {
    // Bare-statement bodies (`while (x) doStuff();`) need a block to
    // unshift the guard call into.
    block = t.blockStatement([node.body]);
    node.body = block;
  }

  const tick = t.expressionStatement(t.callExpression(t.identifier('__loopTick'), []));
  (tick as any)._sbSynthetic = true;
  block.body.unshift(tick);
}

// ── async/await → generator + __runAsync ───────────────────────
function transformAsync(path: NodePath<t.Function>): void {
  const node = path.node as any;
  if (!node.async) return;

  // Replace this function's own awaits with `yield __await(expr)`,
  // without descending into nested functions.
  path.traverse({
    AwaitExpression(inner) {
      inner.replaceWith(
        t.yieldExpression(t.callExpression(t.identifier('__await'), [inner.node.argument])),
      );
    },
    Function(inner) { inner.skip(); },
  });

  const bodyBlock: t.BlockStatement = t.isBlockStatement(node.body)
    ? node.body
    : t.blockStatement([t.returnStatement(node.body)]);

  const gen = t.functionExpression(null, [], bodyBlock, true /* generator */, false /* async */);
  (gen as any)._sbSynthetic = true;

  node.async = false;
  if (t.isArrowFunctionExpression(node)) node.expression = false;
  node.body = t.blockStatement([
    t.returnStatement(t.callExpression(t.identifier('__runAsync'), [gen])),
  ]);
}

// ── call-stack instrumentation ─────────────────────────────────
function instrument(path: NodePath<t.Function>): void {
  const node = path.node as any;
  if (node._sbSynthetic || node._sbInstrumented) return;
  node._sbInstrumented = true;

  const name = resolveFunctionName(path);
  const line = node.loc ? node.loc.start.line : undefined;

  let block: t.BlockStatement;
  if (t.isBlockStatement(node.body)) {
    block = node.body;
  } else {
    block = t.blockStatement([t.returnStatement(node.body)]);
    node.body = block;
    if (t.isArrowFunctionExpression(node)) node.expression = false;
  }

  const lineArg: t.Expression = line != null ? t.numericLiteral(line) : t.identifier('undefined');
  const enter = t.expressionStatement(
    t.callExpression(t.identifier('__enter'), [t.stringLiteral(name), lineArg]),
  );
  const exit = t.expressionStatement(
    t.callExpression(t.identifier('__exit'), [line != null ? t.numericLiteral(line) : t.identifier('undefined')]),
  );

  const original = t.blockStatement(block.body);
  const tryStmt = t.tryStatement(original, null, t.blockStatement([exit]));
  (enter as any)._sbSynthetic = true;
  (tryStmt as any)._sbSynthetic = true;
  block.body = [enter, tryStmt];
}

function resolveFunctionName(path: NodePath<t.Function>): string {
  const node = path.node as any;
  if (node.id && t.isIdentifier(node.id)) return node.id.name;
  const parent = path.parent;
  if (t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) return parent.id.name;
  if (t.isObjectProperty(parent) && t.isIdentifier(parent.key)) return parent.key.name;
  if ((t.isObjectMethod(node) || t.isClassMethod(node)) && t.isIdentifier(node.key)) return node.key.name;
  if (t.isAssignmentExpression(parent) && t.isIdentifier(parent.left)) return parent.left.name;
  return 'anonymous';
}

// ── __line(n) markers ──────────────────────────────────────────
function injectLine(path: NodePath<t.Statement>): void {
  const node = path.node as any;
  if (node._sbLine || node._sbSynthetic) return;
  if (!node.loc) return;
  const parent = path.parent;
  if (!t.isBlockStatement(parent) && !t.isProgram(parent)) return;
  // Don't split a declaration off from a preceding label, etc.
  if (t.isFunctionDeclaration(node)) return; // hoisted; marking it is misleading

  node._sbLine = true;
  const marker = t.expressionStatement(
    t.callExpression(t.identifier('__line'), [t.numericLiteral(node.loc.start.line)]),
  );
  (marker as any)._sbLine = true;
  (marker as any)._sbSynthetic = true;
  path.insertBefore(marker);
}
