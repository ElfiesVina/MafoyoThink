import { TABS } from '../constants/theme';

// Tombol tools di bawah, hanya di HP (< md)
export default function FooterBar({ tab, sheetOpen, onPick }) {
  return (
    <footer className="md:hidden flex shrink-0 bg-slate-900 border-t border-slate-800 safe-bottom">
      {TABS.map((t) => {
        const active = sheetOpen && tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onPick(t.id)}
            className={`flex-1 h-12 flex flex-col items-center justify-center text-[11px] ${
              active ? 'bg-slate-800 text-indigo-300' : 'text-slate-300'
            }`}
          >
            <span className="text-lg leading-none">{t.icon}</span>
            {t.label}
          </button>
        );
      })}
    </footer>
  );
}
