"use client"
import { useEffect, useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSovereignVoice } from '../hooks/useSovereignVoice';

export default function TerminalCore() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [input, setInput] = useState('');
  const [swarm, setSwarm] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speak } = useSovereignVoice();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    init();
    // Force focus every second to ensure you can always write
    const focusInterval = setInterval(() => inputRef.current?.focus(), 1000);
    return () => clearInterval(focusInterval);
  }, []);

  const handleCommand = async (e: any) => {
    if (e.key !== 'Enter' || !input) return;
    const cmd = input; setInput(''); setIsThinking(true);
    speak("Logic acknowledged.");
    
    try {
      const res = await fetch('/api/alpha/command', {
        method: 'POST',
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      setSwarm(prev => [{ agent: "ALPHA", msg: data.output }, ...prev].slice(0, 10));
    } catch (err) { 
      setSwarm(prev => [{ agent: "SYSTEM", msg: "LINK_ERROR" }, ...prev]);
    }
    setIsThinking(false);
  };

  if (!user) return <div className="bg-black min-h-screen" />;

  return (
    <div 
      className="min-h-screen bg-black text-white font-mono p-10 flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      {/* BACKGROUND DECORATION (Non-blocking) */}
      <div className="fixed inset-0 opacity-5 pointer-events-none bg-[url('/logo-full.png')] bg-no-repeat bg-center bg-contain" />

      {/* TOP STATUS BAR */}
      <div className="flex justify-between text-[10px] text-zinc-500 tracking-[0.4em] mb-20">
        <span>AETHERSTACK_AI_V∞</span>
        <span>FOUNDER_LOGGED_IN: {user.email}</span>
        <span className="text-cyan-500 animate-pulse">● CORE_ONLINE</span>
      </div>

      {/* THE INPUT APERTURE (FULL WIDTH / LARGE) */}
      <div className="relative z-10 flex-grow flex flex-col justify-start">
        <div className="flex items-center gap-6 group">
          <span className="text-cyan-500 text-6xl font-black italic">λ</span>
          <input 
            ref={inputRef}
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={handleCommand}
            autoFocus
            autoComplete="off"
            placeholder={isThinking ? "REASONING..." : "ENTER_DIRECTIVE_"}
            className="flex-1 bg-transparent border-none outline-none text-5xl font-black tracking-tighter placeholder:text-zinc-900 text-white caret-cyan-500"
          />
        </div>

        {/* SWARM OUTPUT (Scrolls underneath) */}
        <div className="mt-20 space-y-6 max-w-3xl">
          {swarm.map((s: any, i: number) => (
            <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-500 border-l-2 border-white/5 pl-6">
              <div className="text-[10px] text-cyan-500 font-black mb-1 uppercase tracking-widest">{s.agent}</div>
              <div className="text-lg text-zinc-400 font-bold leading-tight">{s.msg}</div>
            </div>
          ))}
          {swarm.length === 0 && (
             <div className="opacity-20 text-xs tracking-widest">NO_ACTIVE_DIRECTIVES</div>
          )}
        </div>
      </div>
    </div>
  );
}