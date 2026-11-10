export default function CanvasStage({ canvasRef, tool }) {
  return (
    <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 block"
        style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
      />
    </div>
  );
}
