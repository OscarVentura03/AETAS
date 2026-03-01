import { useState } from "react";
import { C, F } from "../../utils/constants";

export default function HubEmotionalMapping({ onChapterSet }) {
  const [text, setText] = useState("");
  const [emotions, setEmotions] = useState([null,null,null,null]);
  const [notes, setNotes] = useState([]);
  const [keywords, setKeywords] = useState([]);

  const EMOTION_KW = {
    searching: {words:["search","find","discover","lost","wonder","question","maybe","unsure","explore"],notes:["Bergamot","Green Tea","Citrus Bloom","White Cedar"],ch:0},
    building:  {words:["build","achieve","work","goal","focus","drive","create","success","ambition"],notes:["Black Pepper","Vetiver","Dark Musk","Leather"],ch:1},
    depth:     {words:["complex","both","weight","carry","nuance","layers","feel","experience","joy","loss"],notes:["Oud","Amber","Smoked Rose","Saffron"],ch:2},
    settled:   {words:["settled","calm","ground","know","clear","peace","content","anchor","still"],notes:["Sandalwood","Incense","Labdanum","Aged Bourbon"],ch:3},
    reflecting:{words:["reflect","remember","memory","past","meaning","legacy","life","time","story"],notes:["Myrrh","Oud Noir","Aged Patchouli","White Musk"],ch:4},
  };

  const analyse = () => {
    if (!text.trim()) return;
    const t = text.toLowerCase();
    const scores = Object.fromEntries(Object.entries(EMOTION_KW).map(([k,v]) => [k, v.words.filter(w=>t.includes(w)).length]));
    const dominant = Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
    const data = EMOTION_KW[dominant];
    setEmotions([
      {l:"Grounding",     v:Math.min(30+scores.settled*15+scores.reflecting*10,99)},
      {l:"Intensity",     v:Math.min(20+scores.building*15+scores.searching*10,99)},
      {l:"Forward Motion",v:Math.min(25+scores.building*15+scores.searching*12,99)},
      {l:"Complexity",    v:Math.min(20+scores.depth*15+scores.reflecting*10,99)},
    ]);
    setNotes(data.notes);
    setKeywords(text.split(/\s+/).filter(w=>w.length>4).slice(0,16).map(w=>w.replace(/[^a-z]/gi,"").toLowerCase()));
    onChapterSet(data.ch);
  };

  const prompts = [
    ["Searching",  "I feel like I am still searching for who I am meant to become."],
    ["Building",   "I know what I want and I am building toward it with everything I have."],
    ["Depth",      "I have lived enough to know that nothing is simple. I carry both joy and weight."],
    ["Settled",    "I feel grounded, settled, and clear. There is nothing left to prove."],
    ["Reflecting", "I am reflecting on everything I have lived. Memory and meaning feel very present."],
  ];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64 }}>
      <div>
        <p style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:C.brown, marginBottom:16 }}>Feature 03 — Sentiment Layer</p>
        <h2 style={{ fontFamily:F.cor, fontSize:48, fontWeight:300, color:C.white, marginBottom:16, lineHeight:1.0 }}>Emotional<br/>Data Mapping</h2>
        <p style={{ fontSize:13, lineHeight:1.9, color:C.textDim, marginBottom:28 }}>Describe how you feel right now. Our NLP engine maps your language against 200+ emotional signal tags and translates them into fragrance note weights.</p>
        <div style={{ position:"relative", marginBottom:24 }}>
          <textarea value={text} onChange={e=>setText(e.target.value)} maxLength={500} placeholder="Write freely. How do you feel today? What are you carrying?" style={{ width:"100%", height:160, padding:20, border:`1px solid rgba(107,76,59,.25)`, background:C.bg2, color:C.text, fontFamily:F.ral, fontSize:13, lineHeight:1.8, resize:"none", outline:"none" }} />
          <span style={{ position:"absolute", bottom:12, right:16, fontSize:10, color:C.textFaint }}>{text.length} / 500</span>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
          {prompts.map(([label, t]) => (
            <button key={label} onClick={() => setText(t)} style={{ fontSize:10, letterSpacing:"0.1em", padding:"7px 14px", border:`1px solid rgba(107,76,59,.2)`, background:"transparent", color:C.textDim, cursor:"pointer" }}>{label}</button>
          ))}
        </div>
        <button onClick={analyse} style={{ width:"100%", padding:14, background:C.brown, color:C.bg, fontFamily:F.ral, fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>Analyse My Emotional State →</button>
      </div>
      <div>
        <p style={{ fontSize:9, letterSpacing:"0.35em", textTransform:"uppercase", color:C.brownL, marginBottom:20 }}>Emotional Signal Map</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:3, marginBottom:24 }}>
          {["Grounding","Intensity","Forward Motion","Complexity"].map((label, i) => (
            <div key={i} style={{ background: emotions[i]&&emotions[i].v>50?C.brown:C.bg2, padding:16, transition:"all .5s" }}>
              <p style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color: emotions[i]&&emotions[i].v>50?"rgba(237,224,212,.6)":C.textFaint, marginBottom:4 }}>{label}</p>
              <p style={{ fontFamily:F.cor, fontSize:20, fontWeight:300, color: emotions[i]&&emotions[i].v>50?C.bg:C.white }}>{emotions[i] ? emotions[i].v+"%" : "—"}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize:9, letterSpacing:"0.35em", textTransform:"uppercase", color:C.brownL, marginBottom:16 }}>Detected Note Affinities</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20, minHeight:40 }}>
          {notes.length === 0
            ? <p style={{ fontFamily:F.cor, fontStyle:"italic", fontSize:18, color:C.textFaint }}>Write something to reveal your note affinities</p>
            : notes.map((n,i) => <span key={n} style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", padding:"6px 14px", border:`1px solid rgba(107,76,59,.3)`, color:C.brown, animation:`noteIn .4s ease ${i*.15}s forwards`, opacity:0 }}>{n}</span>)}
        </div>
        {keywords.length > 0 && (
          <>
            <p style={{ fontSize:9, letterSpacing:"0.35em", textTransform:"uppercase", color:C.brownL, marginBottom:12 }}>Emotional Keywords</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {keywords.map(w => <span key={w} style={{ fontSize:10, padding:"4px 10px", background:"rgba(107,76,59,.08)", color:C.textDim }}>{w}</span>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}