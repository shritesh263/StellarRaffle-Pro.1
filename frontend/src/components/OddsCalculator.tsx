import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { useFreighter } from '../hooks/useFreighter';
import { Address } from '@stellar/stellar-sdk';

const OddsCalculator = () => {
  const { fetchState } = useContract();
  const { publicKey } = useFreighter();
  const [stats, setStats] = useState({ user: 0, total: 0 });

  const updateOdds = async () => {
    const info = await fetchState('get_raffle_info');
    let userTickets = 0;
    if (publicKey) {
      const userStats = await fetchState('get_user_stats', [Address.fromString(publicKey)]);
      userTickets = userStats ? userStats[0] : 0;
    }

    if (info) {
      setStats({
        user: userTickets,
        total: info[1]
      });
    }
  };

  useEffect(() => {
    updateOdds();
    const interval = setInterval(updateOdds, 15000);
    return () => clearInterval(interval);
  }, [publicKey]);

  const odds = stats.total > 0 ? (stats.user / stats.total) * 100 : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/20 transition-all duration-500" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <h3 className="text-xl font-bold text-white">Winning Odds</h3>
        </div>

        <div className="flex flex-col items-center justify-center py-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            {publicKey ? odds.toFixed(2) : "0.00"}%
          </span>
          <p className="border-t border-slate-700 mt-4 pt-4 text-slate-400 text-sm font-semibold italic">
            {publicKey ? (
              <>You own <span className="text-indigo-400 font-black">{stats.user}</span> of <span className="text-purple-400 font-black">{stats.total}</span> tickets</>
            ) : (
              "Connect wallet to calculate"
            )}
          </p>
        </div>

        <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-black">
          Real-time probability analysis on-chain
        </p>
      </div>
    </div>
  );
};

export default OddsCalculator;
