"use client"
import { useEffect, useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function MasterDashboard() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([]);
  const [swarm, setSwarm] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    fetchLedger();
    const i = setInterval(fetchLedger, 5000);
    return () => clearInterval(i);
  }, []);

  const fetchLedger = async () => {
    try {
      const res = await fetch('/api/governance/logs');
      if (res.ok) setLogs(await res.json());
    } catch (e) {}
  };

  const handleCommand = async (e) => {
    if (e.key !== 'Enter' || !input) return;
    const cmd = input; setInput('');
    setSwarm(prev => [...prev, { agent: "SENTINEL", msg: "Authenticating..." }]);
    
    const res = await fetch('/api/alpha/command', {
      method: 'POST',
      body: JSON.stringify({ command: cmd })
    });
    const data = await res.json();
    setSwarm(data.swarm || []);
    fetchLedger();
  };

  if (!mounted) return null;

  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
      <div style={{ borderBottom: '1px solid #222', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '2px' }}>AETHERSTACK<span style={{color: '#00d2ff'}}>AI</span></h1>
        <div style={{ color: '#00ffcc', fontSize: '10px' }}>● PRODUCTION_OS_ACTIVE</div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* λ TERMINAL - PRIMARY APERTURE */}
        <div style={{ background: '#080808', border: '2px solid #00d2ff', borderRadius: '15px', padding: '35px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: '#00d2ff', fontSize: '24px' }}>λ</span>
            <input 
              ref={inputRef}
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={handleCommand}
              placeholder="ISSUE MASTER DIRECTIVE..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '20px' }}
              autoFocus
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            {swarm.map((s, i) => (
              <div key={i} style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>
                <span style={{ color: '#00d2ff' }}>[{s.agent}]</span> {s.msg}
              </div>
            ))}
          </div>
        </div>

        {/* LOGS */}
        <h3 style={{ color: '#222', fontSize: '10px', textTransform: 'uppercase', marginBottom: '15px' }}>Forensic Ledger</h3>
        <div style={{ background: '#050505', border: '1px solid #111', borderRadius: '15px', padding: '20px', height: '300px', overflowY: 'auto' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', opacity: i === 0 ? 1 : 0.3 }}>
              <span style={{ color: '#00ffcc', fontSize: '10px' }}>{log.a}</span>
              <span style={{ color: '#333', fontSize: '10px' }}>{log.ts?.substring(11,19)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}