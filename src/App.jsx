import { useState } from 'react';
import TopBar from './components/TopBar';
import CanvasStage from './components/CanvasStage';
import SidePanel from './components/SidePanel';
import FooterBar from './components/FooterBar';
import DrawPanel from './components/panels/DrawPanel';
import AiPanel from './components/panels/AiPanel';
import MathPanel from './components/panels/MathPanel';
import useCanvasEngine from './hooks/useCanvasEngine';
import useOnlineStatus from './hooks/useOnlineStatus';
import { COLORS, TABS } from './constants/theme';

export default function App() {
  const [tab, setTab] = useState('draw');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(4);

  const online = useOnlineStatus();
  const engine = useCanvasEngine({ tool, color, size });

  const panel = {
    draw: <DrawPanel {...{ tool, setTool, color, setColor, size, setSize }} />,
    ai: <AiPanel online={online} getImage={engine.getImage} />,
    math: <MathPanel onWrite={engine.drawText} />,
  }[tab];

  // HP: tap tab aktif = tutup sheet, tab lain = buka
  const pickMobile = (id) => {
    if (sheetOpen && tab === id) setSheetOpen(false);
    else { setTab(id); setSheetOpen(true); }
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar
        online={online}
        canUndo={engine.canUndo} canRedo={engine.canRedo}
        onUndo={engine.undo} onRedo={engine.redo}
        onClear={engine.clear} onExport={engine.exportImage}
      />

      <main className="relative flex flex-1 min-h-0">
        <CanvasStage canvasRef={engine.canvasRef} tool={tool} />
        <SidePanel tab={tab} setTab={setTab}>{panel}</SidePanel>

        {/* Bottom-sheet khusus HP */}
        {sheetOpen && (
          <section className="md:hidden absolute inset-x-0 bottom-0 max-h-[60%] flex flex-col rounded-t-2xl bg-slate-900 border-t border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between px-4 h-10 shrink-0">
              <span className="text-sm font-semibold">{TABS.find((t) => t.id === tab)?.label}</span>
              <button onClick={() => setSheetOpen(false)} className="h-10 w-10 text-lg" aria-label="Tutup">✕</button>
            </div>
            <div className="overflow-y-auto px-4 pb-4">{panel}</div>
          </section>
        )}
      </main>

      <FooterBar tab={tab} sheetOpen={sheetOpen} onPick={pickMobile} />
    </div>
  );
}
