import { TABS } from '../constants/theme';

// Panel kanan, hanya tampil di desktop (>= md)
export default function SidePanel({ tab, setTab, children }) {
  return (
    <aside className="hidden md:flex md:flex-col w-80 shrink-0 bg-slate-900 border-l border-slate-800">
      <nav className="flex border-b border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 h-12 text-sm ${tab === t.id ? 'bg-slate-800 font-semibold' : 'text-slate-400'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </aside>
  );
}
