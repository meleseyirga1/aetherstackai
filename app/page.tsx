"use client"
import { useEffect, useState } from 'react';
import FounderProfile from '../components/interface/FounderProfile';
import { useSovereignVoice } from '../hooks/useSovereignVoice';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeData, setActiveData] = useState(null);
  const { speak } = useSovereignVoice();

  // 🛡️ REFINED HYDRATION LOGIC
  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const res = await fetch('/api/governance/logs');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (e) {}
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div style={{ background: 'black', minHeight: '100vh' }} />;

  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '60px', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
        <div>
           <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', margin: 0 }}>AETHERSTACK<span style={{color:'#00d2ff'}}>AI</span></h1>
           <p style={{ color: '#00ffcc', fontSize: '10px' }}>● SOVEREIGN_PRODUCTION_LIVE</p>
        </div>
        <FounderProfile />
      </div>

      <div style={{ background: '#050505', border: '1px solid #111', borderRadius: '25px', padding: '40px', textAlign: 'center' }}>
         <p style={{ color: '#444', fontSize: '12px' }}>THE EMPIRE IS ONLINE. AWAITING FOUNDER COMMANDS.</p>
      </div>
    </div>
  );
}