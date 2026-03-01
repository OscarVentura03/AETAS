import { useState } from "react";
import { C, F, genId } from "../../utils/constants";
import { INIT_AZURE } from "../../data/chapters";

export default function HubIdentityVault() {
  const [records, setRecords] = useState(INIT_AZURE);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCh, setNewCh] = useState("");
  const [newFrag, setNewFrag] = useState("");

  const filtered = records.filter(r => !search || [r.name,r.id,r.chapter].some(v=>v.toLowerCase().includes(search.toLowerCase())));

  const save = () => {
    const id = genId(0);
    setRecords(r => [{id, name:newName||"New Customer", chapter:newCh||"Chapter I — Emergence", fragrance:newFrag||"AETAS Formula", status:"Active", date:new Date().toLocaleDateString("en-GB",{month:"short",year:"numeric"})}, ...r]);
    setShowModal(false); setNewName(""); setNewCh(""); setNewFrag("");
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:64, alignItems:"start" }}>
      <div>
       <p style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:C.brown, marginBottom:16 }}>Feature 05 — Cloud Infrastructure</p>
<h2 style={{ fontFamily:F.cor, fontSize:48, fontWeight:300, color:C.white, marginBottom:16, lineHeight:1.0 }}>Identity<br/>Vault</h2>
<p style={{ fontSize:13, lineHeight:1.9, color:C.textDim, marginBottom:28 }}>Live customer formula records. Add, search, and manage profiles — secured in the AETAS IdentityVault cloud infrastructure.</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:3, marginBottom:24 }}>
          {[{num:records.length,lbl:"Profiles"},{num:records.filter(r=>r.status==="Active").length,lbl:"Active"},{num:records.filter(r=>r.status==="Evolving").length,lbl:"Evolving"}].map(s=>(
            <div key={s.lbl} style={{ background:C.bg2, padding:20, textAlign:"center" }}>
              <div style={{ fontFamily:F.cor, fontSize:36, fontWeight:300, color:C.brown }}>{s.num}</div>
              <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:C.textFaint, marginTop:4 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:20 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, chapter, or ID..." style={{ flex:1, padding:"10px 16px", border:`1px solid rgba(107,76,59,.25)`, background:C.bg2, color:C.text, fontFamily:F.ral, fontSize:12, outline:"none" }} />
          <button onClick={() => setShowModal(true)} style={{ padding:"10px 24px", background:C.brown, color:C.bg, fontFamily:F.ral, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>+ Add</button>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["Formula ID","Customer","Chapter","Fragrance","Status"].map(h=><th key={h} style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:C.brownL, padding:"10px 14px", borderBottom:`2px solid rgba(107,76,59,.2)`, textAlign:"left", background:C.bg2 }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(r=>(
              <tr key={r.id}>
                <td style={{ fontFamily:F.cin, fontSize:11, letterSpacing:"0.1em", color:C.brown, padding:"12px 14px", borderBottom:`1px solid rgba(107,76,59,.08)` }}>{r.id}</td>
                {[r.name, r.chapter.split(" — ")[0], r.fragrance].map((v,i)=><td key={i} style={{ fontSize:12, padding:"12px 14px", borderBottom:`1px solid rgba(107,76,59,.08)`, color:C.textDim }}>{v}</td>)}
                <td style={{ padding:"12px 14px", borderBottom:`1px solid rgba(107,76,59,.08)` }}>
                  <span style={{ fontSize:8, letterSpacing:"0.15em", textTransform:"uppercase", padding:"3px 8px", background: r.status==="Evolving"?"rgba(160,98,42,.15)":"rgba(107,76,59,.12)", color: r.status==="Evolving"?C.gold:C.brown }}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <p style={{ fontSize:9, letterSpacing:"0.35em", textTransform:"uppercase", color:C.brownL, marginBottom:20 }}>Formula Activity Log</p>
        <div style={{ borderLeft:`2px solid rgba(107,76,59,.2)`, paddingLeft:24 }}>
          {[
            {t:"09:14", e:"Formula confirmed for Elena Vasquez", d:"Chapter IV — Mastery", a:true},
            {t:"08:52", e:"Progression check triggered",         d:"James Park — 12 months elapsed"},
            {t:"08:30", e:"New profile created",                 d:"Marco Laurent — Chapter I"},
            {t:"Yesterday", e:"Refill processed",               d:"Hiroshi Tanaka — Chapter V"},
            {t:"2 days ago", e:"Formula evolved",               d:"Sofia Reyes — Chapter II → III"},
          ].map((l,i)=>(
            <div key={i} style={{ marginBottom:20, position:"relative" }}>
              <div style={{ position:"absolute", left:-29, top:6, width:8, height:8, borderRadius:"50%", background: l.a?C.brown:C.brownL, boxShadow: l.a?`0 0 10px rgba(107,76,59,.4)`:"none" }} />
              <p style={{ fontSize:9, letterSpacing:"0.2em", color:C.textFaint, marginBottom:4 }}>{l.t}</p>
              <p style={{ fontSize:12, color:C.text, marginBottom:2 }}>{l.e}</p>
              <p style={{ fontSize:11, color:C.textFaint }}>{l.d}</p>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div onClick={e=>e.target===e.currentTarget&&setShowModal(false)} style={{ position:"fixed", inset:0, background:"rgba(46,26,16,.5)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:C.bg, padding:48, maxWidth:480, width:"90%", border:`1px solid rgba(107,76,59,.2)` }}>
            <h3 style={{ fontFamily:F.cor, fontSize:32, fontWeight:300, color:C.white, marginBottom:8 }}>Add Profile</h3>
            <p style={{ fontSize:12, color:C.textDim, marginBottom:32 }}>Create a new customer formula record in the AETAS Azure database.</p>
            {[["Customer Name","e.g. Sofia Reyes",newName,setNewName],["Chapter","e.g. Chapter II — Ambition",newCh,setNewCh],["Fragrance","e.g. Bleu de Chanel",newFrag,setNewFrag]].map(([label,ph,val,setter])=>(
              <div key={label} style={{ marginBottom:16 }}>
                <p style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:C.brownL, marginBottom:6 }}>{label}</p>
                <input value={val} onChange={e=>setter(e.target.value)} placeholder={ph} style={{ width:"100%", padding:"10px 14px", border:`1px solid rgba(107,76,59,.25)`, background:C.bg2, color:C.text, fontFamily:F.ral, fontSize:12, outline:"none" }} />
              </div>
            ))}
            <div style={{ display:"flex", gap:12, marginTop:24 }}>
              <button onClick={save} style={{ flex:1, padding:12, background:C.brown, color:C.bg, fontFamily:F.ral, fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>Save to Database</button>
              <button onClick={() => setShowModal(false)} style={{ padding:"12px 24px", background:"transparent", color:C.textDim, fontFamily:F.ral, fontSize:10, letterSpacing:"0.2em", border:`1px solid rgba(107,76,59,.25)`, cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}