import { useState } from "react";
import { C, F } from "../../utils/constants";
import { CHAPTERS } from "../../data/chapters";
import Icon from "../UI/Icon";

export default function HubProgression({ chapterIdx, onChapterSet }) {
  const [peChapter,  setPeChapter]   = useState(Math.max(0, chapterIdx));
  const [signals,    setSignals]     = useState(Array(5).fill(false));
  const [divergence, setDivergence]  = useState(0);
  const [evolved,    setEvolveResult] = useState(null);

  const SIGNALS = [
    {icon:"clock",     label:"12 months elapsed since last formula"},
    {icon:"briefcase", label:"Major career transition detected"},
    {icon:"heart",     label:"Relationship status changed"},
    {icon:"globe",     label:"Geographic relocation"},
    {icon:"refresh",   label:"Re-profiling quiz — new chapter detected"},
  ];
  const ADDITIONS = [20, 25, 22, 18, 30];

  const trigger = (i) => {
    if (signals[i]) return;
    const next=[...signals]; next[i]=true; setSignals(next);
    setDivergence(d => Math.min(d+ADDITIONS[i], 100));
  };

  const evolve = () => {
    const next=Math.min(peChapter+1, 4);
    setEvolveResult({from:CHAPTERS[peChapter].name, to:CHAPTERS[next].name, notes:CHAPTERS[next].notes});
    setPeChapter(next); onChapterSet(next);
    setDivergence(0); setSignals(Array(5).fill(false));
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:64 }}>
      <div>
        <p style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:C.brown, marginBottom:16 }}>Feature 07 — The Invisible Thread</p>
        <h2 style={{ fontFamily:F.cor, fontSize:48, fontWeight:300, color:C.white, marginBottom:16, lineHeight:1.0 }}>Progression<br/>Engine</h2>
        <p style={{ fontSize:13, color:C.textDim, marginBottom:36, lineHeight:1.8 }}>The master intelligence binding all six features. It monitors signal divergence between who you were and who you are becoming — and decides when your formula should evolve.</p>
        <div style={{ position:"relative", paddingLeft:48 }}>
          <div style={{ position:"absolute", left:8, top:0, bottom:0, width:2, background:`linear-gradient(to bottom,${C.brown},rgba(107,76,59,.1))` }} />
          {CHAPTERS.map((ch,i)=>(
            <div key={i} onClick={()=>setPeChapter(i)} style={{ marginBottom:28, position:"relative", cursor:"pointer" }}>
              <div style={{ position:"absolute", left:-44, top:14, width:12, height:12, borderRadius:"50%", background: i<peChapter?C.brownL:i===peChapter?C.brown:C.bg, border: i===peChapter?`2px solid ${C.brown}`:`2px solid rgba(107,76,59,.3)`, boxShadow: i===peChapter?`0 0 16px rgba(107,76,59,.4)`:"none", transition:"all .3s" }} />
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:8 }}>
                <span style={{ fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brownL }}>{["Chapter I","Chapter II","Chapter III","Chapter IV","Chapter V"][i]}</span>
                <span style={{ fontFamily:F.cor, fontSize:22, fontWeight:300, color:C.white }}>{ch.name.split(" — ")[1]}</span>
              </div>
              <p style={{ fontSize:12, color:C.textDim, lineHeight:1.7, maxWidth:400 }}>{ch.desc}</p>
              <div style={{ height:2, background:"rgba(107,76,59,.1)", margin:"12px 0" }}>
                <div style={{ height:"100%", background:C.brown, width: i<peChapter?"100%":i===peChapter?"60%":"0%", transition:"width 1.5s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:C.bg2, padding:32, border:`1px solid rgba(107,76,59,.15)` }}>
        <p style={{ fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brownL, marginBottom:24 }}>Signal Dashboard</p>
        <p style={{ fontSize:11, color:C.textDim, marginBottom:20, lineHeight:1.7 }}>Trigger signals below to simulate life events. When divergence crosses 65%, formula evolution becomes available.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
          {SIGNALS.map((s,i)=>(
            <div key={i} onClick={()=>trigger(i)} style={{ display:"flex", alignItems:"center", gap:14, padding:14, background: signals[i]?"rgba(107,76,59,.06)":C.bg, border:`1px solid ${signals[i]?C.brown:"rgba(107,76,59,.15)"}`, cursor:"pointer", transition:"all .3s" }}>
              <Icon name={s.icon} size={20} color={signals[i]?C.brown:C.brownL} />
              <span style={{ fontSize:11, color:C.text, flex:1 }}>{s.label}</span>
              <span style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color: signals[i]?C.brown:C.textFaint }}>{signals[i]?"Triggered ✓":"Pending"}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:C.brownL, marginBottom:12 }}>Formula Divergence Score</p>
        <div style={{ height:12, background:"rgba(107,76,59,.12)", position:"relative", marginBottom:8 }}>
          <div style={{ height:"100%", background:`linear-gradient(to right,${C.brownL},${C.brown})`, width:divergence+"%", transition:"width 1s ease" }} />
          <div style={{ position:"absolute", top:0, bottom:0, width:2, background:C.brownD, left:"65%" }} />
          <span style={{ position:"absolute", top:-18, left:"65%", transform:"translateX(-50%)", fontSize:8, letterSpacing:"0.15em", color:C.brownD }}>Evolution threshold</span>
        </div>
        <p style={{ fontFamily:F.cor, fontSize:24, fontWeight:300, color:C.brown, marginBottom:24 }}>{Math.round(divergence)}%</p>
        <button onClick={evolve} disabled={divergence<65} style={{ width:"100%", padding:16, background: divergence>=65?C.brown:"rgba(107,76,59,.3)", color:C.bg, fontFamily:F.ral, fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", border:"none", cursor: divergence>=65?"pointer":"not-allowed", marginBottom:12 }}>
          {divergence>=65 ? "Divergence Threshold Reached — Trigger Evolution →" : `Divergence Too Low (${Math.round(divergence)}%) — Keep Monitoring`}
        </button>
        {evolved && (
          <div style={{ padding:20, background:C.brown }}>
            <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(237,224,212,.5)", marginBottom:6 }}>Evolution Event Triggered</p>
            <p style={{ fontFamily:F.cor, fontSize:20, color:C.bg, lineHeight:1.4 }}>Progressing from {evolved.from} to {evolved.to}. New notes: {evolved.notes.join(", ")}.</p>
          </div>
        )}
      </div>
    </div>
  );
}