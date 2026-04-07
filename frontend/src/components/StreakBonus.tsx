import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { useFreighter } from '../hooks/useFreighter';
import { Address } from '@stellar/stellar-sdk';

const StreakBonus = () => {
  const { fetchState } = useContract();
  const { publicKey } = useFreighter();
  const [streak, setStreak] = useState(0);

  const fetchStreak = async () => {
    if (!publicKey) return;
    const stats = await fetchState('get_user_stats', [Address.fromString(publicKey)]);
    if (stats) {
      setStreak(stats[1]); // Mock streak from contract state
    }
  };

  useEffect(() => {
    fetchStreak();
  }, [publicKey]);

  if (!publicKey || streak < 1) return null;

  return (
    <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(79,70,229,0.2)] animate-pulse relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-all duration-500" />
      
      <div className="flex items-center gap-6 relative z-10">
        <div className="text-5xl drop-shadow-[0_0_15px_rgba(255,165,0,0.5)] transform hover:scale-125 transition-transform cursor-default">
          🔥
        </div>
        <div>
          <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">
            {streak} ROUND STREAK!
          </h4>
          <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest mt-1">
            {streak >= 5 ? "BONUS TICKET EARNED!" : `${5 - (streak % 5)} rounds to next bonus`}
          </p>
        </div>
      </div>
      
      <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-600 to-yellow-400 transition-all duration-1000"
          style={{ width: `${(streak % 5) * 20}%` }}
        />
      </div>
    </div>
  );
};

export default StreakBonus;
