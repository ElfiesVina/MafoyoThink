import { useState } from 'react';
import { evaluateExpression } from '../lib/math.js';
import { Calculator, RotateCcw } from 'lucide-react';

export default function MathSolver() {
  const [expression,setExpression]=useState('');
  const [result,setResult]=useState(null);
  const [error,setError]=useState('');
  const solve = () => {
    const value=evaluateExpression(expression);
    if(value===null){setResult(null);setError('Ekspresi tidak valid. Periksa kembali penulisannya.');}
    else {setResult(value);setError('');}
  };
  const reset=()=>{setExpression('');setResult(null);setError('');};
  return <div className="panel solver-panel">
    <div className="section-icon"><Calculator size={22}/></div>
    <h2>Kalkulator matematika</h2>
    <p className="muted">Masukkan operasi matematika. Mendukung kurung, pangkat, akar, dan fungsi trigonometri.</p>
    <label className="field-label" htmlFor="math-expression">Ekspresi</label>
    <div className="expression-row"><input id="math-expression" className="expression-input" value={expression} onChange={e=>setExpression(e.target.value)} onKeyDown={e=>e.key==='Enter'&&solve()} placeholder="Contoh: (25 × 4) + sqrt(81)"/><button className="primary-btn" onClick={solve}>Hitung</button></div>
    <div className="math-keys">{['7','8','9','÷','4','5','6','×','1','2','3','−','0','.','(',')','π','^','sqrt(','sin(','cos(','tan('].map(k=><button key={k} onClick={()=>setExpression(v=>v+(k==='÷'?'/':k==='×'?'*':k==='−'?'-':k))}>{k}</button>)}</div>
    {error&&<p className="error-text" role="alert">{error}</p>}
    {result!==null&&<div className="result-card"><span>HASIL</span><strong>{result}</strong><small>Periksa satuan dan konteks soal sebelum menggunakan hasil.</small></div>}
    <button className="text-btn" onClick={reset}><RotateCcw size={15}/> Reset</button>
    <p className="tiny-note">Fungsi: sin, cos, tan (derajat), log, sqrt, abs, pi, e.</p>
  </div>;
}
