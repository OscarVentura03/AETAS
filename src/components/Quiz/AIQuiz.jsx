import { useState } from "react";
import { C, F } from "../../utils/constants";
import { CHAPTERS } from "../../data/chapters";
import { QUESTIONS } from "../../data/questions";

export default function AIQuiz({ onChapterSet }) {
  const [current,  setCurrent]  = useState(0);
  const [scores,   setScores]   = useState([0,0,0,0,0]);
  const [selected, setSelected] = useState(null);
  const [result,   setResult]   = useState(null);
  const [dotVals,  setDotVals]  = useState(Array(5).fill(null));

  const handleSelect = (i) => {
    setSelected(i);
    const dv = [...dotVals]; dv[current] = QUESTIONS[current].vals[i]; setDotVals(dv);
  };

  const next = () => {
    if (selected === null) return;
    const sc = [...scores]; sc[current] = selected; setScores(sc);
    if (current < QUESTIONS.length - 1) { setCurrent(current + 1); setSelected(null); }
    else {
      const avg = Math.round(sc.reduce((a, b) => a + b, 0) / sc.length);
      const idx = Math.min(avg, 4);
      setResult(idx);
      onChapterSet(idx);
    }
  };

  const reset = () => {
    setCurrent(0); setScores([0,0,0,0,0]); setSelected(null); setResult(null); setDotVals(Array(5).fill(null));
  };

  const q      = QUESTIONS[current];
  const ch     = result !== null ? CHAPTERS[result] : null;
  const btnBase = { padding:"14px 20px", border:`1px solid rgba(107,76,59,.2)`, background:"transparent", color:C.textDim, fontFamily:F.ral, fontSize:12, cursor:"pointer", textAlign:"left", transition:"all .25s", width:"100%" };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
      <div>
        <p style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:C.brown, marginBottom:16 }}>Feature 01 — Core Engine</p>
        <h2 style={{ fontFamily:F.cor, fontSize:48, fontWeight:300, color:C.white, marginBottom:16, lineHeight:1.0 }}>AI<br/>Personalization</h2>
        <p style={{ fontSize:13, lineHeight:1.9, color:C.textDim, marginBottom:32 }}>Answer five questions. Our AI maps your emotional state, life stage, sensory memory, and cultural context into a precise fragrance formula.</p>
        <div>
          {["Emotional State","Life Stage","Sensory Memory","Identity Lens","Chapter Signal"].map((label, i) => (
            <div key={i} style={{ padding:"16px 0", borderBottom:`1px solid rgba(107,76,59,.1)`, display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background: dotVals[i] ? C.brown : C.brownL, flexShrink:0, boxShadow: dotVals[i] ? `0 0 12px rgba(107,76,59,.4)` : "none" }} />
              <span style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:C.textDim }}>{label}</span>
              <span style={{ marginLeft:"auto", fontSize:12, color:C.brown }}>{dotVals[i] || "—"}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:C.bg2, padding:40, border:`1px solid rgba(107,76,59,.15)` }}>
        <div style={{ display:"flex", gap:6, marginBottom:32 }}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{ flex:1, height:2, background: i <= (result !== null ? 4 : current) ? C.brown : "rgba(107,76,59,.15)", transition:"background .4s" }} />
          ))}
        </div>
        {result === null ? (
          <>
            <p style={{ fontFamily:F.cor, fontSize:24, fontWeight:300, color:C.white, marginBottom:28, minHeight:64, lineHeight:1.4 }}>{q.q}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {q.opts.map((opt, i) => (
                <button key={i} onClick={() => handleSelect(i)} style={{ ...btnBase, borderColor: selected===i ? C.brown : "rgba(107,76,59,.2)", background: selected===i ? "rgba(107,76,59,.06)" : "transparent", color: selected===i ? C.brown : C.textDim }}>{opt}</button>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <button onClick={() => { if (current > 0) { setCurrent(current-1); setSelected(null); } }} style={{ ...btnBase, width:"auto", padding:"10px 24px", visibility: current===0 ? "hidden" : "visible", fontSize:10, letterSpacing:"0.2em" }}>← Back</button>
              <button onClick={next} style={{ padding:"10px 24px", background:C.brown, color:C.bg, border:"none", fontFamily:F.ral, fontSize:10, letterSpacing:"0.2em", cursor:"pointer" }}>Continue →</button>
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", paddingTop:20 }}>
            <p style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:C.brownL, marginBottom:12 }}>Your AETAS Chapter</p>
            <p style={{ fontFamily:F.cor, fontSize:40, fontWeight:300, color:C.white, marginBottom:12 }}>{ch.name}</p>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", margin:"16px 0" }}>
              {ch.notes.map(n => (
                <span key={n} style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", padding:"6px 14px", border:`1px solid rgba(107,76,59,.3)`, color:C.brown }}>{n}</span>
              ))}
            </div>
            <div style={{ background:C.brown, padding:24, marginTop:20 }}>
              <p style={{ fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(237,224,212,.6)", marginBottom:8 }}>AI Formula Blueprint</p>
              <p style={{ fontFamily:F.cor, fontSize:20, fontWeight:300, color:C.bg, marginBottom:16 }}>{ch.formula}</p>
              {ch.weights.map(w => (
                <div key={w.l} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
                  <span style={{ fontSize:9, letterSpacing:"0.15em", color:"rgba(237,224,212,.6)", minWidth:90 }}>{w.l}</span>
                  <div style={{ flex:1, height:2, background:"rgba(237,224,212,.2)" }}>
                    <div style={{ height:"100%", background:"rgba(237,224,212,.7)", width:w.v+"%", transition:"width 1s ease" }} />
                  </div>
                  <span style={{ fontSize:10, color:"rgba(237,224,212,.8)", minWidth:32, textAlign:"right" }}>{w.v}%</span>
                </div>
              ))}
            </div>
            <button onClick={reset} style={{ marginTop:20, width:"100%", padding:"12px", background:"transparent", border:`1px solid ${C.brown}`, color:C.brown, fontFamily:F.ral, fontSize:10, letterSpacing:"0.2em", cursor:"pointer" }}>Retake Quiz</button>
          </div>
        )}
      </div>
    </div>
  );
}