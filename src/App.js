import { useState, useEffect, useRef, useCallback } from "react";
import "./styles/global.css";

import { C, F }          from "./utils/constants";
import { lsGet, lsSet }  from "./utils/localStorage";

import Toast             from "./components/UI/Toast";
import AuthModal         from "./components/Auth/AuthModal";
import Dashboard         from "./components/Dashboard/Dashboard";
import AIQuiz            from "./components/Quiz/AIQuiz";
import FragranceSelector from "./components/Fragrance/FragranceSelector";
import HubFaceScan       from "./components/Hubs/HubFaceScan";
import HubEmotionalMapping from "./components/Hubs/HubEmotionalMapping";
import HubQR             from "./components/Hubs/HubQR";
import HubIdentityVault from "./components/Hubs/HubIdentityVault";
import HubCVScan         from "./components/Hubs/HubCVScan";
import HubProgression    from "./components/Hubs/HubProgression";

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const hubTabs = [
  { icon:"✦", num:"01", label:"About AETAS" },
  { icon:"◈", num:"02", label:"AI Personalization"  },
  { icon:"◉", num:"03", label:"Face Scanning"        },
  { icon:"◎", num:"04", label:"Emotional Mapping"    },
  { icon:"▣", num:"05", label:"QR System"            },
  { icon:"⬡", num:"06", label:"IdentityVault"       },
  { icon:"◍", num:"07", label:"CV Bottle Scan"       },
  { icon:"∞", num:"08", label:"Progression Engine"   },
];

const navLinkStyle = { fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:C.textDim, textDecoration:"none", transition:"color .3s", background:"none", border:"none", cursor:"pointer", fontFamily:F.ral, fontWeight:300, padding:0 };

export default function App() {
  const [user,       setUser]       = useState(() => lsGet("aetas:session"));
  const [showAuth,   setShowAuth]   = useState(false);
  const [showDash,   setShowDash]   = useState(false);
  const [chapterIdx, setChapterIdx] = useState(-1);
  const [saved,      setSaved]      = useState([]);
  const [toast,      setToast]      = useState("");
  const [activeHub,  setActiveHub]  = useState(0);
  const toastTimer = useRef(null);

  useEffect(() => { if (user) setSaved(lsGet(`aetas:saved:${user.email}`) || []); }, [user]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  const handleLogin = (u) => {
    setUser(u); lsSet("aetas:session", u);
    setSaved(lsGet(`aetas:saved:${u.email}`) || []);
    setShowAuth(false);
    showToast(`Welcome back, ${u.name.split(" ")[0]}.`);
    setTimeout(() => setShowDash(true), 500);
  };

  const handleSignOut = () => {
    setUser(null); lsSet("aetas:session", null); setSaved([]);
    setShowDash(false); showToast("You have been signed out.");
  };

  const toggleSave = (frag, ci) => {
    if (!user) { setShowAuth(true); return; }
    const current = lsGet(`aetas:saved:${user.email}`) || [];
    const idx = current.findIndex(f => f.id === frag.id);
    let next;
    if (idx > -1) {
      next = current.filter(f => f.id !== frag.id);
      showToast(`Removed ${frag.name} from your collection.`);
    } else {
      next = [...current, { ...frag, savedAt: new Date().toISOString(), chapterIdx: ci }];
      showToast(`${frag.name} saved to your collection.`);
    }
    lsSet(`aetas:saved:${user.email}`, next); setSaved(next);
  };

  const removeFromSaved = (id) => {
    const frag = saved.find(f => f.id === id);
    const next = saved.filter(f => f.id !== id);
    lsSet(`aetas:saved:${user.email}`, next); setSaved(next);
    if (frag) showToast(`Removed ${frag.name} from your collection.`);
  };

  return (
<div style={{ background:"#ede8e0", minHeight:"100vh", color:C.text, position:"relative" }}>
  <div style={{
    position:"fixed",
    inset:0,
    backgroundImage:"url('/AETAS_15_.png')",
    backgroundSize:"cover",
    backgroundPosition:"center",
    backgroundRepeat:"no-repeat",
    opacity:1,
    zIndex:0,
    pointerEvents:"none",
  }} />      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, padding:"20px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(237,224,212,.96)", backdropFilter:"blur(8px)", borderBottom:`1px solid rgba(107,76,59,.1)` }}>
        <a href="#top" style={{ fontFamily:F.cin, fontSize:20, letterSpacing:"0.35em", color:C.brown, textDecoration:"none" }}>AETAS</a>
        <ul style={{ display:"flex", gap:32, listStyle:"none" }}>
          <li><a href="#features" style={navLinkStyle}>Technology</a></li>
          <li><a href="#selector" style={navLinkStyle}>Fragrances</a></li>
          <li>
            <button onClick={() => user ? setShowDash(true) : setShowAuth(true)} style={{ ...navLinkStyle, color: user ? C.brown : C.textDim }}>
              {user ? `${user.name.split(" ")[0]}'s Collection` : "My Account"}
            </button>
          </li>
        </ul>
      </nav>

<div id="top" style={{ height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", position:"relative", zIndex:1, overflow:"hidden", paddingTop:80 }}>        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(107,76,59,.07) 0%,transparent 70%)", animation:"pulse 6s ease-in-out infinite" }} />
        <p style={{ fontSize:9, letterSpacing:"0.5em", textTransform:"uppercase", color:C.brown, marginBottom:28, animation:"fadeUp 1s ease forwards", opacity:0 }}>A L'Oréal Luxe — Armani Privé Concept</p>
        <h1 style={{ fontFamily:F.cor, fontWeight:300, fontSize:"clamp(80px,12vw,160px)", lineHeight:0.9, letterSpacing:"-0.02em", color:C.white, animation:"fadeUp 1.2s ease .2s forwards", opacity:0 }}>
          AE<em style={{ fontStyle:"italic", color:C.brown }}>T</em>AS
        </h1>
        <p style={{ fontFamily:F.cor, fontStyle:"italic", fontSize:"clamp(16px,2vw,22px)", color:C.textDim, marginTop:20, animation:"fadeUp 1.2s ease .4s forwards", opacity:0 }}>The fragrance that evolves with you.</p>
        <div style={{ marginTop:48, display:"flex", gap:16, animation:"fadeUp 1.2s ease .6s forwards", opacity:0 }}>
          <button onClick={() => document.getElementById("features").scrollIntoView({behavior:"smooth"})} style={{ padding:"14px 40px", background:C.brown, color:C.bg, fontFamily:F.ral, fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>Experience the Technology</button>
          <button onClick={() => document.getElementById("selector").scrollIntoView({behavior:"smooth"})} style={{ padding:"14px 40px", background:"transparent", color:C.brown, fontFamily:F.ral, fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", border:`1px solid ${C.brown}`, cursor:"pointer" }}>Select Your Fragrance</button>
        </div>
      </div>

<div id="features" style={{ background:C.bg2, position:"relative", zIndex:1 }}>        <div style={{ display:"flex", overflowX:"auto", borderBottom:`1px solid rgba(107,76,59,.15)` }}>
          {hubTabs.map((t, i) => (
            <button key={i} onClick={() => setActiveHub(i)} style={{ flex:1, minWidth:140, padding:"28px 20px", background: activeHub===i?C.bg:"transparent", border:"none", borderBottom: activeHub===i?`3px solid ${C.brown}`:"3px solid transparent", cursor:"pointer", textAlign:"center", transition:"all .3s", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:22 }}>{t.icon}</span>
              <span style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:C.brownL }}>{t.num}</span>
              <span style={{ fontSize:11, letterSpacing:"0.1em", color: activeHub===i?C.brown:C.text, fontWeight:400 }}>{t.label}</span>
            </button>
          ))}
        </div>
        <div style={{ padding:64, background:C.bg, minHeight:600 }}>
          {activeHub === 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
              <div>
                <p style={{ fontSize:9, letterSpacing:"0.4em", textTransform:"uppercase", color:C.brown, marginBottom:16 }}>A L'Oréal Luxe — Armani Privé Concept</p>
                <h2 style={{ fontFamily:F.cor, fontSize:56, fontWeight:300, color:C.white, marginBottom:24, lineHeight:1.0 }}>About<br/><em style={{ fontStyle:"italic", color:C.brown }}>AETAS</em></h2>
                <p style={{ fontSize:13, lineHeight:2.0, color:C.textDim, marginBottom:24 }}>AETAS — Latin for "age", "era", and "lifetime" — is an AI-powered luxury fragrance that evolves with you, turning personal growth into scent. Developed under Armani Privé for L'Oréal Luxe, AETAS is not a fragrance. It is a living formula.</p>
<p style={{ fontSize:13, lineHeight:2.0, color:C.textDim, marginBottom:24 }}>The fragrance industry has always offered the same thing: static, one-size-fits-all scents that cannot keep pace with who you are becoming. AETAS solves this. Through an AI and biometric system that adapts to your identity over time, your formula is never finished — it evolves as you do.</p>
<p style={{ fontSize:13, lineHeight:2.0, color:C.textDim, marginBottom:24 }}>Seven features work in unison — AI personalisation, biometric face scanning, emotional data mapping, QR identity encoding, cloud infrastructure, computer vision, and a progression engine — to map who you are today and evolve your formula as life changes you.</p>
<p style={{ fontSize:13, lineHeight:2.0, color:C.textDim, marginBottom:32 }}>Five chapters. One lifetime. <em style={{ fontStyle:"italic", color:C.brown }}>Your scent, always current.</em></p>
                <div style={{ display:"flex", gap:16 }}>
                  <button onClick={() => setActiveHub(1)} style={{ padding:"14px 40px", background:C.brown, color:C.bg, fontFamily:F.ral, fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>Begin Your Profile →</button>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(107,76,59,.08) 0%,transparent 70%)" }} />
                <img
                  src="/AETAS_Bottle.png"
                  alt="AETAS Bottle"
                  style={{
                    height:"70vh",
                    objectFit:"contain",
                    position:"relative",
                    zIndex:1,
                    maskImage:"linear-gradient(to bottom, black 70%, transparent 100%)",
                    WebkitMaskImage:"linear-gradient(to bottom, black 70%, transparent 100%)",
                    filter:"drop-shadow(0 40px 80px rgba(107,76,59,0.2))",
                    mixBlendMode:"multiply",
                  }}
                />
              </div>
            </div>
          )}
          {activeHub === 1 && <AIQuiz              onChapterSet={setChapterIdx} />}
          {activeHub === 2 && <HubFaceScan         chapterIdx={chapterIdx} onChapterSet={setChapterIdx} />}
          {activeHub === 3 && <HubEmotionalMapping onChapterSet={setChapterIdx} />}
          {activeHub === 4 && <HubQR               chapterIdx={chapterIdx} />}
          {activeHub === 5 && <HubIdentityVault />}
          {activeHub === 6 && <HubCVScan />}
          {activeHub === 7 && <HubProgression      chapterIdx={chapterIdx} onChapterSet={setChapterIdx} />}
        </div>
      </div>

  <div id="selector" style={{ position:"relative", zIndex:1 }}>
        <FragranceSelector chapterIdx={chapterIdx} saved={saved} onToggleSave={toggleSave} onOpenAuth={() => setShowAuth(true)} isLoggedIn={!!user} onGoToQuiz={() => { setActiveHub(1); document.getElementById("features").scrollIntoView({behavior:"smooth"}); }} />
      </div>

<footer style={{ padding:64, borderTop:`1px solid rgba(107,76,59,.12)`, display:"flex", justifyContent:"space-between", alignItems:"flex-end", position:"relative", zIndex:1 }}>        <div>
          <div style={{ fontFamily:F.cin, fontSize:26, letterSpacing:"0.35em", color:C.brown }}>AETAS</div>
          <div style={{ fontFamily:F.cor, fontStyle:"italic", fontSize:15, color:C.textDim, marginTop:6 }}>The fragrance that evolves with you.</div>
        </div>
        <div style={{ textAlign:"right", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:C.brownL, lineHeight:2.2 }}>
          <div>A L'Oréal Luxe Concept</div>
          <div>Under Armani Privé</div>
          <div style={{ marginTop:12, opacity:.4 }}>Concept — 2026</div>
        </div>
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />}
      {showDash && user && <Dashboard user={user} saved={saved} onClose={() => setShowDash(false)} onSignOut={handleSignOut} onRemove={removeFromSaved} />}
      <Toast msg={toast} />
    </div>
  );
}