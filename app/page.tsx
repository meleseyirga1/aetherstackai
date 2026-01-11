"use client"
import { useEffect, useState } from 'react';

export default function SovereignDashboard() {
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 🔍 Institutional Diagnostic
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setError("IDENTITY_VAULT_DISCONNECTED: Missing Supabase Environment Variables in Vercel Settings.");
    }
  }, []);

  if (!mounted) return null;

  if (error) {
    return (
      <div style={{ background: 'black', color: '#ff4444', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: 'monospace', textAlign: 'center' }}>
        <div style={{ border: '1px solid #ff4444', padding: '40px', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '2px' }}>⚠️ CRITICAL_SYSTEM_ERROR</h2>
          <p style={{ fontSize: '10px', color: '#666', marginTop: '20px' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '30px', background: '#ff4444', color: 'black', border: 'none', padding: '10px 20px', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer' }}>RE-ATTEMPT HANDSHAKE</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '60px', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '900' }}>AETHERSTACK<span style={{color:'#00d2ff'}}>AI</span></h1>
      <p style={{ color: '#00ffcc', fontSize: '10px', marginTop: '10px' }}>● PORTAL_ACTIVE // SOVEREIGN_IDENTITY_VERIFIED</p>
      
      <div style={{ marginTop: '40px', padding: '40px', border: '1px dashed #222', borderRadius: '20px', textAlign: 'center' }}>
         <p style={{ color: '#444', fontSize: '12px' }}>THE EMPIRE IS ONLINE. AWAITING FOUNDER COMMANDS.</p>
      </div>
    </div>
  );
}