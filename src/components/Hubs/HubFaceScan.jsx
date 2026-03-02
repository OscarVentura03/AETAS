import { useState, useRef, useCallback, useEffect } from "react";
import { C, F } from "../../utils/constants";
import { CHAPTERS } from "../../data/chapters";
import Icon from "../UI/Icon";

export default function HubFaceScan({ chapterIdx, onChapterSet }) {
  const [status,    setStatus]    = useState("Camera not started");
  const [scanning,  setScanning]  = useState(false);
  const [readings,  setReadings]  = useState([null, null, null, null]);
  const [result,    setResult]    = useState(null);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const streamRef   = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const rafRef      = useRef(null);
  const samplesRef  = useRef([]);
  const startTimeRef = useRef(0);

  const analyseFrame = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;
    const W = 64, H = 48;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, W, H);
    const { data } = ctx.getImageData(0, 0, W, H);
    let sumR=0, sumG=0, sumB=0, sumL=0;
    const px = W * H;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      const lum = 0.299*r + 0.587*g + 0.114*b;
      sumR += r; sumG += g; sumB += b; sumL += lum;
    }
    const avgR = sumR/px, avgG = sumG/px, avgB = sumB/px, avgL = sumL/px;
    const cx0=24, cy0=18, cx1=40, cy1=30;
    let cvSum=0, cvCount=0;
    for (let y=cy0; y<cy1; y++) for (let x=cx0; x<cx1; x++) {
      const idx=(y*W+x)*4;
      const lum=0.299*data[idx]+0.587*data[idx+1]+0.114*data[idx+2];
      cvSum+=lum; cvCount++;
    }
    const cvMean=cvSum/cvCount;
    let cvVar=0;
    for (let y=cy0; y<cy1; y++) for (let x=cx0; x<cx1; x++) {
      const idx=(y*W+x)*4;
      const lum=0.299*data[idx]+0.587*data[idx+1]+0.114*data[idx+2];
      cvVar+=Math.pow(lum-cvMean,2);
    }
    return { avgR, avgG, avgB, avgL, cvVar: cvVar/cvCount };
  }, []);

  const computeReadings = useCallback((samples) => {
    if (samples.length < 3) return null;
    const avg = (arr, key) => arr.reduce((s,x) => s+x[key], 0) / arr.length;
    const meanL=avg(samples,"avgL"), meanR=avg(samples,"avgR"), meanB=avg(samples,"avgB"), meanVar=avg(samples,"cvVar");
    let motionSum=0;
    for (let i=1; i<samples.length; i++) motionSum+=Math.abs(samples[i].avgL-samples[i-1].avgL);
    const motionScore=Math.min(motionSum/(samples.length-1),30);
    const warmth=Math.min(Math.max((meanR-meanB)/255,-0.2),0.5);
    const warmthNorm=(warmth+0.2)/0.7;
    const emotionChW=warmthNorm*4;
    let emotionTone, emotionPct;
    if (warmthNorm<0.25)     { emotionTone="Searching";     emotionPct=15+Math.round(warmthNorm*120); }
    else if (warmthNorm<0.45){ emotionTone="Driven";        emotionPct=40+Math.round((warmthNorm-0.25)*150); }
    else if (warmthNorm<0.62){ emotionTone="Contemplative"; emotionPct=55+Math.round((warmthNorm-0.45)*130); }
    else if (warmthNorm<0.80){ emotionTone="Grounded";      emotionPct=70+Math.round((warmthNorm-0.62)*80); }
    else                      { emotionTone="Sovereign";    emotionPct=82+Math.round((warmthNorm-0.80)*80); }
    emotionPct=Math.min(emotionPct,98);
    const stressRaw=Math.min((motionScore/30)*0.7+(Math.sqrt(meanVar)/80)*0.3,1);
    const stressPct=Math.round(stressRaw*100);
    const stressChW=(1-stressRaw)*4;
    let stressLabel;
    if (stressPct<22) stressLabel="Very Low";
    else if (stressPct<42) stressLabel="Low";
    else if (stressPct<62) stressLabel="Moderate";
    else if (stressPct<78) stressLabel="Elevated";
    else stressLabel="High";
    const lumNorm=Math.min(Math.max(meanL/255,0),1);
    const depthScore=1-Math.abs(lumNorm-0.45)*1.8;
    const depthNorm=Math.max(Math.min(depthScore,1),0);
    const lifeChW=depthNorm*4;
    let lifeStage, lifePct;
    if (depthNorm<0.25)      { lifeStage="Emergence";   lifePct=15+Math.round(depthNorm*140); }
    else if (depthNorm<0.45) { lifeStage="Ambition";    lifePct=40+Math.round((depthNorm-0.25)*120); }
    else if (depthNorm<0.65) { lifeStage="Depth Phase"; lifePct=58+Math.round((depthNorm-0.45)*100); }
    else if (depthNorm<0.82) { lifeStage="Mastery";     lifePct=72+Math.round((depthNorm-0.65)*90); }
    else                      { lifeStage="Legacy";     lifePct=84+Math.round((depthNorm-0.82)*80); }
    lifePct=Math.min(lifePct,98);
    const chapterFloat=(emotionChW*0.40+stressChW*0.30+lifeChW*0.30);
    const chapterResult=Math.min(Math.round(chapterFloat),4);
    const confidence=Math.round(72+(1-Math.abs(chapterFloat-chapterResult))*24);
    return { emotionTone, emotionPct, stressLabel, stressPct, lifeStage, lifePct, confidence, chapterResult };
  }, []);

  const runScan = useCallback(() => {
    samplesRef.current = [];
    startTimeRef.current = Date.now();
    const DURATION=8000, INTERVAL=400;
    const sampleLoop = setInterval(() => {
      const frame = analyseFrame();
      if (frame) {
        samplesRef.current.push(frame);
        const elapsed=Date.now()-startTimeRef.current;
        const progress=Math.min(elapsed/DURATION,1);
        const r=computeReadings(samplesRef.current);
        if (r) {
          setReadings([
            progress>0.25 ? {label:"Emotional Tone",    val:r.emotionTone, pct:r.emotionPct, sub:"Facial warmth signal analysed"} : null,
            progress>0.50 ? {label:"Stress Index",      val:r.stressLabel, pct:r.stressPct,  sub:"Micro-motion variance calculated", gold:r.stressPct<30} : null,
            progress>0.70 ? {label:"Life Stage Signal", val:r.lifeStage,   pct:r.lifePct,    sub:"Luminance depth profile mapped"} : null,
            progress>0.85 ? {label:"Formula Confidence",val:r.confidence+"%",pct:r.confidence,sub:`${CHAPTERS[r.chapterResult].name} — match locked`,gold:true} : null,
          ]);
        }
        if (elapsed >= DURATION) {
          clearInterval(sampleLoop);
          if (r) {
            setReadings([
              {label:"Emotional Tone",    val:r.emotionTone, pct:r.emotionPct, sub:"Facial warmth signal analysed"},
              {label:"Stress Index",      val:r.stressLabel, pct:r.stressPct,  sub:"Micro-motion variance calculated", gold:r.stressPct<30},
              {label:"Life Stage Signal", val:r.lifeStage,   pct:r.lifePct,    sub:"Luminance depth profile mapped"},
              {label:"Formula Confidence",val:r.confidence+"%",pct:r.confidence,sub:`${CHAPTERS[r.chapterResult].name} — match locked`,gold:true},
            ]);
            setResult(CHAPTERS[r.chapterResult].name);
            onChapterSet(r.chapterResult);
            setStatus("Biometric scan complete.");
          }
        }
      }
    }, INTERVAL);
    return () => clearInterval(sampleLoop);
  }, [analyseFrame, computeReadings, onChapterSet]);

  const runSimulation = useCallback(() => {
    const rng=()=>Math.random();
    const simData=[
      {avgR:150+rng()*60,avgG:130+rng()*40,avgB:100+rng()*50,avgL:110+rng()*60,cvVar:rng()*200},
      {avgR:148+rng()*60,avgG:128+rng()*40,avgB:102+rng()*50,avgL:112+rng()*60,cvVar:rng()*200},
      {avgR:152+rng()*60,avgG:132+rng()*40,avgB:98 +rng()*50,avgL:108+rng()*60,cvVar:rng()*200},
      {avgR:155+rng()*60,avgG:135+rng()*40,avgB:101+rng()*50,avgL:114+rng()*60,cvVar:rng()*200},
      {avgR:149+rng()*60,avgG:129+rng()*40,avgB:99 +rng()*50,avgL:109+rng()*60,cvVar:rng()*200},
    ];
    [0.25,0.50,0.70,0.85,1.0].forEach((progress, step) => {
      setTimeout(() => {
        const r=computeReadings(simData.slice(0,step+1));
        if (!r) return;
        setReadings([
          progress>0.25 ? {label:"Emotional Tone",    val:r.emotionTone,    pct:r.emotionPct, sub:"Simulated facial warmth analysis"} : null,
          progress>0.50 ? {label:"Stress Index",      val:r.stressLabel,    pct:r.stressPct,  sub:"Simulated micro-motion variance", gold:r.stressPct<30} : null,
          progress>0.70 ? {label:"Life Stage Signal", val:r.lifeStage,      pct:r.lifePct,    sub:"Simulated luminance depth profile"} : null,
          progress>0.85 ? {label:"Formula Confidence",val:r.confidence+"%", pct:r.confidence, sub:`${CHAPTERS[r.chapterResult].name} — simulated match`,gold:true} : null,
        ]);
        if (progress===1.0) {
          setReadings([
            {label:"Emotional Tone",    val:r.emotionTone,    pct:r.emotionPct, sub:"Simulated facial warmth analysis"},
            {label:"Stress Index",      val:r.stressLabel,    pct:r.stressPct,  sub:"Simulated micro-motion variance", gold:r.stressPct<30},
            {label:"Life Stage Signal", val:r.lifeStage,      pct:r.lifePct,    sub:"Simulated luminance depth profile"},
            {label:"Formula Confidence",val:r.confidence+"%", pct:r.confidence, sub:`${CHAPTERS[r.chapterResult].name} — simulated match`,gold:true},
          ]);
          setResult(CHAPTERS[r.chapterResult].name);
          onChapterSet(r.chapterResult);
          setStatus("Simulation complete — results are randomised each run.");
        }
      }, step*1600+800);
    });
  }, [computeReadings, onChapterSet]);

  const start = async () => {
    setReadings([null,null,null,null]); setResult(null); setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:320},height:{ideal:240}}});
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.onloadeddata = () => { setHasCamera(true); setStatus("Analysing your biometric signals..."); runScan(); };
    } catch { setHasCamera(false); setStatus("Camera access denied — running biometric simulation..."); runSimulation(); }
  };

  const reset = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t=>t.stop()); streamRef.current=null; }
    setScanning(false); setReadings([null,null,null,null]); setResult(null); setStatus("Camera not started");
  };

  useEffect(() => () => { if (streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop()); }, []);

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
      <div>
        <p style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:C.brown, marginBottom:16 }}>Feature 02 — Biometric Layer</p>
        <h2 style={{ fontFamily:F.cor, fontSize:48, fontWeight:300, color:C.white, marginBottom:16, lineHeight:1.0 }}>Face<br/>Scanning</h2>
        <p style={{ fontSize:13, lineHeight:1.9, color:C.textDim, marginBottom:28 }}>Our system analyses real-time pixel data from your camera — measuring skin warmth, micro-motion variance, and luminance depth.</p>
        <div style={{ background:"#1a1410", border:`1px solid rgba(107,76,59,.2)`, aspectRatio:"4/3", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity: hasCamera&&scanning?1:0 }} />
          <canvas ref={canvasRef} style={{ display:"none" }} />
          {["tl","tr","bl","br"].map(pos => {
            const t=pos[0]==="t"?"top":"bottom", l=pos[1]==="l"?"left":"right";
            return <div key={pos} style={{ position:"absolute", width:28, height:28, [t]:12, [l]:12, [`border${t.charAt(0).toUpperCase()+t.slice(1)}`]:`2px solid ${C.brown}`, [`border${l.charAt(0).toUpperCase()+l.slice(1)}`]:`2px solid ${C.brown}`, zIndex:2 }} />;
          })}
          {scanning && <div style={{ position:"absolute", left:0, right:0, height:2, background:`linear-gradient(to right,transparent,${C.brown},transparent)`, animation:"scanBar 2.5s ease-in-out infinite", zIndex:3 }} />}
          {!scanning && <div style={{ zIndex:2, opacity:0.3 }}><Icon name="faceId" size={64} color={C.brownL} /></div>}
          <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:C.brownL, textAlign:"center", position:"relative", zIndex:4, padding:"0 20px" }}>{status}</p>
          {!scanning && <button onClick={start} style={{ padding:"12px 32px", background:C.brown, color:C.bg, fontFamily:F.ral, fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", border:"none", cursor:"pointer", position:"relative", zIndex:4 }}>Start Biometric Scan</button>}
        </div>
        {result && (
          <>
            <div style={{ background:C.brown, padding:24, marginTop:16 }}>
              <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(237,224,212,.6)", marginBottom:8 }}>Biometric Chapter Signal</p>
              <p style={{ fontFamily:F.cor, fontSize:28, fontWeight:300, color:C.bg }}>{result}</p>
            </div>
            <button onClick={reset} style={{ marginTop:12, width:"100%", padding:"10px", background:"transparent", border:`1px solid rgba(107,76,59,.25)`, color:C.textFaint, fontFamily:F.ral, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer" }}>Rescan</button>
          </>
        )}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <p style={{ fontSize:9, letterSpacing:"0.35em", textTransform:"uppercase", color:C.brownL, marginBottom:4 }}>Live Biometric Analysis</p>
        {[
          {label:"Emotional Tone",    desc:"Derived from red-to-blue warmth ratio of your facial region"},
          {label:"Stress Index",      desc:"Frame-to-frame luminance delta indicating micro-motion and tension"},
          {label:"Life Stage Signal", desc:"Luminance depth profile mapped to the AETAS chapter spectrum"},
          {label:"Formula Confidence",desc:"Weighted composite of all three biometric signals"},
        ].map((meta, i) => (
          <div key={i} style={{ padding:20, background:C.bg2, borderLeft: readings[i]?`3px solid ${readings[i].gold?"#c9a84c":C.brown}`:`3px solid rgba(107,76,59,.15)`, transition:"border-color .6s" }}>
            <p style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:C.brownL, marginBottom:4 }}>{meta.label}</p>
            <p style={{ fontFamily:F.cor, fontSize:22, fontWeight:300, color:C.white, marginBottom:6 }}>{readings[i] ? readings[i].val : "—"}</p>
            <div style={{ height:3, background:"rgba(107,76,59,.12)", marginBottom:6 }}>
              <div style={{ height:"100%", background: readings[i]?.gold?"#c9a84c":C.brown, width: readings[i]?readings[i].pct+"%":"0%", transition:"width 1.8s ease" }} />
            </div>
            <p style={{ fontSize:10, color:C.textFaint }}>{readings[i] ? readings[i].sub : meta.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}