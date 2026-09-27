"use client";

// Patch Node.prototype to protect React reconciliation from browser translation extensions
// (Google Chrome Translate, Apple Safari Translate, Yandex Translate) which mutate text nodes
// by wrapping them in <font> tags.
if (typeof window !== "undefined" && typeof Node !== "undefined") {
  const nodeProto = Node.prototype as any;

  if (!nodeProto.__openlabs_patched) {
    nodeProto.__openlabs_patched = true;

    const originalRemoveChild = nodeProto.removeChild;
    nodeProto.removeChild = function <T extends Node>(child: T): T {
      if (!child) return child;
      if (child.parentNode !== this) {
        // Child was wrapped in a <font> tag by Google/Safari Translate or moved by an extension
        if (child.parentNode) {
          try {
            return originalRemoveChild.apply(child.parentNode, [child]);
          } catch {
            return child;
          }
        }
        return child;
      }
      try {
        return originalRemoveChild.apply(this, [child]);
      } catch (err: any) {
        if (
          err?.name === "NotFoundError" ||
          err?.message?.includes("not a child") ||
          err?.message?.includes("not be found")
        ) {
          return child;
        }
        throw err;
      }
    };

    const originalInsertBefore = nodeProto.insertBefore;
    nodeProto.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
      if (!newNode) return newNode;
      if (referenceNode && referenceNode.parentNode !== this) {
        if (referenceNode.parentNode) {
          try {
            return originalInsertBefore.apply(referenceNode.parentNode, [newNode, referenceNode]);
          } catch {
            return originalInsertBefore.apply(this, [newNode, null]);
          }
        }
        return originalInsertBefore.apply(this, [newNode, null]);
      }
      try {
        return originalInsertBefore.apply(this, [newNode, referenceNode]);
      } catch (err: any) {
        if (
          err?.name === "NotFoundError" ||
          err?.message?.includes("not a child") ||
          err?.message?.includes("not be found")
        ) {
          return originalInsertBefore.apply(this, [newNode, null]);
        }
        throw err;
      }
    };
  }
}

export default function TranslationGuard() {
  return null;
}
