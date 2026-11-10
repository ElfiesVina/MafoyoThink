import { useState } from 'react';
import { TEXT } from '../../constants/theme';
import { askGemini, clearApiKey, getApiKey, saveApiKey } from '../../services/geminiService';

export default function AiPanel({ online, getImage }) {
  const [key, setKey] = useState(getApiKey());
  const [saved, setSaved] = useState(!!getApiKey());
  const [prompt, setPrompt] = useState('');
  const [withCanvas, setWithCanvas] = useState(true);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const save = () => { saveApiKey(key.trim()); setSaved(!!key.trim()); };
  const remove = () => { clearApiKey(); setKey(''); setSaved(false); };

  const send = async () => {
    setError(''); setAnswer(''); setLoading(true);
    try {
      const text = await askGemini({
        apiKey: getApiKey(),
        prompt,
        imageDataUrl: withCanvas ? getImage() : null,
      });
      setAnswer(text);
    } catch (e) {
      setError(e.message || 'Gagal');
    } finally {
      setLoading(false);
    }
  };

  const input = 'w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm';
  return (
    <div className="space-y-4">
      {!online && <p className="text-amber-400 text-sm">{TEXT.aiNeedsOnline}</p>}

      <section className="space-y-2">
        <h3 className="text-xs uppercase tracking-wide text-slate-400">Gemini API key</h3>
        <input
          type="password" className={input} placeholder="AIza..."
          value={key} onChange={(e) => setKey(e.target.value)} autoComplete="off"
        />
        <div className="flex gap-2">
          <button onClick={save} className="flex-1 h-10 rounded-lg bg-indigo-600 text-sm">
            {saved ? 'Tersimpan ✓' : 'Simpan key'}
          </button>
          {saved && (
            <button onClick={remove} className="h-10 px-3 rounded-lg bg-slate-800 text-sm">Hapus</button>
          )}
        </div>
        <p className="text-[11px] text-slate-400">
          {TEXT.aiKeyHint} Dapatkan key di aistudio.google.com/apikey
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs uppercase tracking-wide text-slate-400">Prompt</h3>
        <textarea
          rows={4} className={input} placeholder="Tanya sesuatu, atau minta AI menjelaskan gambarmu…"
          value={prompt} onChange={(e) => setPrompt(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={withCanvas} onChange={(e) => setWithCanvas(e.target.checked)} />
          Sertakan gambar kanvas
        </label>
        <button
          onClick={send} disabled={loading || !online}
          className="w-full h-11 rounded-lg bg-indigo-600 disabled:opacity-40 text-sm font-semibold"
        >
          {loading ? 'Memproses…' : 'Kirim ke Gemini'}
        </button>
      </section>

      {error && <p className="text-red-400 text-sm break-words">{error}</p>}
      {answer && (
        <div className="rounded-lg bg-slate-800 p-3 text-sm whitespace-pre-wrap break-words select-text">
          {answer}
        </div>
      )}
    </div>
  );
}
