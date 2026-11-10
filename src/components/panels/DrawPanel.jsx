import { COLORS, TOOLS } from '../../constants/theme';

export default function DrawPanel({ tool, setTool, color, setColor, size, setSize }) {
  const label = 'text-xs uppercase tracking-wide text-slate-400 mb-2';
  return (
    <div className="space-y-4">
      <section>
        <h3 className={label}>Alat</h3>
        <div className="grid grid-cols-3 gap-2">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`h-12 rounded-lg flex flex-col items-center justify-center ${
                tool === t.id ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              <span className="text-[11px]">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className={label}>Warna</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Warna ${c}`}
              className={`w-10 h-10 rounded-full border-2 ${
                color === c ? 'border-indigo-400 scale-110' : 'border-slate-600'
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className={label}>Ukuran: {size}px</h3>
        <input
          type="range" min="1" max="40" value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full h-10"
        />
      </section>
    </div>
  );
}
