import { useState, useRef, useEffect } from "react";
import { C, F, genId } from "../../utils/constants";
import { CHAPTERS } from "../../data/chapters";
import { INIT_AZURE } from "../../data/chapters";
import { Html5Qrcode } from "html5-qrcode";

export default function HubQR({ chapterIdx }) {
  const [name, setName] = useState("");
  const [chapter, setChapter] = useState("");
  const [fragrance, setFragrance] = useState("");
  const [generated, setGenerated] = useState(null);
  const [scanned, setScanned] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");
  const canvasRef = useRef(null);
  const scannerRef = useRef(null);

  const SAMPLES = [
    {id:"AET-2847-III", name:"Sofia Reyes",   chapter:"Chapter III — Depth",   fragrance:"Tom Ford Oud Wood"},
    {id:"AET-1204-I",   name:"Marco Laurent", chapter:"Chapter I — Emergence", fragrance:"Acqua di Giò"},
    {id:"AET-3391-II",  name:"James Park",    chapter:"Chapter II — Ambition", fragrance:"Dior Sauvage"},
  ];

  const ALL_RECORDS = [...INIT_AZURE, ...SAMPLES];

  const generate = () => {
    const id = genId(chapterIdx);
    const date = new Date().toLocaleDateString("en-GB", {month:"short", year:"numeric"});
    setGenerated({ id, name:name||"Guest", chapter:chapter||CHAPTERS[Math.max(0,chapterIdx)].name, fragrance:fragrance||"AETAS Formula", date });
    setTimeout(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = "#ede0d4"; ctx.fillRect(0,0,160,160);
      ctx.fillStyle = "#6b4c3b";
      [[8,8],[108,8],[8,108]].forEach(([x,y]) => {
        ctx.fillRect(x,y,28,28);
        ctx.fillStyle = "#ede0d4"; ctx.fillRect(x+4,y+4,20,20);
        ctx.fillStyle = "#6b4c3b"; ctx.fillRect(x+8,y+8,12,12);
      });
      for (let i=0; i<80; i++) {
        if (Math.random() > .5) ctx.fillRect(44+Math.floor(Math.random()*72), 8+Math.floor(Math.random()*136), 4, 4);
      }
    }, 50);
  };

  const startScan = async () => {
    setScanResult(null); setScanError(""); setScanning(true);
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          stopScan();
          const match = ALL_RECORDS.find(r =>
            r.id === decodedText.trim() ||
            decodedText.includes(r.id)
          );
          setScanResult({ raw: decodedText, match: match || null });
        },
        () => {}
      );
    } catch (err) {
      setScanning(false);
      setScanError("Camera access denied or not available.");
    }
  };

  const stopScan = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current.clear();
        scannerRef.current = null;
      }).catch(() => {});
    }
    setScanning(false);
  };

  useEffect(() => () => { if (scannerRef.current) scannerRef.current.stop().catch(() => {}); }, []);

  const inp = { padding:"12px 16px", border:`1px solid rgba(107,76,59,.25)`, background:C.bg2, color:C.text, fontFamily:F.ral, fontSize:12, outline:"none", width:"100%", marginBottom:12 };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64 }}>
      <div>
        <p style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:C.brown, marginBottom:16 }}>Feature 05 — Identity & Replication</p>
        <h2 style={{ fontFamily:F.cor, fontSize:36, fontWeight:300, color:C.white, marginBottom:8, lineHeight:1.0 }}>QR Formula<br/>Generator</h2>
        <p style={{ fontSize:13, lineHeight:1.9, color:C.textDim, marginBottom:28 }}>Enter your details to generate a unique AETAS formula QR code. In the real system, this QR is laser-etched into your bottle and links to your complete formula profile.</p>
        <input style={inp} placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
        <input style={inp} placeholder="Chapter (e.g. Chapter III — Depth)" value={chapter} onChange={e=>setChapter(e.target.value)} />
        <input style={inp} placeholder="Fragrance (e.g. Oud Wood)" value={fragrance} onChange={e=>setFragrance(e.target.value)} />
        <button onClick={generate} style={{ width:"100%", padding:14, background:C.brown, color:C.bg, fontFamily:F.ral, fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", border:"none", cursor:"pointer", marginBottom:24 }}>Generate Formula QR Code →</button>
        {generated && (
          <div>
            <div style={{ display:"flex", gap:32, alignItems:"start" }}>
              <div style={{ border:`1px solid rgba(107,76,59,.2)`, padding:16, background:C.bg, flexShrink:0 }}>
                <canvas ref={canvasRef} width={160} height={160} style={{ display:"block" }} />
              </div>
              <div style={{ flex:1 }}>
                {[["Customer",generated.name],["Chapter",generated.chapter],["Fragrance",generated.fragrance],["Created",generated.date],["Status","Active"]].map(([k,v])=>(
                  <div key={k} style={{ padding:"10px 0", borderBottom:`1px solid rgba(107,76,59,.1)`, display:"flex", justifyContent:"space-between", fontSize:12 }}>
                    <span style={{ color:C.textFaint }}>{k}</span>
                    <span style={{ color:C.text, fontWeight:400 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:C.brown, padding:16, marginTop:16 }}>
              <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(237,224,212,.6)", marginBottom:6 }}>Formula ID</p>
              <p style={{ fontFamily:F.cin, fontSize:16, letterSpacing:"0.2em", color:C.bg }}>{generated.id}</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ background:C.bg2, padding:32, border:`1px solid rgba(107,76,59,.15)` }}>
        <h3 style={{ fontFamily:F.cor, fontSize:28, fontWeight:300, color:C.white, marginBottom:8 }}>Live QR Scanner</h3>
        <p style={{ fontSize:12, color:C.textDim, marginBottom:24, lineHeight:1.7 }}>Scan any AETAS QR code with your camera. The system will decode it and match it against the IdentityVault.</p>

        <div id="qr-reader" style={{ width:"100%", marginBottom:16, borderRadius:2, overflow:"hidden" }} />

        <div style={{ display:"flex", gap:12, marginBottom:24 }}>
          {!scanning ? (
            <button onClick={startScan} style={{ flex:1, padding:12, background:C.brown, color:C.bg, fontFamily:F.ral, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>Start Camera Scan →</button>
          ) : (
            <button onClick={stopScan} style={{ flex:1, padding:12, background:"transparent", color:C.textDim, fontFamily:F.ral, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", border:`1px solid rgba(107,76,59,.25)`, cursor:"pointer" }}>Stop Scanning</button>
          )}
        </div>

        {scanError && (
          <div style={{ padding:16, background:"rgba(107,76,59,.08)", border:`1px solid rgba(107,76,59,.2)`, marginBottom:16 }}>
            <p style={{ fontSize:11, color:C.textDim }}>{scanError}</p>
          </div>
        )}

        {scanResult && (
          <div>
            <div style={{ padding:20, background:C.bg, border:`1px solid rgba(107,76,59,.15)`, marginBottom:12 }}>
              <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brownL, marginBottom:8 }}>Raw QR Data</p>
              <p style={{ fontSize:12, color:C.text, wordBreak:"break-all", fontFamily:F.ral }}>{scanResult.raw}</p>
            </div>
            {scanResult.match ? (
              <div style={{ background:C.brown, padding:24 }}>
                <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(237,224,212,.5)", marginBottom:8 }}>✦ IdentityVault Match Found</p>
                <p style={{ fontFamily:F.cor, fontSize:24, color:C.bg, marginBottom:4 }}>{scanResult.match.name}</p>
                <p style={{ fontSize:11, color:"rgba(237,224,212,.7)", lineHeight:1.9 }}>
                  Formula ID: {scanResult.match.id}<br/>
                  Chapter: {scanResult.match.chapter}<br/>
                  Fragrance: {scanResult.match.fragrance}
                </p>
              </div>
            ) : (
              <div style={{ padding:20, background:C.bg, border:`1px solid rgba(107,76,59,.15)` }}>
                <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brownL, marginBottom:6 }}>No IdentityVault Match</p>
                <p style={{ fontSize:11, color:C.textDim }}>This QR code is not registered in the AETAS system.</p>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop:24 }}>
          <p style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:C.textFaint, marginBottom:12 }}>Or select a stored formula:</p>
          {SAMPLES.map(s => (
            <div key={s.id} onClick={() => setScanned(s)} style={{ padding:"10px 14px", background:C.bg, border:`1px solid rgba(107,76,59,.2)`, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, transition:"all .3s" }}>
              <span style={{ fontFamily:F.cin, fontSize:12, letterSpacing:"0.15em", color:C.brown }}>{s.id}</span>
              <span style={{ fontSize:11, color:C.textDim }}>{s.name} — {s.fragrance}</span>
            </div>
          ))}
          {scanned && (
            <div style={{ background:C.brown, padding:20, marginTop:16 }}>
              <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(237,224,212,.5)", marginBottom:8 }}>Formula Retrieved</p>
              <p style={{ fontFamily:F.cor, fontSize:24, color:C.bg, marginBottom:4 }}>{scanned.name} — {scanned.chapter}</p>
              <p style={{ fontSize:11, color:"rgba(237,224,212,.7)", lineHeight:1.7 }}>Formula: {scanned.id} · Fragrance: {scanned.fragrance}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}