import { useState } from 'react';
import { Calculator, PenTool, Sparkles, Menu } from 'lucide-react';
import CanvasWorkspace from './components/CanvasWorkspace.jsx';
import MathSolver from './components/MathSolver.jsx';
import ImageGenerator from './components/ImageGenerator.jsx';

const tabs = [
  { id: 'draw', label: 'Papan Tulis', icon: PenTool },
  { id: 'math', label: 'Kalkulator', icon: Calculator },
  { id: 'image', label: 'Studio AI', icon: Sparkles },
];

export default function App() {
  const [active, setActive] = useState('draw');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="MafoyuThink beranda">
          <span className="brand-mark"><Sparkles size={20} /></span>
          <span><strong>MafoyuThink</strong><small>Think · Create · Learn</small></span>
        </a>
        <button className="mobile-menu" onClick={() => setMenuOpen(v => !v)} aria-label="Buka menu"><Menu /></button>
        <nav className={menuOpen ? 'tabs tabs-open' : 'tabs'} aria-label="Menu utama">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} className={active === id ? 'tab active' : 'tab'} onClick={() => { setActive(id); setMenuOpen(false); }}>
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>
        <span className="version-pill">BETA</span>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">RUANG BELAJAR DIGITAL</p>
          <h1>{active === 'draw' ? 'Tuangkan idemu.' : active === 'math' ? 'Pahami setiap langkah.' : 'Wujudkan imajinasimu.'}</h1>
          <p className="subtitle">{active === 'draw' ? 'Gambar, tulis, dan susun gagasan di satu tempat.' : active === 'math' ? 'Selesaikan perhitungan dengan hasil yang mudah dipahami.' : 'Buat visual dari deskripsi teks melalui layanan AI milikmu.'}</p>
        </div>
      </section>

      <section className="workspace">
        {active === 'draw' && <CanvasWorkspace />}
        {active === 'math' && <MathSolver />}
        {active === 'image' && <ImageGenerator />}
      </section>
      <footer className="footer"><span>MafoyuThink</span><span>Belajar dengan rasa ingin tahu.</span></footer>
    </main>
  );
}
