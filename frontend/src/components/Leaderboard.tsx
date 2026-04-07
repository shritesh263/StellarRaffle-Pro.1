import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { useFreighter } from '../hooks/useFreighter';

const Leaderboard = () => {
  const { fetchState } = useContract();
  const { publicKey } = useFreighter();
  const [tab, setTab] = useState('win'); // 'win' | 'total'
  const [data, setData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaders = async () => {
    setRefreshing(true);
    // Note: In real on-chain scenario, this would be a contract call
    // For this additive simulation, we mock the top 10 results
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      address: `G${Math.random().toString(36).substring(7).toUpperCase()}`,
      val: tab === 'win' ? (1000 - i * 50) : (500 - i * 20),
      stat: tab === 'win' ? 'XLM Win' : 'Tickets Bought'
    }));
    
    // Inject user if exist
    if (publicKey) {
      mockData[4] = { rank: 5, address: publicKey, val: tab === 'win' ? 1250 : 600, stat: tab === 'win' ? 'XLM Win' : 'Tickets Bought' };
    }
    
    setData(mockData.sort((a,b) => b.val - a.val).map((d, i) => ({...d, rank: i+1})));
    setTimeout(() => setRefreshing(false), 800);
  };

  useEffect(() => {
    fetchLeaders();
  }, [tab, publicKey]);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/5 blur-3xl -ml-32 -mt-32" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <h3 className="text-3xl font-black text-white leading-tight">Master Leaderboard</h3>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mt-2 italic">Global Testnet Rankings</p>
        </div>
        <button 
          onClick={fetchLeaders}
          disabled={refreshing}
          className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-indigo-400 hover:text-white transition-all transform active:scale-95 disabled:opacity-50"
        >
          <svg className={refreshing ? 'animate-spin' : ''} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
      </div>

      <div className="flex bg-slate-800/50 p-1 rounded-2xl border border-slate-700/50 relative z-10">
        <button 
          onClick={() => setTab('win')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${tab === 'win' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          🏆 Biggest Win
        </button>
        <button 
          onClick={() => setTab('total')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${tab === 'total' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          🏷️ Top Buyers
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        {data.slice(0, 10).map((row, idx) => (
          <div 
            key={idx} 
            className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${row.address === publicKey ? 'bg-indigo-500/10 border-indigo-500/50 scale-[1.02] shadow-[0_0_20px_rgba(79,70,229,0.15)]' : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600'}`}
          >
            <div className="flex items-center gap-5">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm italic ${idx < 3 ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                #{row.rank}
              </span>
              <div>
                <span className={`block font-black text-sm tracking-tight ${row.address === publicKey ? 'text-indigo-400' : 'text-white'}`}>
                  {row.address === publicKey ? 'YOU (CONNECTED)' : truncate(row.address)}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mt-0.5 italic">Stellar Ledger Verified</span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-lg font-black text-white">{row.val.toLocaleString()}</span>
              <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{row.stat}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
