import { all, create } from 'mathjs';

// mathjs evaluates expressions without JavaScript eval/new Function.
const math = create(all, {});

export function evaluateExpression(expression) {
  try {
    const normalized = String(expression ?? '')
      .trim()
      .replace(/=$/, '')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/\^/g, '^');

    if (!normalized || normalized.length > 160) return null;
    const scope = {
      sin: value => Math.sin(Number(value) * Math.PI / 180),
      cos: value => Math.cos(Number(value) * Math.PI / 180),
      tan: value => Math.tan(Number(value) * Math.PI / 180),
      log: value => Math.log10(Number(value)),
    };
    const result = math.evaluate(normalized, scope);
    if (typeof result !== 'number' || !Number.isFinite(result)) return null;
    return Number.isInteger(result) ? String(result) : String(Number(result.toFixed(8)));
  } catch {
    return null;
  }
}
