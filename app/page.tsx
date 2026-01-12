"use client"
import { useEffect, useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import FounderProfile from '../components/interface/FounderProfile';
import NeuralEvangelist from '../components/interface/NeuralEvangelist';
import { useSovereignVoice } from '../hooks/useSovereignVoice';

export default function SovereignOS() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [input, setInput] = useState('');
  const [swarm, setSwarm] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speak } = useSovereignVoice();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { setUser(session.user); fetchLedger(); }
    };
    init();
    const i = setInterval(fetchLedger, 5000);
    return () => clearInterval(i);
  }, []);

  const fetchLedger = async () => {
    try {
      const res = await fetch('/api/governance/logs');
      if (res.ok) setLogs(await res.json());
    } catch (e) {}
  };

  const handleCommand = async (e: any) => {
    if (e.key !== 'Enter' || !input) return;
    const cmd = input; setInput(''); setIsThinking(true);
    speak("Sovereign intent recognized.");
    
    try {
      const res = await fetch('/api/alpha/command', {
        method: 'POST',
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      setSwarm(data.swarm || []);
      speak(data.output || "Operational.");
    } catch (err) { console.error("Link Stalled."); }
    
    setIsThinking(false);
    fetchLedger();
  };

  if (!user) return <div className="bg-black min-h-screen" />;

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden p-6 lg:p-12">
      {/* NEURAL AURA (Background) */}
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,#00d2ff05_0%,transparent_70%)] animate-pulse" />
      
      {/* 1. HEADER */}
      <header className="relative z-50 flex justify-between items-start mb-12">
        <div className="flex flex-col gap-2">
          <img src="/logo-full.png" alt="AetherStack" className="h-10 w-auto filter drop-shadow-[0_0_10px_rgba(0,210,255,0.3)]" />
          <div className="flex gap-4">
             <div className="text-[8px] font-black text-cyan-500 tracking-[0.3em] uppercase">Sovereign_Production_Live</div>
          </div>
        </div>
        <FounderProfile />
      </header>

      {/* 2. THE APERTURE (COMMAND CENTER) */}
      <main className="relative z-50 max-w-5xl mx-auto mt-20">
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[40px] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-6">
            <span className="text-cyan-500 text-5xl font-black italic">λ</span>
            <input 
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              autoFocus
              placeholder={isThinking ? "REASONING..." : "ENTER MASTER DIRECTIVE..."}
              className="flex-1 bg-transparent border-none outline-none text-3xl font-black tracking-tighter placeholder:text-zinc-800 text-white caret-cyan-500"
            />
          </div>

          {/* SWARM TRACE */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {swarm.length > 0 ? swarm.map((s: any, i: number) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-700 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[8px] text-cyan-500 font-black mb-2 uppercase tracking-widest">{s.agent}</div>
                <div className="text-[10px] text-zinc-400 leading-relaxed italic">"{s.msg}"</div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-10 opacity-10">
                <p className="text-[10px] tracking-[1em] uppercase">Awaiting Neural Link</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. SIDEBAR DATA (PULSE) */}
      <aside className="fixed bottom-12 left-12 z-50 max-w-xs w-full opacity-40 hover:opacity-100 transition-opacity">
        <h3 className="text-[8px] text-zinc-500 uppercase tracking-widest mb-4">Forensic History</h3>
        <div className="space-y-2 h-40 overflow-y-auto pr-4">
          {logs.map((log: any, i: number) => (
            <div key={i} className="flex justify-between text-[9px] border-b border-white/5 pb-2">
              <span className="text-emerald-500">{log.a}</span>
              <span className="text-zinc-700">{log.ts?.substring(11,19)}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* 4. THE EVANGELIST (SELF-ADVERTISING AGENT) */}
      <NeuralEvangelist />
    </div>
  );
}