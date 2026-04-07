import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { useFreighter } from '../hooks/useFreighter';
import { Address, scValToNative } from '@stellar/stellar-sdk';

const MyTicketsDashboard = () => {
  const { fetchState } = useContract();
  const { publicKey } = useFreighter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({ spent: 0, entries: 0, wins: 0 });

  const fetchTickets = async () => {
    if (!publicKey) return;
    const userStats = await fetchState('get_user_stats', [Address.fromString(publicKey)]);
    if (userStats) {
      setStats({
        entries: userStats[0],
        spent: userStats[0] * 5, // Simple calc for this demo
        wins: userStats[2] > 0 ? 1 : 0
      });
    }

    // Mock ticket IDs from round IDs and user address for dashboard display
    const mockTickets = [];
    for (let i = 1; i <= userStats?.[0] || 0; i++) {
      mockTickets.push({
        id: `T-${1000 + i}`,
        round: Math.ceil(i / 5),
        status: 'Active',
        result: 'Pending'
      });
    }
    setTickets(mockTickets);
  };

  useEffect(() => {
    fetchTickets();
  }, [publicKey]);

  const exportCSV = () => {
    const headers = ['Ticket ID', 'Round', 'Status', 'Result'];
    const rows = tickets.map(t => [t.id, t.round, t.status, t.result].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tickets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!publicKey) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-6">
        <h3 className="text-3xl font-black text-white">Tickets Dashboard</h3>
        <p className="text-slate-500 font-semibold">Connect your Stellar wallet to view your entry history and download your tickets.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl -mr-32 -mt-32" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 border-b border-slate-800 pb-8">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tight">Access Your Portfolio</h3>
          <p className="text-slate-500 font-black text-xs uppercase tracking-widest mt-1">Real-time On-chain Activity</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-3 bg-slate-800 border border-slate-700 px-6 py-3 rounded-xl text-white font-bold text-sm tracking-tight hover:bg-slate-700 transition-all transform active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV Records
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
          { label: 'XLM INVESTED', val: `${stats.spent.toFixed(2)}`, color: 'text-indigo-400' },
          { label: 'ROUNDS ENTERED', val: stats.entries, color: 'text-purple-400' },
          { label: 'CONFIRMED WINS', val: stats.wins, color: 'text-green-400' }
        ].map(stat => (
          <div key={stat.label} className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl shadow-inner group hover:border-slate-700 transition-all">
            <span className="text-[10px] text-slate-500 font-bold tracking-widest block mb-2">{stat.label}</span>
            <span className={`text-3xl font-black ${stat.color} group-hover:scale-110 transition-transform inline-block`}>{stat.val}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto relative z-10 border border-slate-800 rounded-2xl bg-slate-900/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/20 text-[10px] text-slate-500 font-black uppercase tracking-widest">
              <th className="py-5 px-6">Ticket ID</th>
              <th className="py-5 px-6">Round</th>
              <th className="py-5 px-6 text-center">Status</th>
              <th className="py-5 px-6 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {tickets.length > 0 ? (
              tickets.slice(0, 5).map((t, idx) => (
                <tr key={idx} className="group hover:bg-slate-800/30 transition-all">
                  <td className="py-5 px-6 text-indigo-400 font-mono font-black text-sm">{t.id}</td>
                  <td className="py-5 px-6 text-white font-bold text-sm">Round #{t.round}</td>
                  <td className="py-5 px-6 text-center text-xs font-black">
                    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">{t.status}</span>
                  </td>
                  <td className="py-5 px-6 text-right text-slate-500 font-bold text-xs uppercase italic tracking-widest">{t.result}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center text-slate-600 font-black italic tracking-widest">
                  NO TICKETS FOUND FOR THIS ACCOUNT
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTicketsDashboard;
