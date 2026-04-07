import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';

const CountdownTimer = () => {
  const { fetchState } = useContract();
  const [deadline, setDeadline] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number }>({ d: 0, h: 0, m: 0, s: 0 });
  const [isDrawInProgress, setIsDrawInProgress] = useState(false);

  const fetchDeadline = async () => {
    const info = await fetchState('get_raffle_info');
    if (info) {
      setDeadline(Number(info[3]));
    }
  };

  useEffect(() => {
    fetchDeadline();
    const interval = setInterval(fetchDeadline, 30000); // Check for new round every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = deadline - now;

      if (diff <= 0) {
        setIsDrawInProgress(true);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      } else {
        setIsDrawInProgress(false);
        const d = Math.floor(diff / (3600 * 24));
        const h = Math.floor((diff % (3600 * 24)) / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setTimeLeft({ d, h, m, s });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
      <div className="text-center">
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">Round Countdown</p>
        
        {isDrawInProgress ? (
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 border-r-2" />
            <p className="text-xl font-bold text-indigo-400 animate-pulse">Draw in progress...</p>
            <p className="text-xs text-slate-500">Wait for winner transaction confirmation</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {[
              { val: timeLeft.d, label: 'Days' },
              { val: timeLeft.h, label: 'Hours' },
              { val: timeLeft.m, label: 'Min' },
              { val: timeLeft.s, label: 'Sec' }
            ].map(({ val, label }) => (
              <div key={label} className="bg-slate-800 rounded-2xl p-4 border border-slate-700/50">
                <span className="block text-3xl font-black text-white">{String(val).padStart(2, '0')}</span>
                <span className="text-[10px] text-indigo-400 uppercase font-black">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
