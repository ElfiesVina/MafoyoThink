// Key milik PENGGUNA, disimpan di localStorage perangkatnya.
// Tidak ada key yang ditanam di kode / APK / GitHub.
const KEY_STORE = 'mafoyo_gemini_key';
export const DEFAULT_MODEL = 'gemini-2.5-flash'; // ganti di sini bila model berubah

export const getApiKey = () => {
  try { return localStorage.getItem(KEY_STORE) || ''; } catch { return ''; }
};
export const saveApiKey = (key) => {
  try { localStorage.setItem(KEY_STORE, key); } catch { /* abaikan */ }
};
export const clearApiKey = () => {
  try { localStorage.removeItem(KEY_STORE); } catch { /* abaikan */ }
};

export async function askGemini({ apiKey, prompt, imageDataUrl = null, model = DEFAULT_MODEL, signal }) {
  if (!apiKey) throw new Error('Isi Gemini API key dulu di tab AI.');
  if (!prompt || !prompt.trim()) throw new Error('Tulis pertanyaan / perintah dulu.');

  const parts = [{ text: prompt }];
  if (imageDataUrl) {
    const [meta, data] = imageDataUrl.split(',');
    const mime = /data:(.*?);/.exec(meta)?.[1] || 'image/jpeg';
    parts.push({ inlineData: { mimeType: mime, data } });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({ contents: [{ role: 'user', parts }] }),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Gagal memanggil Gemini (${res.status})`);
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim();
  if (!text) throw new Error('Gemini tidak mengembalikan jawaban.');
  return text;
}
