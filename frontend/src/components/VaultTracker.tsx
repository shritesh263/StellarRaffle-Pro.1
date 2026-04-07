import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';

const VaultTracker = () => {
  const { fetchState } = useContract();
  const [data, setData] = useState({ pool: 0, sold: 0, round: 0 });
  const [target] = useState(10000); // 10,000 XLM target for the progress bar

  const updateStats = async () => {
    const info = await fetchState('get_raffle_info');
    if (info) {
      setData({
        pool: Number(info[0]) / 10_000_000,
        sold: info[1],
        round: info[2]
      });
    }
  };

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.min(100, (data.pool / target) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Live Vault Status</h3>
          <p className="text-4xl font-black text-white">
            {data.pool.toLocaleString()} <span className="text-xl text-slate-500">XLM</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-indigo-500">Round #{data.round}</p>
          <p className="text-xs text-slate-400">{data.sold} Tickets Sold</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-slate-400">Vault Progress</span>
          <span className="text-indigo-400">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default VaultTracker;
