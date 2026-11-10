// Evaluator matematika AMAN (tanpa eval). Mendukung:
//  + - * / ^ ( ) , perkalian implisit (2x, 3(4+1)), konstanta pi & e,
//  fungsi sin cos tan asin acos atan sqrt abs log ln exp floor ceil round
//  sin/cos/tan memakai DERAJAT secara default (sin(90)=1, cos(60)=0.5).
//  Persamaan linear & kuadrat dengan variabel x, mis. "2x+6=14", "x^2-5x+6=0".

const clean = (v) => (Math.abs(v) < 1e-12 ? 0 : Number(v.toPrecision(12)));

function makeFuncs(degrees) {
  const toRad = (v) => (degrees ? (v * Math.PI) / 180 : v);
  const fromRad = (v) => (degrees ? (v * 180) / Math.PI : v);
  return {
    sin: (v) => Math.sin(toRad(v)),
    cos: (v) => Math.cos(toRad(v)),
    tan: (v) => {
      const c = clean(Math.cos(toRad(v)));
      return c === 0 ? NaN : Math.sin(toRad(v)) / Math.cos(toRad(v));
    },
    asin: (v) => fromRad(Math.asin(v)),
    acos: (v) => fromRad(Math.acos(v)),
    atan: (v) => fromRad(Math.atan(v)),
    sqrt: Math.sqrt,
    abs: Math.abs,
    log: Math.log10,
    ln: Math.log,
    exp: Math.exp,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
  };
}

const CONSTS = { pi: Math.PI, e: Math.E };

function tokenize(src, funcs) {
  const s = src
    .replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
    .replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/\s+/g, '');
  const raw = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    let m;
    if ((m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)))) {
      raw.push({ t: 'num', v: parseFloat(m[1]) });
      i += m[1].length;
    } else if ((m = /^[a-zA-Z_]+/.exec(s.slice(i)))) {
      raw.push({ t: 'id', v: m[0].toLowerCase() });
      i += m[0].length;
    } else if ('+-*/^(),'.includes(ch)) {
      raw.push({ t: 'op', v: ch });
      i += 1;
    } else {
      throw new Error(`Karakter tidak dikenal: "${ch}"`);
    }
  }
  // perkalian implisit
  const out = [];
  raw.forEach((tok, idx) => {
    const prev = raw[idx - 1];
    if (prev) {
      const prevIsValue =
        prev.t === 'num' || (prev.t === 'op' && prev.v === ')') ||
        (prev.t === 'id' && !funcs[prev.v]);
      const curStarts =
        (tok.t === 'num' && prev.t !== 'num') || tok.t === 'id' || (tok.t === 'op' && tok.v === '(');
      if (prevIsValue && curStarts) out.push({ t: 'op', v: '*' });
    }
    out.push(tok);
  });
  return out;
}

export function evaluate(expr, { degrees = true, vars = {} } = {}) {
  const funcs = makeFuncs(degrees);
  const tokens = tokenize(expr, funcs);
  let p = 0;
  const peek = () => tokens[p];
  const eat = (v) => {
    if (peek() && peek().t === 'op' && peek().v === v) { p += 1; return true; }
    return false;
  };

  function parseExpr() {
    let v = parseTerm();
    for (;;) {
      if (eat('+')) v += parseTerm();
      else if (eat('-')) v -= parseTerm();
      else return v;
    }
  }
  function parseTerm() {
    let v = parseUnary();
    for (;;) {
      if (eat('*')) v *= parseUnary();
      else if (eat('/')) v /= parseUnary();
      else return v;
    }
  }
  function parseUnary() {
    if (eat('-')) return -parseUnary();
    if (eat('+')) return parseUnary();
    return parsePower();
  }
  function parsePower() {
    const base = parsePrimary();
    if (eat('^')) return base ** parseUnary();
    return base;
  }
  function parsePrimary() {
    const tok = peek();
    if (!tok) throw new Error('Ekspresi belum lengkap');
    p += 1;
    if (tok.t === 'num') return tok.v;
    if (tok.t === 'id') {
      if (funcs[tok.v]) {
        if (!eat('(')) throw new Error(`Fungsi ${tok.v} butuh tanda kurung`);
        const arg = parseExpr();
        if (!eat(')')) throw new Error('Kurung tutup kurang');
        return funcs[tok.v](arg);
      }
      if (tok.v in vars) return vars[tok.v];
      if (tok.v in CONSTS) return CONSTS[tok.v];
      throw new Error(`Tidak dikenal: ${tok.v}`);
    }
    if (tok.v === '(') {
      const v = parseExpr();
      if (!eat(')')) throw new Error('Kurung tutup kurang');
      return v;
    }
    throw new Error(`Simbol tidak terduga: ${tok.v}`);
  }

  const result = parseExpr();
  if (p < tokens.length) throw new Error('Ekspresi tidak valid');
  return result;
}

export function formatNumber(v) {
  if (!Number.isFinite(v)) return 'Tidak terdefinisi';
  return String(Number(clean(v).toPrecision(10)));
}

function solveEquation(input, degrees) {
  const [lhs, rhs, ...rest] = input.split('=');
  if (rest.length || rhs === undefined || !lhs.trim() || !rhs.trim()) {
    throw new Error('Format persamaan: ruas kiri = ruas kanan');
  }
  const f = (x) => evaluate(lhs, { degrees, vars: { x } }) - evaluate(rhs, { degrees, vars: { x } });
  const f0 = f(0), f1 = f(1), fm1 = f(-1), f2 = f(2);
  const c = f0;
  const a = (f1 + fm1) / 2 - c;
  const b = (f1 - fm1) / 2;
  const tol = 1e-9 * (1 + Math.abs(f2));
  if (Math.abs(4 * a + 2 * b + c - f2) > tol) {
    throw new Error('Hanya persamaan linear / kuadrat dengan variabel x');
  }
  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) < 1e-12) {
      return Math.abs(c) < 1e-12 ? 'Semua nilai x memenuhi' : 'Tidak ada solusi';
    }
    return `x = ${formatNumber(-c / b)}`;
  }
  const D = b * b - 4 * a * c;
  if (D < 0) return `Tidak ada akar real (D = ${formatNumber(D)})`;
  if (Math.abs(D) < 1e-12) return `x = ${formatNumber(-b / (2 * a))}`;
  const r = Math.sqrt(D);
  return `x₁ = ${formatNumber((-b + r) / (2 * a))},  x₂ = ${formatNumber((-b - r) / (2 * a))}`;
}

// Fungsi utama untuk UI. Mengembalikan { ok, text }.
export function calculate(input, { degrees = true } = {}) {
  try {
    if (!input.trim()) return { ok: false, text: 'Tulis ekspresi dulu' };
    if (input.includes('=')) return { ok: true, text: solveEquation(input, degrees) };
    return { ok: true, text: formatNumber(evaluate(input, { degrees })) };
  } catch (err) {
    return { ok: false, text: err.message || 'Gagal menghitung' };
  }
}
