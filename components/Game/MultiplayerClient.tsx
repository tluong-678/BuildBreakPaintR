"use client";
import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/client";
import styles from "./Game.module.css";

type ChatMessage = { id: string; username: string; text: string; sentAt: string };

export default function MultiplayerClient() {
  const [username, setUsername] = useState("Player");
  const [room, setRoom] = useState("public-lobby");
  const [players, setPlayers] = useState<Array<{id:string;username:string}>>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [connection, setConnection] = useState("Connecting…");
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => {
      if (d.user) setUsername(d.user.username || d.user.email?.split("@")[0] || "Player");
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let supabase;
    try { supabase = createBrowserSupabase(); }
    catch { setConnection("Supabase not configured"); return; }
    const channel = supabase.channel(`room:${room}`, {
      config: { presence: { key: crypto.randomUUID() }, broadcast: { self: false } }
    });
    channelRef.current = channel;
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<{ username: string }>();
      const entries = Object.entries(state).flatMap(([key, values]) =>
        values.map((value, index) => ({ id: `${key}-${index}`, username: value.username }))
      );
      setPlayers(entries);
    });
    channel.on("broadcast", { event: "chat" }, ({ payload }) => {
      setMessages(old => [...old, payload as ChatMessage].slice(-100));
    });
    channel.subscribe(async status => {
      setConnection(status);
      if (status === "SUBSCRIBED") await channel.track({ username, online_at: new Date().toISOString() });
    });
    return () => { void supabase.removeChannel(channel); channelRef.current = null; };
  }, [room, username]);

  async function send() {
    const text = draft.trim().slice(0, 250);
    if (!text || !channelRef.current) return;
    const filtered = text.replace(/\b(fuck|shit|bitch|địt|đụ|lồn|cặc)\b/gi, "***");
    const message = { id: crypto.randomUUID(), username, text: filtered, sentAt: new Date().toISOString() };
    setMessages(old => [...old, message].slice(-100));
    await channelRef.current.send({ type: "broadcast", event: "chat", payload: message });
    setDraft("");
  }

  return <main className={styles.multiPage}>
    <header className={styles.top}><a href="/game">← Back to game</a><h1>Multiplayer</h1><span>{connection}</span></header>
    <section className={styles.multiGrid}>
      <div className={styles.roomCard}>
        <h2>Room</h2><input value={room} onChange={e => setRoom(e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || "public-lobby")} />
        <p>Share the room name with friends to join the same room.</p>
        <h3>Players online ({players.length})</h3>
        {players.map(p => <p key={p.id}>🟢 {p.username}</p>)}
      </div>
      <div className={styles.chatCard}>
        <h2>Live chat</h2><div className={styles.chatMessages}>{messages.map(m => <p key={m.id}><b>{m.username}:</b> {m.text}</p>)}</div>
        <div className={styles.chatInput}><input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") void send(); }} placeholder="Type a message…" /><button onClick={() => void send()}>Send</button></div>
      </div>
    </section>
    <p className={styles.notice}>This version includes online presence and realtime chat. Shared player movement and synchronized block editing are not implemented in this initial build.</p>
  </main>;
}
