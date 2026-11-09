import { useState } from 'react';
import { ImagePlus, Sparkles, Download, AlertCircle } from 'lucide-react';

export default function ImageGenerator() {
  const [prompt,setPrompt]=useState('');
  const [style,setStyle]=useState('realistic');
  const [image,setImage]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const generate=async()=>{
    const endpoint=import.meta.env.VITE_AI_API_URL;
    if(!endpoint){setError('Layanan AI belum dikonfigurasi. Isi VITE_AI_API_URL pada file .env lokal dengan endpoint backend milikmu. Jangan menaruh API key rahasia di aplikasi Android.');return;}
    if(!prompt.trim()){setError('Tulis deskripsi gambar terlebih dahulu.');return;}
    setBusy(true);setError('');setImage('');
    try{
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:prompt.trim(),style})});
      if(!response.ok)throw new Error('Server AI merespons '+response.status);
      const data=await response.json();
      const source=data.imageUrl|| (data.imageBase64? 'data:'+(data.mimeType||'image/png')+';base64,'+data.imageBase64:'');
      if(!source)throw new Error('Respons server tidak berisi imageUrl atau imageBase64.');
      setImage(source);
    }catch(e){setError(e.message||'Gagal menghubungi layanan AI.');}
    finally{setBusy(false);}
  };
  const save=()=>{const a=document.createElement('a');a.href=image;a.download='mafoyuthink-ai.png';a.click();};
  return <div className="panel image-panel">
    <div className="section-icon"><Sparkles size={22}/></div><h2>Studio gambar AI</h2>
    <p className="muted">Jelaskan gambar yang ingin dibuat. Permintaan dikirim ke endpoint backend yang kamu konfigurasi sendiri.</p>
    <label className="field-label" htmlFor="image-prompt">Deskripsi gambar</label>
    <textarea id="image-prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Contoh: ilustrasi tata surya untuk materi pelajaran IPA..." rows="4"/>
    <label className="field-label" htmlFor="image-style">Gaya gambar</label>
    <select id="image-style" value={style} onChange={e=>setStyle(e.target.value)}><option value="realistic">Realistis</option><option value="illustration">Ilustrasi</option><option value="3d">3D</option><option value="anime">Anime</option><option value="minimal">Minimalis</option></select>
    <button className="primary-btn" onClick={generate} disabled={busy}><Sparkles size={17}/>{busy?'Memproses...':'Buat gambar'}</button>
    {error&&<div className="notice"><AlertCircle size={17}/><span>{error}</span></div>}
    {image&&<div className="generated-image"><img src={image} alt={prompt}/><button className="primary-btn small" onClick={save}><Download size={16}/> Simpan gambar</button></div>}
    {!image&&!error&&<div className="image-placeholder"><ImagePlus size={32}/><span>Hasil gambar akan tampil di sini.</span></div>}
  </div>;
}
