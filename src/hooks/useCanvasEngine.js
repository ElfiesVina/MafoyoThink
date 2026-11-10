import { useCallback, useEffect, useRef } from 'react';
import useHistory from './useHistory';
import { canvasToDataUrl, drawTextOnCanvas, exportPng } from '../lib/canvasUtils';

const INCREMENTAL = ['pencil', 'eraser']; // digambar langsung (anti-lag)

export default function useCanvasEngine({ tool, color, size }) {
  const canvasRef = useRef(null);
  const opts = useRef({ tool, color, size });
  opts.current = { tool, color, size };

  const history = useHistory();
  const hist = useRef(history);
  hist.current = history;

  const snap = () => {
    const c = canvasRef.current;
    return c.getContext('2d').getImageData(0, 0, c.width, c.height);
  };

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return undefined;
    const ctx = c.getContext('2d', { willReadFrequently: true });

    let initialized = false;
    let drawing = false;
    let start = null;
    let end = null;
    let last = null;
    let prevMid = null;
    let base = null;
    let pts = [];
    let raf = 0;

    const dpr = () => window.devicePixelRatio || 1;
    const pos = (e) => {
      const r = c.getBoundingClientRect();
      const d = dpr();
      return { x: (e.clientX - r.left) * d, y: (e.clientY - r.top) * d };
    };

    const applyStyle = () => {
      const { tool: t, color: col, size: s } = opts.current;
      const d = dpr();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1;
      ctx.strokeStyle = col;
      ctx.lineWidth = s * d;
      if (t === 'marker') {
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = s * d * 3;
      }
      if (t === 'eraser') {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = s * d * 4;
      }
    };

    const strokePath = (p) => {
      ctx.beginPath();
      ctx.moveTo(p[0].x, p[0].y);
      if (p.length === 1) {
        ctx.lineTo(p[0].x + 0.01, p[0].y);
      } else {
        for (let i = 1; i < p.length - 1; i += 1) {
          const mx = (p[i].x + p[i + 1].x) / 2;
          const my = (p[i].y + p[i + 1].y) / 2;
          ctx.quadraticCurveTo(p[i].x, p[i].y, mx, my);
        }
        const l = p[p.length - 1];
        ctx.lineTo(l.x, l.y);
      }
      ctx.stroke();
    };

    const renderPreview = () => {
      raf = 0;
      if (!base) return;
      const t = opts.current.tool;
      ctx.putImageData(base, 0, 0);
      applyStyle();
      if (t === 'marker') {
        strokePath(pts);
      } else if (end) {
        if (t === 'line') {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        } else if (t === 'rect') {
          ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
        } else if (t === 'circle') {
          ctx.beginPath();
          ctx.ellipse(
            (start.x + end.x) / 2, (start.y + end.y) / 2,
            Math.abs(end.x - start.x) / 2, Math.abs(end.y - start.y) / 2,
            0, 0, Math.PI * 2
          );
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const onDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      try { c.setPointerCapture(e.pointerId); } catch { /* abaikan */ }
      drawing = true;
      const p = pos(e);
      start = p; end = null; last = p; prevMid = p; pts = [p];
      applyStyle();
      if (INCREMENTAL.includes(opts.current.tool)) {
        base = null;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 0.01, p.y);
        ctx.stroke();
      } else {
        base = snap();
        if (opts.current.tool === 'marker') renderPreview();
      }
    };

    const onMove = (e) => {
      if (!drawing) return;
      const evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
      const list = evs.length ? evs : [e];
      const t = opts.current.tool;
      list.forEach((ev) => {
        const p = pos(ev);
        if (INCREMENTAL.includes(t)) {
          const mid = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 };
          applyStyle();
          ctx.beginPath();
          ctx.moveTo(prevMid.x, prevMid.y);
          ctx.quadraticCurveTo(last.x, last.y, mid.x, mid.y);
          ctx.stroke();
          prevMid = mid;
          last = p;
        } else if (t === 'marker') {
          pts.push(p);
        } else {
          end = p;
        }
      });
      if (!INCREMENTAL.includes(t) && !raf) raf = requestAnimationFrame(renderPreview);
    };

    const onUp = (e) => {
      if (!drawing) return;
      drawing = false;
      try { c.releasePointerCapture(e.pointerId); } catch { /* abaikan */ }
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (INCREMENTAL.includes(opts.current.tool)) {
        applyStyle();
        ctx.beginPath();
        ctx.moveTo(prevMid.x, prevMid.y);
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      } else {
        renderPreview();
      }
      ctx.globalAlpha = 1;
      base = null;
      hist.current.push(snap());
    };

    // ukuran kanvas hanya membesar (agar gambar tidak terpotong saat keyboard muncul)
    const resize = () => {
      const p = c.parentElement;
      const d = dpr();
      const w = Math.max(Math.round(p.clientWidth * d), c.width > 300 || initialized ? c.width : 0);
      const h = Math.max(Math.round(p.clientHeight * d), c.height > 150 || initialized ? c.height : 0);
      if (!w || !h) return;
      if (initialized && w === c.width && h === c.height) return;
      let tmp = null;
      if (initialized) {
        tmp = document.createElement('canvas');
        tmp.width = c.width;
        tmp.height = c.height;
        tmp.getContext('2d').drawImage(c, 0, 0);
      }
      c.width = w;
      c.height = h;
      c.style.width = `${w / d}px`;
      c.style.height = `${h / d}px`;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      if (tmp) ctx.drawImage(tmp, 0, 0);
      initialized = true;
      hist.current.reset(snap());
    };

    const prevent = (e) => e.preventDefault();
    c.addEventListener('pointerdown', onDown);
    c.addEventListener('pointermove', onMove);
    c.addEventListener('pointerup', onUp);
    c.addEventListener('pointercancel', onUp);
    c.addEventListener('contextmenu', prevent);
    const ro = new ResizeObserver(resize);
    ro.observe(c.parentElement);
    resize();

    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      c.removeEventListener('pointerdown', onDown);
      c.removeEventListener('pointermove', onMove);
      c.removeEventListener('pointerup', onUp);
      c.removeEventListener('pointercancel', onUp);
      c.removeEventListener('contextmenu', prevent);
    };
  }, []);

  const undo = useCallback(() => {
    const s = hist.current.undo();
    if (s) canvasRef.current.getContext('2d').putImageData(s, 0, 0);
  }, []);

  const redo = useCallback(() => {
    const s = hist.current.redo();
    if (s) canvasRef.current.getContext('2d').putImageData(s, 0, 0);
  }, []);

  const clear = useCallback(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    hist.current.push(snap());
  }, []);

  const drawText = useCallback((text) => {
    drawTextOnCanvas(canvasRef.current, text, { color: opts.current.color === '#ffffff' ? '#111827' : opts.current.color });
    hist.current.push(snap());
  }, []);

  const exportImage = useCallback(() => exportPng(canvasRef.current), []);
  const getImage = useCallback(() => canvasToDataUrl(canvasRef.current), []);

  return {
    canvasRef,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    undo, redo, clear, drawText, exportImage, getImage,
  };
}
