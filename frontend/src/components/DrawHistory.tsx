import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';

const DrawHistory = () => {
  const { fetchState } = useContract();
  const [history, setHistory] = useState<any[]>([]);

  const updateHistory = async () => {
    const data = await fetchState('get_history');
    if (data) {
      setHistory(data.reverse().slice(0, 5));
    }
  };

  useEffect(() => {
    updateHistory();
    const interval = setInterval(updateHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <h3 className="text-3xl font-black text-white leading-tight">Winners Circle</h3>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mt-2">Verified Ledger Historical Events</p>
        </div>
        <div className="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-lg border border-indigo-500/20 text-xs font-black">
          {history.length} COMPLETE ROUNDS
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {history.length > 0 ? (
          history.map((record, idx) => (
            <div key={idx} className="group flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800 transition-all duration-300">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-full border-2 border-slate-700 flex items-center justify-center text-indigo-400 font-black italic">
                  #{record.round_id}
                </div>
                <div>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/account/${record.winner}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-indigo-400 font-black hover:text-indigo-300 transition-colors text-sm"
                  >
                    {truncate(record.winner)}
                  </a>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mt-1">Final Transaction Winner</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto border-t md:border-none border-slate-700/50 pt-4 md:pt-0">
                <div className="text-right">
                  <span className="block text-xl font-black text-white">{Number(record.amount / 10_000_000).toLocaleString()} XLM</span>
                  <span className="text-[10px] text-green-500 font-black uppercase">Prize Distributed</span>
                </div>
                <a 
                  href={`https://stellar.expert/explorer/testnet/tx/${record.tx_hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-slate-400 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                  title="Verify on Explorer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-slate-600 font-black italic tracking-widest border-2 border-dashed border-slate-800 rounded-3xl">
            Awaiting Genesis Round Winner Election...
          </div>
        )}
      </div>

      <div className="text-center pt-4">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
          All prize payouts are enforced by on-chain automated draw rules
        </p>
      </div>
    </div>
  );
};

export default DrawHistory;
