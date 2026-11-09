import { useEffect, useRef, useState } from 'react';
import { Pencil, Highlighter, Eraser, Minus, Square, Circle, ArrowUpRight, Undo2, Redo2, Download, Trash2 } from 'lucide-react';
import { downloadCanvas } from '../lib/export.js';

const tools = [
  ['pencil', 'Pensil', Pencil], ['marker', 'Marker', Highlighter], ['eraser', 'Penghapus', Eraser],
  ['line', 'Garis', Minus], ['rect', 'Persegi', Square], ['circle', 'Lingkaran', Circle], ['arrow', 'Panah', ArrowUpRight],
];

export default function CanvasWorkspace() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const snapshot = useRef(null);
  const history = useRef([]);
  const future = useRef([]);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#172554');
  const [size, setSize] = useState(4);
  const [opacity, setOpacity] = useState(100);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const old = document.createElement('canvas');
      old.width = canvas.width; old.height = canvas.height;
      old.getContext('2d').drawImage(canvas, 0, 0);
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, rect.width, rect.height);
      if (old.width && old.height) ctx.drawImage(old, 0, 0, old.width, old.height, 0, 0, rect.width, rect.height);
      history.current = [canvas.toDataURL()]; future.current = [];
      setCanUndo(false); setCanRedo(false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const point = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const save = () => {
    const canvas = canvasRef.current;
    history.current.push(canvas.toDataURL());
    if (history.current.length > 40) history.current.shift();
    future.current = [];
    setCanUndo(history.current.length > 1); setCanRedo(false);
  };
  const restore = data => {
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current, ctx = c.getContext('2d'), r = c.getBoundingClientRect();
      ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,c.width,c.height);
      ctx.drawImage(img,0,0,c.width,c.height); ctx.restore();
    };
    img.src = data;
  };
  const undo = () => {
    if (history.current.length < 2) return;
    future.current.push(history.current.pop());
    restore(history.current[history.current.length - 1]);
    setCanUndo(history.current.length > 1); setCanRedo(true);
  };
  const redo = () => {
    if (!future.current.length) return;
    const next = future.current.pop(); history.current.push(next); restore(next);
    setCanUndo(true); setCanRedo(future.current.length > 0);
  };
  const begin = e => {
    if (e.button !== undefined && e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const p = point(e), ctx = canvasRef.current.getContext('2d');
    drawing.current = true; start.current = p;
    snapshot.current = ctx.getImageData(0,0,canvasRef.current.width,canvasRef.current.height);
    ctx.beginPath(); ctx.moveTo(p.x,p.y);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = size; ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.globalAlpha = tool === 'marker' ? opacity / 180 : opacity / 100;
    if (tool === 'pencil' || tool === 'marker' || tool === 'eraser') ctx.lineTo(p.x + 0.1,p.y + 0.1);
  };
  const move = e => {
    if (!drawing.current) return;
    const p = point(e), ctx = canvasRef.current.getContext('2d');
    if (['pencil','marker','eraser'].includes(tool)) {
      ctx.lineTo(p.x,p.y); ctx.stroke();
      return;
    }
    ctx.putImageData(snapshot.current,0,0);
    ctx.save(); ctx.setTransform(window.devicePixelRatio || 1,0,0,window.devicePixelRatio || 1,0,0);
    ctx.beginPath(); ctx.strokeStyle = color; ctx.globalAlpha = opacity / 100; ctx.lineWidth = size;
    const a = start.current, dx = p.x-a.x, dy = p.y-a.y;
    if (tool === 'line') { ctx.moveTo(a.x,a.y); ctx.lineTo(p.x,p.y); }
    if (tool === 'rect') ctx.rect(a.x,a.y,dx,dy);
    if (tool === 'circle') { ctx.ellipse(a.x+dx/2,a.y+dy/2,Math.abs(dx/2),Math.abs(dy/2),0,0,Math.PI*2); }
    if (tool === 'arrow') {
      const angle = Math.atan2(dy,dx), head = Math.max(10,size*3);
      ctx.moveTo(a.x,a.y); ctx.lineTo(p.x,p.y);
      ctx.lineTo(p.x-head*Math.cos(angle-Math.PI/6),p.y-head*Math.sin(angle-Math.PI/6));
      ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-head*Math.cos(angle+Math.PI/6),p.y-head*Math.sin(angle+Math.PI/6));
    }
    ctx.stroke(); ctx.restore();
  };
  const end = () => { if (!drawing.current) return; drawing.current = false; const ctx=canvasRef.current.getContext('2d'); ctx.globalAlpha=1; save(); };
  const clear = () => {
    const c=canvasRef.current,ctx=c.getContext('2d'),r=c.getBoundingClientRect();
    ctx.save(); ctx.setTransform(1,0,0,1,0,0); ctx.fillStyle='#fff'; ctx.fillRect(0,0,c.width,c.height); ctx.restore(); save();
  };

  return <div className="panel canvas-panel">
    <div className="panel-toolbar">
      <div className="tool-group">{tools.map(([id,label,Icon])=><button key={id} title={label} aria-label={label} className={tool===id?'tool-btn selected':'tool-btn'} onClick={()=>setTool(id)}><Icon size={18}/></button>)}</div>
      <div className="action-group">
        <button className="icon-btn" title="Undo" onClick={undo} disabled={!canUndo}><Undo2 size={18}/></button>
        <button className="icon-btn" title="Redo" onClick={redo} disabled={!canRedo}><Redo2 size={18}/></button>
        <button className="icon-btn" title="Bersihkan papan" onClick={clear}><Trash2 size={18}/></button>
        <button className="primary-btn small" onClick={()=>downloadCanvas(canvasRef.current)}><Download size={16}/> Simpan PNG</button>
      </div>
    </div>
    <div className="canvas-options">
      <label>Warna <input aria-label="Warna kuas" type="color" value={color} onChange={e=>setColor(e.target.value)}/></label>
      <label>Ukuran <input type="range" min="1" max="32" value={size} onChange={e=>setSize(Number(e.target.value))}/><span>{size}px</span></label>
      <label>Opasitas <input type="range" min="10" max="100" value={opacity} onChange={e=>setOpacity(Number(e.target.value))}/><span>{opacity}%</span></label>
      <span className="hint">Gunakan jari, mouse, atau stylus.</span>
    </div>
    <div className="canvas-wrap"><canvas ref={canvasRef} onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onPointerLeave={end} /></div>
  </div>;
}
