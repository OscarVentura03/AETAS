import { useState } from "react";
import { C, F } from "../../utils/constants";
import { lsGet, lsSet } from "../../utils/localStorage";

export default function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const clearAll = () => { setError(""); setInfo(""); };

  const submit = () => {
    clearAll();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (mode === "signup" && !name) { setError("Please enter your name."); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }
    const users = lsGet("aetas:users") || {};
    if (mode === "signup") {
      if (users[email]) { setError("An account with this email already exists."); return; }
      users[email] = { name, password, createdAt: new Date().toISOString() };
      lsSet("aetas:users", users);
      onLogin({ email, name });
    } else {
      const u = users[email];
      if (!u || u.password !== password) { setError("Incorrect email or password."); return; }
      onLogin({ email, name: u.name });
    }
  };

  const submitForgot = () => {
    clearAll();
    if (!email) { setError("Please enter your email address."); return; }
    const users = lsGet("aetas:users") || {};
    if (!users[email]) { setError("No account found with that email address."); return; }
    setInfo(`Account found for ${users[email].name}. You may now set a new password.`);
    setMode("reset");
  };

  const submitReset = () => {
    clearAll();
    if (!newPassword || !confirmPassword) { setError("Please fill in both password fields."); return; }
    if (newPassword.length < 4) { setError("Password must be at least 4 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    const users = lsGet("aetas:users") || {};
    users[email] = { ...users[email], password: newPassword };
    lsSet("aetas:users", users);
    setInfo("Password updated. You can now sign in.");
    setMode("login");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const inp = {
    width: "100%", background: C.bg2, border: `1px solid rgba(107,76,59,.2)`,
    padding: "12px 16px", fontFamily: F.ral, fontSize: 12, color: C.text,
    fontWeight: 300, outline: "none", marginBottom: 12, transition: "border-color .25s"
  };

  const tab = (m) => ({
    flex: 1, background: "none", border: "none",
    borderBottom: mode === m ? `2px solid ${C.brown}` : "2px solid transparent",
    padding: "10px 0", fontFamily: F.ral, fontSize: 10, letterSpacing: "0.22em",
    textTransform: "uppercase", cursor: "pointer",
    color: mode === m ? C.brown : C.textFaint, marginBottom: -1, transition: "all .2s"
  });

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(28,14,6,.65)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", animation: "authIn .3s ease" }}>
      <div style={{ background: C.bg, border: `1px solid rgba(107,76,59,.2)`, padding: "52px 44px", maxWidth: 420, width: "90%", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", fontSize: 16, color: C.textFaint, cursor: "pointer" }}>✕</button>
        <p style={{ fontFamily: F.cin, fontSize: 22, letterSpacing: "0.4em", color: C.brown, textAlign: "center", marginBottom: 6 }}>AETAS</p>
        <p style={{ fontFamily: F.cor, fontStyle: "italic", fontSize: 14, color: C.textFaint, textAlign: "center", marginBottom: 32 }}>The fragrance that evolves with you.</p>

        {(mode === "forgot" || mode === "reset") ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: F.cor, fontSize: 22, fontWeight: 300, color: C.white, marginBottom: 6 }}>
                {mode === "forgot" ? "Recover Account" : "Set New Password"}
              </p>
              <p style={{ fontSize: 12, color: C.textFaint, lineHeight: 1.7 }}>
                {mode === "forgot"
                  ? "Enter the email address associated with your AETAS account."
                  : `Enter a new password for ${email}.`}
              </p>
            </div>
            {info  && <p style={{ fontSize: 11, color: C.brown, background: "rgba(107,76,59,.08)", padding: "10px 14px", marginBottom: 12, lineHeight: 1.6 }}>{info}</p>}
            {error && <p style={{ fontSize: 11, color: "#9b2020", marginBottom: 10 }}>{error}</p>}
            {mode === "forgot" && (
              <>
                <input style={inp} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submitForgot()} />
                <button onClick={submitForgot} style={{ width: "100%", padding: "13px", background: C.brown, color: C.bg, fontFamily: F.ral, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", border: "none", cursor: "pointer", marginBottom: 14 }}>
                  Find My Account
                </button>
              </>
            )}
            {mode === "reset" && (
              <>
                <input style={inp} type="password" placeholder="New password"     value={newPassword}     onChange={e => setNewPassword(e.target.value)} />
                <input style={inp} type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submitReset()} />
                <button onClick={submitReset} style={{ width: "100%", padding: "13px", background: C.brown, color: C.bg, fontFamily: F.ral, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", border: "none", cursor: "pointer", marginBottom: 14 }}>
                  Update Password
                </button>
              </>
            )}
            <p style={{ textAlign: "center", fontFamily: F.cor, fontSize: 13, color: C.textFaint, fontStyle: "italic" }}>
              <span onClick={() => { setMode("login"); clearAll(); }} style={{ color: C.brown, cursor: "pointer", textDecoration: "underline" }}>← Back to Sign In</span>
            </p>
          </>
        ) : (
          <>
            <div style={{ display: "flex", borderBottom: `1px solid rgba(107,76,59,.15)`, marginBottom: 28 }}>
              <button style={tab("login")}  onClick={() => { setMode("login");  clearAll(); }}>Sign In</button>
              <button style={tab("signup")} onClick={() => { setMode("signup"); clearAll(); }}>Create Account</button>
            </div>
            {info  && <p style={{ fontSize: 11, color: C.brown, background: "rgba(107,76,59,.08)", padding: "10px 14px", marginBottom: 12, lineHeight: 1.6 }}>{info}</p>}
            {mode === "signup" && <input style={inp} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />}
            <input style={inp} type="email"    placeholder="Email address" value={email}    onChange={e => setEmail(e.target.value)} />
            <input style={inp} type="password" placeholder="Password"      value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} />
            {error && <p style={{ fontSize: 11, color: "#9b2020", marginBottom: 10 }}>{error}</p>}
            <button onClick={submit} style={{ width: "100%", padding: "13px", background: C.brown, color: C.bg, fontFamily: F.ral, fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", border: "none", cursor: "pointer", marginTop: 4 }}>
              {mode === "login" ? "Enter AETAS" : "Begin Your Journey"}
            </button>
            {mode === "login" && (
              <p style={{ textAlign: "center", marginTop: 10 }}>
                <span onClick={() => { setMode("forgot"); clearAll(); }} style={{ fontSize: 11, color: C.brownL, cursor: "pointer", fontFamily: F.ral, textDecoration: "underline", letterSpacing: "0.08em" }}>
                  Forgot your password?
                </span>
              </p>
            )}
            <p style={{ textAlign: "center", marginTop: 14, fontFamily: F.cor, fontSize: 13, color: C.textFaint, fontStyle: "italic" }}>
              {mode === "login" ? "New to AETAS? " : "Already have an account? "}
              <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); clearAll(); }} style={{ color: C.brown, cursor: "pointer", textDecoration: "underline" }}>
                {mode === "login" ? "Create an account" : "Sign in"}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}