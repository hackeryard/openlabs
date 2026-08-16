export type ASTNode =
  | { type: "number"; value: number }
  | { type: "symbol"; name: "x" | "pi" | "e" }
  | { type: "unary"; operator: "+" | "-"; argument: ASTNode }
  | { type: "binary"; operator: "+" | "-" | "*" | "/" | "^" | "%"; left: ASTNode; right: ASTNode }
  | { type: "function"; name: string; args: ASTNode[] };

export interface CompiledExpression {
  evaluate: (scope: { x: number }) => number;
  ast: ASTNode;
}

export interface ParsedFunction {
  expression: string;
  compiled: CompiledExpression | null;
  isValid: boolean;
  errorMessage?: string;
  usedSymbols: string[];
}

export interface FunctionPreset {
  id: string;
  category: "Polynomial" | "Trigonometric" | "Rational" | "Exponential" | "Special";
  name: string;
  expression: string;
  description: string;
  recommendedDomain?: [number, number];
  recommendedRange?: [number, number];
}

export const PRESET_FUNCTIONS: FunctionPreset[] = [
  {
    id: "poly-cubic",
    category: "Polynomial",
    name: "Cubic S-Curve",
    expression: "x^3 - 3*x",
    description: "Classic cubic with 3 real roots and two local extrema.",
    recommendedDomain: [-4, 4],
    recommendedRange: [-4, 4],
  },
  {
    id: "poly-parabola",
    category: "Polynomial",
    name: "Quadratic Parabola",
    expression: "x^2 - 4",
    description: "Standard parabola shifted down 4 units, intersecting at ±2.",
    recommendedDomain: [-5, 5],
    recommendedRange: [-6, 6],
  },
  {
    id: "poly-quartic",
    category: "Polynomial",
    name: "W-Curve Quartic",
    expression: "x^4 - 4*x^2 + 1",
    description: "Symmetric double-well potential curve with three turning points.",
    recommendedDomain: [-3, 3],
    recommendedRange: [-4, 4],
  },
  {
    id: "trig-sine",
    category: "Trigonometric",
    name: "Sine Wave",
    expression: "sin(x)",
    description: "Fundamental periodic wave with period 2π and amplitude 1.",
    recommendedDomain: [-6.28, 6.28],
    recommendedRange: [-2, 2],
  },
  {
    id: "trig-damped",
    category: "Trigonometric",
    name: "Damped Harmonic Oscillation",
    expression: "exp(-x/4) * cos(3*x)",
    description: "Decaying sinusoidal wave modeling physical friction and damping.",
    recommendedDomain: [0, 15],
    recommendedRange: [-1.5, 1.5],
  },
  {
    id: "trig-tangent",
    category: "Trigonometric",
    name: "Tangent Curve",
    expression: "tan(x)",
    description: "Periodic function with vertical asymptotes at x = ±π/2, ±3π/2.",
    recommendedDomain: [-4.71, 4.71],
    recommendedRange: [-6, 6],
  },
  {
    id: "rational-hyperbola",
    category: "Rational",
    name: "Reciprocal Hyperbola",
    expression: "1 / x",
    description: "Standard hyperbola with vertical and horizontal asymptotes at 0.",
    recommendedDomain: [-6, 6],
    recommendedRange: [-6, 6],
  },
  {
    id: "rational-witch",
    category: "Rational",
    name: "Witch of Agnesi",
    expression: "1 / (x^2 + 1)",
    description: "Smooth bell-shaped algebraic curve without singularities.",
    recommendedDomain: [-5, 5],
    recommendedRange: [-0.5, 1.5],
  },
  {
    id: "exp-gaussian",
    category: "Exponential",
    name: "Gaussian Normal Distribution",
    expression: "exp(-x^2 / 2)",
    description: "Standard bell curve with peak at x=0 and inflection points at ±1.",
    recommendedDomain: [-4, 4],
    recommendedRange: [-0.2, 1.2],
  },
  {
    id: "exp-logistic",
    category: "Exponential",
    name: "Logistic Sigmoid",
    expression: "1 / (1 + exp(-x))",
    description: "S-shaped growth curve bounded between 0 and 1, used in AI and biology.",
    recommendedDomain: [-6, 6],
    recommendedRange: [-0.2, 1.2],
  },
  {
    id: "special-sinc",
    category: "Special",
    name: "Normalized Sinc Wave",
    expression: "sin(pi * x) / (pi * x)",
    description: "Cardinal sine function used throughout signal processing and Fourier optics.",
    recommendedDomain: [-8, 8],
    recommendedRange: [-0.5, 1.2],
  },
  {
    id: "special-abs",
    category: "Special",
    name: "Absolute Value V-Shape",
    expression: "abs(x) - 2",
    description: "Continuous piecewise function with non-differentiable corner at x=0.",
    recommendedDomain: [-5, 5],
    recommendedRange: [-3, 5],
  },
];

// Whitelist of supported mathematical functions
const ALLOWED_FUNCTIONS = new Set([
  "sin", "cos", "tan",
  "asin", "acos", "atan", "atan2",
  "sinh", "cosh", "tanh",
  "sec", "csc", "cot",
  "sqrt", "cbrt",
  "exp", "log", "ln", "log10", "log2",
  "abs", "floor", "ceil", "round", "sign",
  "min", "max", "pow"
]);

// Whitelist of allowed constants/symbols
const ALLOWED_SYMBOLS = new Set(["x", "pi", "e"]);

// Tokenizer & Parser Implementation
type TokenType = "NUMBER" | "IDENT" | "OP" | "LPAREN" | "RPAREN" | "COMMA" | "EOF";

interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Numbers (e.g. 12, 3.14, .5, 1e-4)
    if (/[0-9]/.test(char) || (char === "." && i + 1 < input.length && /[0-9]/.test(input[i + 1]))) {
      let numStr = "";
      const startPos = i;
      while (i < input.length && /[0-9.]/.test(input[i])) {
        numStr += input[i];
        i++;
      }
      // Scientific notation e.g. 1e-3, 2.5e+4
      if (i < input.length && (input[i] === "e" || input[i] === "E") && i + 1 < input.length && /[0-9+-]/.test(input[i + 1])) {
        numStr += input[i];
        i++;
        if (input[i] === "+" || input[i] === "-") {
          numStr += input[i];
          i++;
        }
        while (i < input.length && /[0-9]/.test(input[i])) {
          numStr += input[i];
          i++;
        }
      }
      tokens.push({ type: "NUMBER", value: numStr, pos: startPos });
      continue;
    }

    // Identifiers (x, sin, pi, exp, etc.)
    if (/[a-zA-Z_π]/.test(char)) {
      let ident = "";
      const startPos = i;
      while (i < input.length && /[a-zA-Z0-9_π]/.test(input[i])) {
        ident += input[i];
        i++;
      }
      tokens.push({ type: "IDENT", value: ident, pos: startPos });
      continue;
    }

    // Operators
    if (["+", "-", "*", "/", "^", "%"].includes(char)) {
      tokens.push({ type: "OP", value: char, pos: i });
      i++;
      continue;
    }

    // Parentheses
    if (char === "(") {
      tokens.push({ type: "LPAREN", value: "(", pos: i });
      i++;
      continue;
    }

    if (char === ")") {
      tokens.push({ type: "RPAREN", value: ")", pos: i });
      i++;
      continue;
    }

    if (char === ",") {
      tokens.push({ type: "COMMA", value: ",", pos: i });
      i++;
      continue;
    }

    // Unsupported character
    throw new Error(`Unexpected character '${char}' at position ${i + 1}`);
  }

  tokens.push({ type: "EOF", value: "", pos: i });
  return tokens;
}

// Insert implicit multiplication tokens (e.g. "2x" -> "2 * x", "3(x+1)" -> "3 * (x+1)", "(x+1)(x-1)" -> "(x+1) * (x-1)")
function insertImplicitMultiplication(tokens: Token[]): Token[] {
  const result: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const current = tokens[i];
    const next = tokens[i + 1];
    result.push(current);

    if (!next || next.type === "EOF") continue;

    const isCurrentValue =
      current.type === "NUMBER" ||
      current.type === "RPAREN" ||
      (current.type === "IDENT" && (ALLOWED_SYMBOLS.has(current.value.toLowerCase()) || current.value === "π"));

    const isNextValue =
      next.type === "NUMBER" ||
      next.type === "LPAREN" ||
      next.type === "IDENT";

    // If current is a function name (e.g. sin) followed by LPAREN, that is function call, not multiplication
    const isFunctionCall =
      current.type === "IDENT" &&
      ALLOWED_FUNCTIONS.has(current.value.toLowerCase()) &&
      next.type === "LPAREN";

    if (isCurrentValue && isNextValue && !isFunctionCall) {
      result.push({ type: "OP", value: "*", pos: current.pos });
    }
  }

  return result;
}

// Recursive Descent Parser
class Parser {
  private tokens: Token[];
  private current: number = 0;
  public usedSymbols: Set<string> = new Set();

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: "EOF", value: "", pos: -1 };
  }

  private advance(): Token {
    const token = this.peek();
    if (token.type !== "EOF") {
      this.current++;
    }
    return token;
  }

  private match(type: TokenType, value?: string): boolean {
    const token = this.peek();
    if (token.type === type && (value === undefined || token.value === value)) {
      this.advance();
      return true;
    }
    return false;
  }

  private expect(type: TokenType, value?: string): Token {
    const token = this.peek();
    if (token.type !== type || (value !== undefined && token.value !== value)) {
      throw new Error(
        `Expected '${value || type}' at position ${token.pos + 1}, found '${token.value || token.type}'`
      );
    }
    return this.advance();
  }

  public parse(): ASTNode {
    const node = this.parseExpression();
    if (this.peek().type !== "EOF") {
      throw new Error(`Unexpected token '${this.peek().value}' after expression`);
    }
    return node;
  }

  // Precedence 1: Addition and Subtraction (+, -)
  private parseExpression(): ASTNode {
    let left = this.parseTerm();

    while (this.match("OP", "+") || this.match("OP", "-")) {
      const op = this.tokens[this.current - 1].value as "+" | "-";
      const right = this.parseTerm();
      left = { type: "binary", operator: op, left, right };
    }

    return left;
  }

  // Precedence 2: Multiplication, Division, Modulo (*, /, %)
  private parseTerm(): ASTNode {
    let left = this.parsePower();

    while (this.match("OP", "*") || this.match("OP", "/") || this.match("OP", "%")) {
      const op = this.tokens[this.current - 1].value as "*" | "/" | "%";
      const right = this.parsePower();
      left = { type: "binary", operator: op, left, right };
    }

    return left;
  }

  // Precedence 3: Exponentiation (^) - Right Associative
  private parsePower(): ASTNode {
    let left = this.parseUnary();

    if (this.match("OP", "^")) {
      const op = "^";
      const right = this.parsePower(); // Right associative recursion
      return { type: "binary", operator: op, left, right };
    }

    return left;
  }

  // Precedence 4: Unary (+, -)
  private parseUnary(): ASTNode {
    if (this.match("OP", "+") || this.match("OP", "-")) {
      const op = this.tokens[this.current - 1].value as "+" | "-";
      const argument = this.parseUnary();
      return { type: "unary", operator: op, argument };
    }

    return this.parsePrimary();
  }

  // Precedence 5: Primary (Numbers, Symbols, Functions, Parentheses)
  private parsePrimary(): ASTNode {
    const token = this.peek();

    // Number literal
    if (this.match("NUMBER")) {
      const val = parseFloat(token.value);
      if (isNaN(val)) {
        throw new Error(`Invalid number '${token.value}' at position ${token.pos + 1}`);
      }
      return { type: "number", value: val };
    }

    // Parentheses grouping: ( expr )
    if (this.match("LPAREN")) {
      const expr = this.parseExpression();
      this.expect("RPAREN");
      return expr;
    }

    // Identifier: Variable, Constant, or Function Call
    if (this.match("IDENT")) {
      const rawName = token.value;
      const lower = rawName.toLowerCase();

      // Check constants/symbols
      if (lower === "x") {
        this.usedSymbols.add("x");
        return { type: "symbol", name: "x" };
      }
      if (lower === "pi" || rawName === "π") {
        this.usedSymbols.add("pi");
        return { type: "symbol", name: "pi" };
      }
      if (lower === "e") {
        this.usedSymbols.add("e");
        return { type: "symbol", name: "e" };
      }

      // Check functions
      let fnName = lower;
      if (fnName === "ln") fnName = "log";

      if (ALLOWED_FUNCTIONS.has(fnName)) {
        this.expect("LPAREN");
        const args: ASTNode[] = [];

        if (this.peek().type !== "RPAREN") {
          args.push(this.parseExpression());
          while (this.match("COMMA")) {
            args.push(this.parseExpression());
          }
        }

        this.expect("RPAREN");
        return { type: "function", name: fnName, args };
      }

      throw new Error(`Unknown identifier '${rawName}' at position ${token.pos + 1}`);
    }

    throw new Error(`Unexpected token '${token.value || token.type}' at position ${token.pos + 1}`);
  }
}

// Evaluate AST directly
function evaluateAST(node: ASTNode, scope: { x: number }): number {
  switch (node.type) {
    case "number":
      return node.value;

    case "symbol":
      if (node.name === "x") return scope.x;
      if (node.name === "pi") return Math.PI;
      if (node.name === "e") return Math.E;
      return NaN;

    case "unary": {
      const arg = evaluateAST(node.argument, scope);
      return node.operator === "-" ? -arg : arg;
    }

    case "binary": {
      const a = evaluateAST(node.left, scope);
      const b = evaluateAST(node.right, scope);

      switch (node.operator) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b === 0 ? (a >= 0 ? Infinity : -Infinity) : a / b;
        case "%": return a % b;
        case "^": {
          if (a < 0 && Math.abs(b % 1) > 0) {
            // Handle fractional roots like (-8)^(1/3) = -2
            const denom = Math.round(1 / b);
            if (denom % 2 !== 0) {
              return -Math.pow(-a, b);
            }
          }
          return Math.pow(a, b);
        }
        default: return NaN;
      }
    }

    case "function": {
      const evaluatedArgs = node.args.map((arg) => evaluateAST(arg, scope));
      const [a, b] = evaluatedArgs;

      switch (node.name) {
        case "sin": return Math.sin(a);
        case "cos": return Math.cos(a);
        case "tan": return Math.tan(a);
        case "asin": return Math.asin(a);
        case "acos": return Math.acos(a);
        case "atan": return Math.atan(a);
        case "atan2": return Math.atan2(a, b);
        case "sinh": return Math.sinh(a);
        case "cosh": return Math.cosh(a);
        case "tanh": return Math.tanh(a);
        case "sec": return 1 / Math.cos(a);
        case "csc": return 1 / Math.sin(a);
        case "cot": return 1 / Math.tan(a);
        case "sqrt": return a < 0 ? NaN : Math.sqrt(a);
        case "cbrt": return Math.cbrt(a);
        case "exp": return Math.exp(a);
        case "log": return a <= 0 ? NaN : Math.log(a);
        case "log10": return a <= 0 ? NaN : Math.log10(a);
        case "log2": return a <= 0 ? NaN : Math.log2(a);
        case "abs": return Math.abs(a);
        case "floor": return Math.floor(a);
        case "ceil": return Math.ceil(a);
        case "round": return Math.round(a);
        case "sign": return Math.sign(a);
        case "min": return Math.min(...evaluatedArgs);
        case "max": return Math.max(...evaluatedArgs);
        case "pow": return Math.pow(a, b);
        default: return NaN;
      }
    }

    default:
      return NaN;
  }
}

// Normalize user typed formulas
export function normalizeExpression(expr: string): string {
  return expr
    .trim()
    .replace(/π/g, "pi")
    .replace(/√\s*\(([^)]+)\)/g, "sqrt($1)")
    .replace(/√\s*([a-zA-Z0-9]+)/g, "sqrt($1)")
    .replace(/(\d+)\s*\/\s*(\d+)/g, "($1/$2)");
}

// Compile Expression AST
export function compileExpression(ast: ASTNode): CompiledExpression {
  return {
    ast,
    evaluate: (scope: { x: number }) => evaluateAST(ast, scope),
  };
}

// Parse mathematical expression safely
export function parseExpression(rawExpr: string): ParsedFunction {
  const normalized = normalizeExpression(rawExpr);

  if (!normalized) {
    return {
      expression: rawExpr,
      compiled: null,
      isValid: false,
      errorMessage: "Please enter a mathematical expression.",
      usedSymbols: [],
    };
  }

  try {
    const rawTokens = tokenize(normalized);
    const tokens = insertImplicitMultiplication(rawTokens);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const compiled = compileExpression(ast);

    return {
      expression: normalized,
      compiled,
      isValid: true,
      usedSymbols: Array.from(parser.usedSymbols),
    };
  } catch (err: any) {
    return {
      expression: rawExpr,
      compiled: null,
      isValid: false,
      errorMessage: err.message || "Invalid mathematical syntax.",
      usedSymbols: [],
    };
  }
}
