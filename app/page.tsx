"use client"
import { useEffect, useState, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Terminal, ShieldCheck, Activity, Cpu, Globe } from 'lucide-react';
import FounderProfile from '../components/interface/FounderProfile';
import { useSovereignVoice } from '../hooks/useSovereignVoice';

export default function MasterDashboard() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [input, setInput] = useState('');
  const [swarm, setSwarm] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const { speak } = useSovereignVoice();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchLedger();
      }
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
    setSwarm([{ agent: "SENTINEL", msg: "Authenticating intent..." }]);
    
    try {
      const res = await fetch('/api/alpha/command', {
        method: 'POST',
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      setSwarm(data.swarm || []);
      speak(data.output || "Operational.");
    } catch (err) {
      setSwarm([{ agent: "ERROR", msg: "Neural Link Stalled." }]);
    }
    setIsThinking(false);
    fetchLedger();
  };

  if (!user) return <div className="bg-black min-h-screen" />;

  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'monospace', overflowX: 'hidden' }}>
      
      {/* 1. INSTITUTIONAL HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', borderBottom: '1px solid #111', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>AETHERSTACK<span style={{color: '#00d2ff'}}>AI</span></h1>
          <p style={{ color: '#00ffcc', fontSize: '9px', marginTop: '5px' }}>● SOVEREIGN_PRODUCTION_LIVE // {user.email}</p>
        </div>
        <FounderProfile />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* 2. THE λ COMMAND TERMINAL (RESTORED & PROMINENT) */}
        <div style={{ background: '#080808', border: '1px solid #1a1a1a', borderRadius: '20px', padding: '40px', marginBottom: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: '#00d2ff', fontSize: '24px', fontWeight: 'bold' }}>λ</span>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={handleCommand}
              placeholder={isThinking ? "REASONING..." : "ENTER MASTER DIRECTIVE..."}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '18px', caretColor: '#00d2ff' }}
              autoFocus
            />
          </div>
          
          {/* Swarm Trace */}
          <div style={{ marginTop: '25px', spaceY: '5px' }}>
            {swarm.map((s: any, i: number) => (
              <div key={i} className="animate-in fade-in slide-in-from-left-2" style={{ fontSize: '11px', color: '#555' }}>
                <span style={{ color: '#00d2ff', fontWeight: 'bold' }}>[{s.agent}]</span> {s.msg}
              </div>
            ))}
          </div>
        </div>

        {/* 3. DUAL-PANEL DATA HUB */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          {/* LEDGER */}
          <div style={{ background: '#050505', border: '1px solid #111', borderRadius: '20px', padding: '25px', height: '450px', overflowY: 'auto' }}>
            <h3 style={{ color: '#222', fontSize: '9px', textTransform: 'uppercase', tracking: '0.4em', marginBottom: '20px' }}>Forensic Hyper-Ledger</h3>
            {logs.map((log: any, i: number) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid #111', opacity: i === 0 ? 1 : 0.3, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: '#00ffcc', fontWeight: 'bold' }}>{log.a}</span>
                <span style={{ fontSize: '10px', color: '#333' }}>{log.ts?.substring(11,19)}</span>
              </div>
            ))}
          </div>

          {/* SYSTEM STATUS (3D Placeholder) */}
          <div style={{ background: '#050505', border: '1px solid #111', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
             <Activity className="text-cyan-500/10" size={120} />
             <div style={{ position: 'absolute', bottom: '20px', fontSize: '8px', color: '#222' }}>PLANETARY_MESH_SYNC: 1.000</div>
          </div>

        </div>
      </div>
    </div>
  );
}