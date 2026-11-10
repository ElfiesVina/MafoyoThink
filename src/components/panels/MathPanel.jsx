import { useState } from 'react';
import { MATH_PRESETS } from '../../constants/theme';
import { calculate } from '../../lib/mathEvaluator';

export default function MathPanel({ onWrite }) {
  const [input, setInput] = useState('');
  const [degrees, setDegrees] = useState(true);
  const [result, setResult] = useState(null);
  const [log, setLog] = useState([]);

  const run = (expr = input) => {
    const r = calculate(expr, { degrees });
    setResult(r);
    if (r.ok) setLog((l) => [{ expr, text: r.text }, ...l].slice(0, 8));
  };
  const pick = (expr) => { setInput(expr); run(expr); };

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <input
          className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-3 text-base"
          placeholder="mis. sin(30)+2^3  atau  2x+6=14"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          autoCapitalize="off" autoCorrect="off" spellCheck={false}
        />
        <div className="flex items-center gap-2">
          <button onClick={() => run()} className="flex-1 h-11 rounded-lg bg-indigo-600 font-semibold text-sm">
            Hitung
          </button>
          <button
            onClick={() => setDegrees((d) => !d)}
            className="h-11 px-3 rounded-lg bg-slate-800 text-sm"
          >
            {degrees ? 'DEG' : 'RAD'}
          </button>
        </div>
        {result && (
          <div className={`rounded-lg p-3 text-lg break-words select-text ${result.ok ? 'bg-slate-800' : 'bg-red-950 text-red-300 text-sm'}`}>
            {result.text}
          </div>
        )}
        {result?.ok && (
          <button
            onClick={() => onWrite(`${input} → ${result.text}`)}
            className="w-full h-10 rounded-lg bg-slate-800 text-sm"
          >
            Tulis ke kanvas
          </button>
        )}
      </section>

      <section>
        <h3 className="text-xs uppercase tracking-wide text-slate-400 mb-2">Preset</h3>
        <div className="flex flex-wrap gap-2">
          {MATH_PRESETS.map((p) => (
            <button key={p.label} onClick={() => pick(p.expr)} className="h-10 px-3 rounded-lg bg-slate-800 text-sm">
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {log.length > 0 && (
        <section>
          <h3 className="text-xs uppercase tracking-wide text-slate-400 mb-2">Riwayat</h3>
          <ul className="space-y-1 text-sm text-slate-300">
            {log.map((l, i) => (
              <li key={i} className="break-words">{l.expr} → <b>{l.text}</b></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
