"use client"
import { useEffect, useState } from 'react';
import { useSovereignVoice } from '../hooks/useSovereignVoice';
import { BookOpen, TrendingUp, Search, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const [swarm, setSwarm] = useState([]);
  const [intel, setIntel] = useState(null);
  const { speak } = useSovereignVoice();

  const fetchData = async () => {
    const res = await fetch('/api/governance/logs');
    if (res.ok) setLogs(await res.json());
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, []);

  const handleCommand = async (e: any) => {
    if (e.key !== 'Enter' || !input) return;
    const cmd = input; setInput(''); setIntel(null);
    speak("Analyst Agent awakened. Scanning global signals.");

    const res = await fetch('/api/alpha/command', { method: 'POST', body: JSON.stringify({ command: cmd }) });
    const data = await res.json();
    
    if (data.swarm) setSwarm(data.swarm);
    if (data.intel) {
        setIntel(data.intel);
        speak("Institutional report ready for review.");
    }
    fetchData();
  };

  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '60px', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '40px' }}>AETHERSTACK<span style={{color:'#00d2ff'}}>AI</span></h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
        <div>
          {/* λ TERMINAL */}
          <div style={{ background: '#080808', border: '1px solid #111', borderRadius: '15px', padding: '30px', marginBottom: '30px' }}>
            <input 
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleCommand}
              placeholder="ISSUE ANALYTIC DIRECTIVE (e.g. > analyze market)"
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#00d2ff', width: '100%', fontSize: '14px' }}
            />
            <div style={{ marginTop: '20px' }}>
              {swarm.map((s: any, i: number) => (
                <div key={i} style={{ fontSize: '10px', color: '#444', marginBottom: '5px' }}>
                  <span style={{ color: '#00d2ff' }}>[{s.agent}]</span> {s.msg}
                </div>
              ))}
            </div>
          </div>

          {/* INTELLIGENCE REPORT WIDGET */}
          {intel && (
            <div className="animate-in slide-in-from-bottom-5 duration-700" style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)', padding: '30px', borderRadius: '20px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <BookOpen size={16} className="text-purple-500" />
                  <span style={{ color: '#a855f7', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>MARKET_INTELLIGENCE_REPORT</span>
               </div>
               <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>FOCUS: {intel.focus_area}</div>
               <div style={{ spaceY: '10px' }}>
                  {intel.intelligence_signals.map((signal: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#888', marginBottom: '10px' }}>
                       <TrendingUp size={12} className="text-zinc-700" /> {signal}
                    </div>
                  ))}
               </div>
               <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(0,210,255,0.05)', borderRadius: '10px', fontSize: '10px', color: '#00d2ff', fontStyle: 'italic' }}>
                  "Recommendation: {intel.recommendation}"
               </div>
            </div>
          )}
        </div>

        {/* LEDGER */}
        <div>
          <h3 style={{ color: '#222', fontSize: '10px', textTransform: 'uppercase', tracking: '0.3em', marginBottom: '20px' }}>Forensic Ledger</h3>
          {logs.slice(0, 8).map((log: any, i: number) => (
            <div key={i} style={{ padding: '15px', background: '#050505', borderLeft: '2px solid #00d2ff', marginBottom: '8px', opacity: i === 0 ? 1 : 0.3, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '10px', color: '#00ff00' }}>{log.a}</div>
              <div style={{ fontSize: '10px', color: '#333' }}>{log.ts?.substring(11,19)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}