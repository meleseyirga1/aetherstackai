"use client"
import { useEffect, useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import FounderProfile from '../components/interface/FounderProfile';
import { useSovereignVoice } from '../hooks/useSovereignVoice';

export default function MasterDashboard() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [input, setInput] = useState('');
  const [swarm, setSwarm] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speak } = useSovereignVoice();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) { setUser(session.user); fetchLedger(); }
    };
    checkAuth();
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
    
    try {
      const res = await fetch('/api/alpha/command', {
        method: 'POST',
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      setSwarm(data.swarm || []);
      speak(data.output || "Operational.");
    } catch (err) {
      console.error("Link Stalled.");
    }
    setIsThinking(false);
    fetchLedger();
  };

  // Force focus back to terminal if user clicks the screen
  const handleScreenClick = () => {
    inputRef.current?.focus();
  };

  if (!user) return <div className="bg-black min-h-screen" />;

  return (
    <div onClick={handleScreenClick} style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'monospace', overflowX: 'hidden' }}>
      
      {/* 1. MINIMAL HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', opacity: 0.8 }}>
        <img src="/logo-full.png" alt="AetherStack" style={{ height: '30px' }} />
        <FounderProfile />
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* 2. THE APERTURE (THE ONLY INTERACTIVE BOX) */}
        <div style={{ position: 'relative', background: '#050505', border: '2px solid #00d2ff', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 0 40px rgba(0,210,255,0.1)' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: '#00d2ff', fontSize: '30px', fontWeight: 'bold' }}>λ</span>
            <input 
              ref={inputRef}
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={handleCommand}
              placeholder={isThinking ? "REASONING..." : "TYPE MASTER DIRECTIVE..."}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                outline: 'none', 
                color: 'white', 
                width: '100%', 
                fontSize: '24px', 
                caretColor: '#00d2ff',
                fontWeight: 'bold' 
              }}
              autoFocus
            />
          </div>
          
          {/* Active Swarm Dialogue */}
          <div style={{ marginTop: '30px', minHeight: '60px' }}>
            {swarm.map((s: any, i: number) => (
              <div key={i} className="animate-in fade-in slide-in-from-left-2" style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                <span style={{ color: '#00d2ff', fontWeight: 'bold' }}>[{s.agent}]</span> {s.msg}
              </div>
            ))}
          </div>
        </div>

        {/* 3. FORENSIC DATA HUB (Below) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div style={{ background: '#080808', border: '1px solid #111', borderRadius: '20px', padding: '20px', height: '300px', overflowY: 'auto' }}>
            <h3 style={{ color: '#333', fontSize: '10px', textTransform: 'uppercase', marginBottom: '15px' }}>Audit Ledger</h3>
            {logs.map((log: any, i: number) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #111', opacity: i === 0 ? 1 : 0.3, display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: '#00ffcc' }}>{log.a}</span>
                <span style={{ color: '#222' }}>{log.ts?.substring(11,19)}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#080808', border: '1px solid #111', borderRadius: '20px', padding: '40px', textAlign: 'center', opacity: 0.1 }}>
             <p style={{ fontSize: '10px' }}>[PLANETARY_OS_v∞_CORE]</p>
          </div>
        </div>

      </div>
    </div>
  );
}