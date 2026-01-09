"use client"
import { useEffect, useState } from 'react';
import { useSovereignVoice } from '../hooks/useSovereignVoice';

export default function ApexDashboard() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const [vpsStatus, setVpsStatus] = useState("LINKING...");
  const { speak } = useSovereignVoice();

  useEffect(() => {
    setMounted(true);
    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/governance/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
        setVpsStatus("CONNECTED");
      } else {
        setVpsStatus("OFFLINE");
      }
    } catch (e) {
      setVpsStatus("LINK_STALLED");
    }
  };

  const handleCommand = async (e: any) => {
    if (e.key !== 'Enter' || !input) return;
    const cmd = input; setInput('');
    speak("Master Proxy relay initiated.");
    
    await fetch('/api/alpha/command', {
      method: 'POST',
      body: JSON.stringify({ command: cmd })
    });
    fetchData();
  };

  if (!mounted) return <div style={{ background: 'black', minHeight: '100vh' }} />;

  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '60px', fontFamily: 'monospace', overflowX: 'hidden' }}>
      
      {/* 1. HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '20px', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>AETHERSTACK<span style={{color:'#00d2ff'}}>AI</span></h1>
          <p style={{ color: '#444', fontSize: '10px' }}>v∞ // SOVEREIGN_REBOOT_MODE</p>
        </div>
        <div style={{ color: vpsStatus === "CONNECTED" ? "#00ffcc" : "#ff9900", fontSize: '10px' }}>
            ● CORE_BRAIN: {vpsStatus}
        </div>
      </div>

      {/* 2. COMMAND TERMINAL */}
      <div style={{ background: '#080808', border: '1px solid #111', borderRadius: '15px', padding: '30px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ color: '#00d2ff', fontSize: '20px' }}>λ</span>
          <input 
            value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand}
            placeholder="ISSUE MASTER DIRECTIVE..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '16px' }}
            autoFocus
          />
        </div>
      </div>

      {/* 3. LEDGER */}
      <h3 style={{ color: '#222', fontSize: '9px', textTransform: 'uppercase', tracking: '0.3em', marginBottom: '15px' }}>Institutional Ledger</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {logs.map((log: any, i: number) => (
          <div key={i} style={{ padding: '15px', background: '#050505', borderLeft: '2px solid #00d2ff', opacity: i === 0 ? 1 : 0.2, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '10px', color: '#00ffcc' }}>{log.a}</div>
            <div style={{ fontSize: '10px', color: '#444' }}>{log.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}