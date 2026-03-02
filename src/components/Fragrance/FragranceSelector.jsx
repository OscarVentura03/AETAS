import { useState } from "react";
import { C, F, genId } from "../../utils/constants";
import { CHAPTERS } from "../../data/chapters";
import { FRAGRANCES } from "../../data/fragrances";

export default function FragranceSelector({ chapterIdx, saved, onToggleSave, onOpenAuth, isLoggedIn, onGoToQuiz }) {  const [family,       setFamily]       = useState("all");
  const [matchFilter,  setMatchFilter]  = useState("all");
  const [search,       setSearch]       = useState("");
  const [selectedFrag, setSelectedFrag] = useState(null);
  const [confirmed,    setConfirmed]    = useState(false);
  const [formulaId,    setFormulaId]    = useState("");
  // eslint-disable-next-line no-unused-vars
  const [showTip,      setShowTip]      = useState(false);

  const families = ["all","floral","woody","chypre","oriental","fresh","fougere"];

  const filtered = FRAGRANCES.filter(f => {
    if (family !== "all" && f.family !== family) return false;
    if (matchFilter === "matched" && (chapterIdx < 0 || !f.chapters.includes(chapterIdx))) return false;
    if (search && !f.name.toLowerCase().includes(search) && !f.house.toLowerCase().includes(search) && ![...f.top,...f.mid,...f.base].some(n => n.toLowerCase().includes(search))) return false;
    return true;
  });

  const sorted = chapterIdx >= 0
    ? [...filtered].sort((a, b) => (a.chapters.includes(chapterIdx) ? 0 : 1) - (b.chapters.includes(chapterIdx) ? 0 : 1))
    : filtered;

  const confirmFormula = () => { setFormulaId(genId(chapterIdx)); setConfirmed(true); };

  const filterBtn = (label, isActive, onClick) => (
    <button onClick={onClick} style={{ fontFamily:F.ral, fontSize:10, fontWeight:300, letterSpacing:"0.1em", padding:"7px 14px", border:`1px solid rgba(107,76,59,.22)`, background: isActive ? C.brown : "transparent", color: isActive ? C.bg : C.textDim, cursor:"pointer", transition:"all .25s" }}>{label}</button>
  );

  return (
    <div style={{ padding:"100px 64px", background:C.bg, maxWidth:1400, margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:48, alignItems:"end", marginBottom:48 }}>
        <div>
          <p style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:C.brown, marginBottom:16 }}>Fragrance Library</p>
          <h2 style={{ fontFamily:F.cor, fontSize:"clamp(40px,5vw,64px)", fontWeight:300, lineHeight:1.05, color:C.white, marginBottom:12 }}>
            Select Your<br/><em style={{ fontStyle:"italic", color:C.brown }}>Inspiration</em>
          </h2>
          <p style={{ fontSize:13, color:C.textDim, lineHeight:1.9, maxWidth:520 }}>Browse fragrances matched to your chapter. Your AETAS formula will be built from the DNA of your chosen scent.</p>
        </div>
        <div
  onClick={() => chapterIdx < 0 && onGoToQuiz && onGoToQuiz()}
  onMouseEnter={() => chapterIdx < 0 && setShowTip(true)}
  onMouseLeave={() => setShowTip(false)}
  style={{ background:C.brown, padding:"24px 28px", minWidth:200, position:"relative", cursor: chapterIdx < 0 ? "pointer" : "default" }}
>
          <p style={{ fontSize:8, letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(237,224,212,.55)", marginBottom:6 }}>Your Chapter</p>
          <p style={{ fontFamily:F.cor, fontSize:20, fontWeight:300, color:C.bg, lineHeight:1.2 }}>{chapterIdx >= 0 ? CHAPTERS[chapterIdx].name : "Complete the quiz first"}</p>
          <p style={{ fontSize:10, color:"rgba(237,224,212,.45)", marginTop:4 }}>{chapterIdx >= 0 ? "Showing matched fragrances" : "to see matched fragrances"}</p>
        </div>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:20, alignItems:"center", padding:"24px 0", borderTop:`1px solid rgba(107,76,59,.12)`, borderBottom:`1px solid rgba(107,76,59,.12)`, marginBottom:36 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:C.brownL }}>Family</span>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {families.map(f => filterBtn(f === "fougere" ? "Fougère" : f.charAt(0).toUpperCase()+f.slice(1), family===f, () => setFamily(f)))}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:C.brownL }}>Match</span>
          <div style={{ display:"flex", gap:6 }}>
            {filterBtn("All", matchFilter==="all", () => setMatchFilter("all"))}
            {filterBtn("My Matches ✦", matchFilter==="matched", () => setMatchFilter("matched"))}
          </div>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value.toLowerCase())} placeholder="Search by name, house, or note..." style={{ marginLeft:"auto", padding:"9px 18px", border:`1px solid rgba(107,76,59,.22)`, background:"transparent", color:C.text, fontFamily:F.ral, fontSize:12, width:240, outline:"none" }} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:3, marginBottom:48 }}>
        {sorted.length === 0 ? (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:60, fontFamily:F.cor, fontStyle:"italic", fontSize:22, color:C.textFaint }}>No fragrances match your filters.</div>
        ) : sorted.map(f => {
          const matched = chapterIdx >= 0 && f.chapters.includes(chapterIdx);
          const isSel   = selectedFrag?.id === f.id;
          const isSaved = saved.some(s => s.id === f.id);
          return (
            <div key={f.id} onClick={() => { setSelectedFrag(f); setConfirmed(false); }} style={{ background: isSel ? C.bg3 : C.bg2, padding:28, cursor:"pointer", transition:"all .3s", position:"relative", border: isSel ? `2px solid ${C.brown}` : "2px solid transparent", borderLeft: matched ? `3px solid ${C.brown}` : isSel ? `2px solid ${C.brown}` : "2px solid transparent" }}>
              {matched && <span style={{ position:"absolute", top:10, right:10, fontSize:7, letterSpacing:"0.2em", textTransform:"uppercase", padding:"3px 8px", background:C.brown, color:C.bg }}>✦ Match</span>}
              <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brownL, marginBottom:6 }}>{f.house}</p>
              <p style={{ fontFamily:F.cor, fontSize:22, fontWeight:300, color:C.white, lineHeight:1.1, marginBottom:4 }}>{f.name}</p>
              <p style={{ fontSize:9, color:C.textFaint, marginBottom:12 }}>{f.year}</p>
              <span style={{ fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase", padding:"3px 10px", border:`1px solid rgba(107,76,59,.25)`, color:C.brownL, display:"inline-block", marginBottom:12 }}>{f.family}</span>
              <div style={{ fontSize:11, color:C.textDim, lineHeight:1.7, marginBottom:12 }}>
                <strong>Top:</strong> {f.top.slice(0,3).join(", ")}<br/>
                <strong>Heart:</strong> {f.mid.slice(0,3).join(", ")}<br/>
                <strong>Base:</strong> {f.base.slice(0,3).join(", ")}
              </div>
              <button style={{ width:"100%", padding:9, background: isSel ? C.brown : "transparent", border:`1px solid rgba(107,76,59,.22)`, color: isSel ? C.bg : C.brownL, fontFamily:F.ral, fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", cursor:"pointer", marginBottom:6 }}>
                {isSel ? "✦ Selected" : "Select →"}
              </button>
              <button onClick={(e) => { e.stopPropagation(); if (!isLoggedIn) { onOpenAuth(); return; } onToggleSave(f, chapterIdx); }} style={{ width:"100%", padding:9, background: isSaved ? C.brown : "transparent", border:`1px solid rgba(107,76,59,.22)`, color: isSaved ? C.bg : C.brownL, fontFamily:F.ral, fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", cursor:"pointer", transition:"all .3s" }}>
                {isSaved ? "✦ Saved to Collection" : "+ Save to Collection"}
              </button>
            </div>
          );
        })}
      </div>
      {selectedFrag && (
        <div style={{ background:C.bg2, border:`1px solid rgba(107,76,59,.18)`, animation:"fbIn .5s ease" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"24px 36px", borderBottom:`1px solid rgba(107,76,59,.12)` }}>
            <div>
              <p style={{ fontSize:8, letterSpacing:"0.35em", textTransform:"uppercase", color:C.brownL, marginBottom:4 }}>Your AETAS Formula</p>
              <p style={{ fontFamily:F.cor, fontSize:26, fontWeight:300, color:C.white }}>{selectedFrag.name} — AETAS Formula</p>
            </div>
            <button onClick={() => setSelectedFrag(null)} style={{ background:"transparent", border:`1px solid rgba(107,76,59,.22)`, color:C.textDim, fontFamily:F.ral, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", padding:"9px 18px", cursor:"pointer" }}>✕ Change</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
            <div style={{ padding:36, borderRight:`1px solid rgba(107,76,59,.1)` }}>
              <p style={{ fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brownL, marginBottom:4 }}>{selectedFrag.house}</p>
              <p style={{ fontFamily:F.cor, fontSize:34, fontWeight:300, color:C.white, lineHeight:1.0, marginBottom:4 }}>{selectedFrag.name}</p>
              <p style={{ fontSize:10, color:C.textFaint, marginBottom:16 }}>Est. {selectedFrag.year}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {selectedFrag.accords.map(a => <span key={a} style={{ fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase", padding:"4px 10px", border:`1px solid rgba(107,76,59,.25)`, color:C.brownL }}>{a}</span>)}
              </div>
              <p style={{ fontSize:12, color:C.textDim, lineHeight:1.8, marginBottom:24 }}>{selectedFrag.desc}</p>
              {[["Longevity", selectedFrag.longevity], ["Sillage", selectedFrag.sillage], ["Versatility", selectedFrag.versatility]].map(([label, val]) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10 }}>
                  <span style={{ fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase", color:C.textFaint, minWidth:76 }}>{label}</span>
                  <div style={{ flex:1, height:2, background:"rgba(107,76,59,.12)" }}>
                    <div style={{ height:"100%", background:C.brown, width:val+"%", transition:"width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:36, display:"flex", flexDirection:"column", gap:24 }}>
              <div>
                <p style={{ fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brownL, marginBottom:12 }}>Note Pyramid</p>
                {[["Top Notes", selectedFrag.top], ["Heart Notes", selectedFrag.mid], ["Base Notes", selectedFrag.base]].map(([tier, notes]) => (
                  <div key={tier} style={{ display:"flex", alignItems:"start", gap:16, padding:"12px 0", borderBottom:`1px solid rgba(107,76,59,.08)` }}>
                    <span style={{ fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase", color:C.textFaint, minWidth:72, paddingTop:3 }}>{tier}</span>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {notes.map((n, i) => <span key={n} style={{ fontSize:10, padding:"4px 10px", background:C.bg, color:C.text, border:`1px solid rgba(107,76,59,.18)`, animation:`noteIn .3s ease ${i*.1}s forwards`, opacity:0 }}>{n}</span>)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:C.bg, padding:20 }}>
                <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brownL, marginBottom:10 }}>AETAS Reinterpretation</p>
                <p style={{ fontFamily:F.cor, fontStyle:"italic", fontSize:15, lineHeight:1.7, color:C.text, marginBottom:8 }}>{selectedFrag.aetasNote}</p>
                <p style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:C.brown }}>{chapterIdx >= 0 ? CHAPTERS[chapterIdx].name : "Your Chapter"}</p>
              </div>
              {!confirmed ? (
                <button onClick={confirmFormula} style={{ padding:14, background:C.brown, color:C.bg, fontFamily:F.ral, fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>Confirm This Formula →</button>
              ) : (
                <div style={{ padding:20, background:C.brown }}>
                  <p style={{ fontFamily:F.cor, fontSize:18, fontWeight:300, color:C.bg, marginBottom:6 }}>✦ Formula Confirmed. Your AETAS journey begins.</p>
                  <p style={{ fontSize:11, color:"rgba(237,224,212,.65)", lineHeight:1.7, marginBottom:12 }}>In a real AETAS experience, your QR code and formula ID are now generated and linked to your bottle in the Azure database.</p>
                  <p style={{ fontFamily:F.cin, fontSize:13, letterSpacing:"0.2em", color:C.bg }}>Formula ID: {formulaId}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}