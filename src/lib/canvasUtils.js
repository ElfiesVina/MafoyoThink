// Ekspor kanvas ke PNG (unduh lewat browser).
// Catatan: di dalam APK (WebView) unduhan via <a download> bisa dibatasi;
// untuk simpan ke galeri nanti tambahkan plugin Capacitor Filesystem/Share.
export function exportPng(canvas, name = 'mafoyo-think') {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

export function canvasToDataUrl(canvas, type = 'image/jpeg', quality = 0.8) {
  return canvas.toDataURL(type, quality);
}

// Tulis teks (dengan pembungkus baris) ke kanvas, di pojok kiri-atas.
export function drawTextOnCanvas(canvas, text, { color = '#111827', fontPx = 24 } = {}) {
  const ctx = canvas.getContext('2d');
  const d = window.devicePixelRatio || 1;
  const pad = 24 * d;
  const maxWidth = canvas.width - pad * 2;
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.font = `${fontPx * d}px sans-serif`;
  ctx.textBaseline = 'top';
  let y = pad;
  const lineH = fontPx * d * 1.35;
  String(text).split('\n').forEach((para) => {
    let line = '';
    para.split(' ').forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, pad, y);
        y += lineH;
        line = word;
      } else {
        line = test;
      }
    });
    ctx.fillText(line, pad, y);
    y += lineH;
  });
  ctx.restore();
}
