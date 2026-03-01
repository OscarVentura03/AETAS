import { C, F } from "../../utils/constants";
import { CHAPTERS } from "../../data/chapters";

export default function Dashboard({ user, onClose, onSignOut, saved, onRemove }) {
  const sorted   = [...saved].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  const houses   = new Set(saved.map(f => f.house)).size;
  const families = new Set(saved.map(f => f.family)).size;
  const chs      = new Set(saved.map(f => f.chapterIdx)).size;

  const chapterGroups = {};
  saved.forEach(f => {
    const key = f.chapterIdx >= 0 ? CHAPTERS[f.chapterIdx].name : "Uncategorised";
    if (!chapterGroups[key]) chapterGroups[key] = 0;
    chapterGroups[key]++;
  });

  return (
    <div style={{ position:"fixed", inset:0, background:C.bg, zIndex:1500, overflowY:"auto", animation:"dashIn .4s cubic-bezier(.4,0,.2,1)" }}>
      <div style={{ position:"sticky", top:0, background:"rgba(237,224,212,.97)", backdropFilter:"blur(8px)", borderBottom:`1px solid rgba(107,76,59,.12)`, padding:"0 48px", display:"flex", alignItems:"center", justifyContent:"space-between", height:64, zIndex:10 }}>
        <span style={{ fontFamily:F.cin, fontSize:16, letterSpacing:"0.35em", color:C.brown }}>AETAS</span>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <span style={{ fontFamily:F.cor, fontSize:14, color:C.textFaint, fontStyle:"italic" }}>{user.name}</span>
          {[["← Back to Experience", onClose], ["Sign Out", onSignOut]].map(([label, fn]) => (
            <button key={label} onClick={fn} style={{ background:"none", border:`1px solid rgba(107,76,59,.25)`, color:C.textFaint, padding:"6px 16px", fontFamily:F.ral, fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer" }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"56px 48px" }}>
        <div style={{ marginBottom:52 }}>
          <p style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:C.brown, marginBottom:10 }}>Your AETAS Profile</p>
          <h1 style={{ fontFamily:F.cor, fontSize:"clamp(36px,5vw,60px)", fontWeight:300, color:C.white, lineHeight:1.05, marginBottom:10 }}>{user.name}</h1>
          <p style={{ fontFamily:F.cor, fontStyle:"italic", fontSize:16, color:C.textFaint }}>
            {saved.length === 0 ? "Your collection awaits. Save fragrances that speak to you." : `${saved.length} fragrance${saved.length === 1 ? "" : "s"} in your collection.`}
          </p>
        </div>
        {saved.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:3, marginBottom:52 }}>
            {[{num:saved.length,lbl:"Saved"},{num:houses,lbl:"Houses"},{num:families,lbl:"Families"},{num:chs,lbl:"Chapters"}].map(s => (
              <div key={s.lbl} style={{ background:C.bg2, padding:24, textAlign:"center" }}>
                <div style={{ fontFamily:F.cor, fontSize:38, fontWeight:300, color:C.brown }}>{s.num}</div>
                <div style={{ fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:C.textFaint, marginTop:4 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        )}
        {saved.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 40px", border:`1px dashed rgba(107,76,59,.2)` }}>
            <div style={{ fontFamily:F.cor, fontSize:48, color:"rgba(107,76,59,.2)", marginBottom:16 }}>✦</div>
            <p style={{ fontFamily:F.cor, fontSize:22, fontStyle:"italic", color:C.textFaint, marginBottom:10 }}>Your collection is empty.</p>
            <p style={{ fontSize:12, color:C.textFaint, marginBottom:24 }}>Browse the fragrance library and save the scents that resonate with where you are in life.</p>
            <button onClick={onClose} style={{ padding:"12px 32px", background:C.brown, color:C.bg, fontFamily:F.ral, fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>Explore Fragrances →</button>
          </div>
        ) : (
          <>
            <p style={{ fontSize:9, letterSpacing:"0.35em", textTransform:"uppercase", color:C.brownL, marginBottom:20 }}>By Chapter</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:48 }}>
              {Object.entries(chapterGroups).map(([ch, count]) => (
                <div key={ch} style={{ padding:"14px 20px", background:C.bg2, borderLeft:`3px solid rgba(107,76,59,.25)`, minWidth:160 }}>
                  <p style={{ fontFamily:F.cor, fontSize:12, fontStyle:"italic", color:C.brownL, marginBottom:4 }}>{ch}</p>
                  <p style={{ fontSize:10, color:C.textFaint }}>{count} fragrance{count !== 1 ? "s" : ""}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize:9, letterSpacing:"0.35em", textTransform:"uppercase", color:C.brownL, marginBottom:20 }}>Your Collection</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:3 }}>
              {sorted.map(f => (
                <div key={f.id} style={{ background:C.bg2, padding:24, animation:"fadeIn .4s ease" }}>
                  <p style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brownL, marginBottom:6 }}>{f.house}</p>
                  <p style={{ fontFamily:F.cor, fontSize:22, fontWeight:300, color:C.white, lineHeight:1.1, marginBottom:4 }}>{f.name}</p>
                  <p style={{ fontSize:9, color:C.textFaint, marginBottom:10 }}>{f.year}</p>
                  <span style={{ fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase", padding:"3px 10px", border:`1px solid rgba(107,76,59,.25)`, color:C.brownL, display:"inline-block", marginBottom:10 }}>{f.family}</span>
                  <p style={{ fontSize:11, color:C.textDim, lineHeight:1.7, marginBottom:14 }}>
                    <strong>Top:</strong> {f.top.slice(0,3).join(", ")}<br/>
                    <strong>Heart:</strong> {f.mid.slice(0,3).join(", ")}<br/>
                    <strong>Base:</strong> {f.base.slice(0,3).join(", ")}
                  </p>
                  {f.chapterIdx >= 0 && (
                    <p style={{ fontSize:9, letterSpacing:"0.15em", textTransform:"uppercase", color:C.brown, marginBottom:14 }}>
                      ◈ {CHAPTERS[f.chapterIdx].name}
                    </p>
                  )}
                  <button onClick={() => onRemove(f.id)} style={{ width:"100%", padding:8, background:"transparent", border:`1px solid rgba(107,76,59,.2)`, color:C.textFaint, fontFamily:F.ral, fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", cursor:"pointer" }}>
                    Remove from Collection
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}