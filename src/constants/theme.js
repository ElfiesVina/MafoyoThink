export const COLORS = [
  '#111827', '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff',
];

export const TOOLS = [
  { id: 'pencil', label: 'Pensil', icon: '✏️' },
  { id: 'marker', label: 'Marker', icon: '🖍️' },
  { id: 'eraser', label: 'Penghapus', icon: '🧽' },
  { id: 'line', label: 'Garis', icon: '╱' },
  { id: 'rect', label: 'Kotak', icon: '▭' },
  { id: 'circle', label: 'Lingkaran', icon: '◯' },
];

export const TABS = [
  { id: 'draw', label: 'Draw', icon: '🎨' },
  { id: 'ai', label: 'AI', icon: '✨' },
  { id: 'math', label: 'Math', icon: '🧮' },
];

export const TEXT = {
  appName: 'MafoyoThink',
  online: 'Online',
  offline: 'Offline',
  aiNeedsOnline: 'Tab AI butuh internet.',
  aiKeyHint: 'Key disimpan hanya di perangkat ini (localStorage), tidak ikut di APK/GitHub.',
};

export const MATH_PRESETS = [
  { label: 'sin(30)', expr: 'sin(30)' },
  { label: 'cos(60)', expr: 'cos(60)' },
  { label: 'tan(45)', expr: 'tan(45)' },
  { label: '√144', expr: 'sqrt(144)' },
  { label: '2^10', expr: '2^10' },
  { label: 'Luas lingkaran r=7', expr: 'pi*7^2' },
  { label: '2x+6=14', expr: '2x+6=14' },
  { label: 'x²-5x+6=0', expr: 'x^2-5x+6=0' },
];
