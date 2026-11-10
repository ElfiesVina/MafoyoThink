import { TEXT } from '../constants/theme';

export default function TopBar({ online, canUndo, canRedo, onUndo, onRedo, onClear, onExport }) {
  const btn =
    'h-10 min-w-10 px-2 rounded-lg bg-slate-800 active:bg-slate-700 disabled:opacity-30 text-lg';
  return (
    <header className="flex items-center justify-between gap-2 px-3 h-12 shrink-0 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-bold truncate">{TEXT.appName}</span>
        <span className={`text-[11px] px-2 py-0.5 rounded-full ${online ? 'bg-emerald-600' : 'bg-amber-600'}`}>
          {online ? TEXT.online : TEXT.offline}
        </span>
      </div>
      <div className="flex gap-1">
        <button className={btn} onClick={onUndo} disabled={!canUndo} aria-label="Undo">↩</button>
        <button className={btn} onClick={onRedo} disabled={!canRedo} aria-label="Redo">↪</button>
        <button className={btn} onClick={onClear} aria-label="Bersihkan">🗑️</button>
        <button className={btn} onClick={onExport} aria-label="Ekspor PNG">💾</button>
      </div>
    </header>
  );
}
