import { useState, useRef } from "react";
import { C, F } from "../../utils/constants";
import { INIT_AZURE } from "../../data/chapters";

export default function HubCVScan() {
  const [status, setStatus] = useState("Awaiting bottle...");
  const [results, setResults] = useState([null,null,null,null]);
  const [fullResult, setFullResult] = useState(null);
  const videoRef  = useRef(null);
  const streamRef = useRef(null);
  const BOTTLES   = INIT_AZURE.slice(0, 4);

  const simulate = (r) => {
    setResults([null,null,null,null]); setFullResult(null);
    const steps = [
      {val:"AETAS Bottle",           sub:"Model confidence: 98.4%"},
      {val:r.id,                     sub:"QR decoded successfully"},
      {val:r.chapter.split(" — ")[0],sub:r.fragrance+" formula loaded"},
      {val:"Authentic ✓",            sub:"Security signature verified"},
    ];
    steps.forEach((_,i) => setTimeout(() => setResults(prev => { const n=[...prev]; n[i]=steps[i]; return n; }), i*700));
    setTimeout(() => setFullResult(r), steps.length*700+200);
  };

  const startCamera = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({video:true});
      videoRef.current.srcObject = streamRef.current;
      setStatus("Camera active — place bottle in viewfinder");
      setTimeout(() => simulate(BOTTLES[0]), 3000);
    } catch { setStatus("Camera denied — use Simulate Detection"); }
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
      <div>
        <p style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:C.brown, marginBottom:16 }}>Feature 06 — Phase 2 Rollout</p>
        <h2 style={{ fontFamily:F.cor, fontSize:48, fontWeight:300, color:C.white, marginBottom:16, lineHeight:1.0 }}>Computer Vision<br/>Bottle Scanning</h2>
        <p style={{ fontSize:13, lineHeight:1.9, color:C.textDim, marginBottom:28 }}>Place your AETAS bottle in front of the camera. The CV system identifies the bottle, reads its QR, and retrieves your formula — touchless, instant, global.</p>
        <div style={{ background:C.bg2, border:`1px solid rgba(107,76,59,.15)`, overflow:"hidden" }}>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid rgba(107,76,59,.12)`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brown }}>CV Kiosk — Live Feed</span>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#c9a84c", animation:"blink 1.5s ease-in-out infinite" }} />
          </div>
          <div style={{ aspectRatio:"4/3", background:"#1a1410", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", display: streamRef.current?"block":"none" }} />
            {["tl","tr","bl","br"].map(pos => {
              const t=pos[0]==="t"?"top":"bottom", l=pos[1]==="l"?"left":"right";
              return <div key={pos} style={{ position:"absolute", width:32, height:32, [t]:12, [l]:12, [`border${t.charAt(0).toUpperCase()+t.slice(1)}`]:"2px solid rgba(201,168,76,.8)", [`border${l.charAt(0).toUpperCase()+l.slice(1)}`]:"2px solid rgba(201,168,76,.8)" }} />;
            })}
            <div style={{ position:"absolute", width:120, height:160, border:"1px solid rgba(201,168,76,.4)", animation:"reticlePulse 2s ease-in-out infinite" }} />
            <span style={{ color:"rgba(237,224,212,.3)", fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase" }}>{status}</span>
          </div>
          <div style={{ padding:"16px 20px", display:"flex", gap:12 }}>
            {[
              ["Start Camera",       startCamera, true],
              ["Simulate Detection", ()=>simulate(BOTTLES[Math.floor(Math.random()*BOTTLES.length)]), false],
              ["Stop",               ()=>{ if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null;} setStatus("Awaiting bottle..."); }, false],
            ].map(([label, fn, primary])=>(
              <button key={label} onClick={fn} style={{ flex:1, padding:10, border:`1px solid rgba(107,76,59,.25)`, background:primary?C.brown:"transparent", color:primary?C.bg:C.textDim, fontFamily:F.ral, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer" }}>{label}</button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <p style={{ fontSize:9, letterSpacing:"0.35em", textTransform:"uppercase", color:C.brownL, marginBottom:20 }}>Detection Results</p>
        {["Bottle Recognition","QR Decode","Formula Retrieved","Authenticity"].map((label,i)=>(
          <div key={i} style={{ background:C.bg2, padding:20, borderLeft: results[i]?`3px solid ${C.brown}`:"3px solid rgba(107,76,59,.2)", marginBottom:16, transition:"all .4s" }}>
            <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brownL, marginBottom:6 }}>{label}</p>
            <p style={{ fontFamily:F.cor, fontSize:22, fontWeight:300, color:C.white, marginBottom:4 }}>{results[i]?.val||"Awaiting..."}</p>
            <p style={{ fontSize:11, color:C.textFaint }}>{results[i]?.sub||"—"}</p>
          </div>
        ))}
        <p style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:C.textFaint, margin:"20px 0 10px" }}>Or select a bottle manually:</p>
        {BOTTLES.map((b,i)=>(
          <div key={i} onClick={()=>simulate(b)} style={{ padding:"12px 16px", border:`1px solid rgba(107,76,59,.2)`, background:C.bg, cursor:"pointer", display:"flex", gap:12, alignItems:"center", marginBottom:8, transition:"all .3s" }}>
            <span>◈</span>
            <div><p style={{ fontSize:12, color:C.text }}>{b.name} — {b.fragrance}</p><p style={{ fontSize:10, color:C.textFaint }}>{b.chapter}</p></div>
          </div>
        ))}
        {fullResult && (
          <div style={{ background:C.brown, padding:24, marginTop:20 }}>
            <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(237,224,212,.5)", marginBottom:8 }}>Formula Loaded — Ready to Refill</p>
            <p style={{ fontFamily:F.cor, fontSize:28, fontWeight:300, color:C.bg, marginBottom:4 }}>{fullResult.name} — {fullResult.chapter}</p>
            <p style={{ fontSize:12, color:"rgba(237,224,212,.7)", lineHeight:1.7 }}>Formula ID: {fullResult.id} · Fragrance: {fullResult.fragrance}</p>
          </div>
        )}
      </div>
    </div>
  );
}