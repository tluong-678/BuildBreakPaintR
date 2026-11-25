"use client";
import { useEffect, useState } from "react";
import styles from "./StartScreen.module.css";

type Mode = "login" | "register";

export default function StartScreen() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => setUser(d.user)).catch(() => {});
    const params = new URLSearchParams(window.location.search);
    if (params.has("authError")) setError("Google sign-in could not be completed. Check Supabase Google provider settings.");
  }, []);

  async function submit() {
    setError("");
    if (mode === "register" && password !== confirm) return setError("Passwords do not match.");
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Authentication failed.");
      if (mode === "register" && !data.success) throw new Error(data.error || "Registration failed.");
      window.location.href = "/game";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  return <main className={styles.screen}>
    <div className={styles.glow} />
    <header className={styles.header}><div className={styles.logo}>🧱 BBP</div><div className={styles.headerRight}>{user ? <><span>Hi, {user.username}</span><button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); setUser(null); }}>Log out</button></> : <button onClick={() => setMode("login")}>Log in</button>}<select aria-label="Language" defaultValue="en"><option value="en">English</option><option value="vi">Tiếng Việt</option><option value="zh">中文</option></select></div></header>
    <section className={styles.hero}>
      <div className={styles.copy}><p className={styles.eyebrow}>YOUR WORLD. YOUR RULES.</p><h1>Build, Break,<br/><span>Paint!</span></h1><p className={styles.description}>Welcome to Build, Break, Paint! You can build, break and paint there!</p>
        <div className={styles.actions}><button className={styles.primary} onClick={() => user ? window.location.assign("/game") : setMode("login")}>▶ Play</button><button className={styles.secondary} onClick={() => user ? window.location.assign("/multiplayer") : setMode("login")}>🌐 Multiplayer</button></div>
        {!user && <p className={styles.hint}>Sign in or create an account to start playing.</p>}
      </div>
      <div className={styles.art} aria-hidden="true"><div className={`${styles.cube} ${styles.c1}`}/><div className={`${styles.cube} ${styles.c2}`}/><div className={`${styles.cube} ${styles.c3}`}/><div className={styles.avatar}><div className={styles.head}><i/><i/></div><div className={styles.body}/><div className={`${styles.leg} ${styles.l1}`}/><div className={`${styles.leg} ${styles.l2}`}/></div><div className={styles.platform}/></div>
    </section>
    {mode && <div className={styles.overlay} onMouseDown={e => { if (e.target === e.currentTarget) setMode(null); }}><section className={styles.modal}>
      <button className={styles.x} onClick={() => setMode(null)}>×</button><h2>{mode === "login" ? "Welcome back" : "Create account"}</h2><p>{mode === "login" ? "Log in to continue your world." : "Choose a username and password."}</p>
      <label>Username<input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" /></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
      {mode === "register" && <label>Confirm password<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" /></label>}
      {error && <p className={styles.error}>{error}</p>}
      <button className={styles.primary} disabled={busy} onClick={submit}>{busy ? "Please wait..." : mode === "login" ? "Log in" : "Register"}</button>
      <button className={styles.google} onClick={() => window.location.assign("/api/auth/google")}>Continue with Google</button>
      <p className={styles.switch}>{mode === "login" ? "New here?" : "Already have an account?"} <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "Register" : "Log in"}</button></p>
    </section></div>}
  </main>;
}
