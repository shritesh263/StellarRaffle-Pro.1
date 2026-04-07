import React from 'react';
import VaultTracker from './VaultTracker';
import CountdownTimer from './CountdownTimer';
import OddsCalculator from './OddsCalculator';
import MultiTicketPurchase from './MultiTicketPurchase';
import MyTicketsDashboard from './MyTicketsDashboard';
import DrawHistory from './DrawHistory';
import StreakBonus from './StreakBonus';
import Leaderboard from './Leaderboard';

const FeaturesDashboard = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 p-6 md:p-12 font-sans space-y-12">
      <header className="max-w-7xl mx-auto space-y-4">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
          RAFFLE <span className="text-indigo-500">PRO</span> EXPANSION
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs">
          Additive Soroban Features • High Fidelity Tier
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Row 1: Primary Stats */}
        <div className="md:col-span-8 flex flex-col gap-8">
          <VaultTracker />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <CountdownTimer />
             <OddsCalculator />
          </div>
        </div>

        <div className="md:col-span-4 space-y-8">
          <StreakBonus />
          <MultiTicketPurchase />
        </div>

        {/* Row 2: History and Dashboards */}
        <div className="md:col-span-12 grid grid-cols-1 xl:grid-cols-2 gap-8">
          <MyTicketsDashboard />
          <DrawHistory />
        </div>

        {/* Row 3: Social & Global Stats */}
        <div className="md:col-span-12">
           <Leaderboard />
        </div>
      </main>

      <footer className="max-w-7xl mx-auto pt-12 border-t border-slate-800 text-center">
        <p className="text-slate-600 font-black text-xs uppercase tracking-widest">
          Stellar Soroban Development Kit • Verified On-Chain
        </p>
      </footer>
    </div>
  );
};

export default FeaturesDashboard;
