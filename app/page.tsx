"use client"
import { useEffect, useState } from 'react';
import { useSovereignVoice } from '../hooks/useSovereignVoice';
import { BookOpen, TrendingUp, Search } from 'lucide-react';

export default function Dashboard() {
  const [intel, setIntel] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const { speak } = useSovereignVoice();

  const runAnalysis = async () => {
    setIsScanning(true);
    speak("Analyst Agent awakened. Scanning global intelligence signals.");
    
    // Call the Alpha Core which now routes to the Analyst
    const res = await fetch('/api/alpha/command', { 
        method: 'POST', 
        body: JSON.stringify({ command: "run intelligence report" }) 
    });
    const data = await res.json();
    
    // If the Analyst returned data, display it
    setIntel(data.intel_report || null);
    setIsScanning(false);
    speak("Research finalized. Institutional report ready for review.");
  };

  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '60px', fontFamily: 'monospace' }}>
      
      {/* 1. HEADER */}
      <header className="flex justify-between items-center border-b border-white/10 pb-8 mb-12">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">AetherStack<span className="text-cyan-500">AI</span></h1>
        <button 
          onClick={runAnalysis}
          disabled={isScanning}
          className="px-6 py-2 bg-white text-black font-black rounded-full hover:bg-cyan-500 transition-all flex items-center gap-2"
        >
          <Search size={14} />
          {isScanning ? "RESEARCHING..." : "ACTIVATE ANALYST"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 2. INTELLIGENCE REPORT PANEL */}
        <div className="bg-[#050505] border border-white/5 rounded-3xl p-10 backdrop-blur-3xl min-h-[400px]">
           <div className="flex items-center gap-3 mb-8">
              <BookOpen size={20} className="text-purple-500" />
              <h3 className="text-[10px] font-black text-purple-500 tracking-[0.4em] uppercase">Market Intelligence Report</h3>
           </div>

           {intel ? (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="mb-6 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                   <p className="text-[8px] text-purple-400 font-bold uppercase mb-1">Strategic Focus</p>
                   <p className="text-lg font-bold text-white tracking-tight">{intel.focus}</p>
                </div>
                <ul className="space-y-4">
                   {intel.findings.map((f, i) => (
                     <li key={i} className="flex gap-4 text-xs text-zinc-400 leading-relaxed">
                        <TrendingUp size={14} className="text-zinc-700 shrink-0" />
                        {f}
                     </li>
                   ))}
                </ul>
             </div>
           ) : (
             <div className="h-64 flex items-center justify-center border border-dashed border-white/5 rounded-2xl text-zinc-800 text-[10px] uppercase tracking-widest">
                Awaiting Analyst Pulse...
             </div>
           )}
        </div>

        {/* 3. TERMINAL LOGS (Same as before) */}
        <div className="opacity-20 hover:opacity-100 transition-opacity">
           {/* Terminal contents... */}
        </div>
      </div>
    </div>
  );
}