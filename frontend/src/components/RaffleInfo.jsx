import React, { useState, useEffect, useCallback } from 'react';
import { rpc, Contract, scValToNative } from '@stellar/stellar-sdk';

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || "CCAWDG6Z66B66B66B66B66B66B66B66B66B66B66B66B66B66B66B66B"; 
const RPC_URL = import.meta.env.VITE_RPC_URL || "https://soroban-testnet.stellar.org:443";

const rpcServer = new rpc.Server(RPC_URL);

const RaffleInfo = ({ refreshTrigger, setHistory }) => {
  const [data, setData] = useState({ pool: '0', participants: 0, deadline: 0, vault: '0' });
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const isDemo = CONTRACT_ID.startsWith("CCAW");

  const fetchContractData = useCallback(async () => {
    if (isDemo) {
      // Demo mode: show premium sample data
      setData({ 
        pool: '4,850.00', 
        participants: 124, 
        deadline: Math.floor(Date.now() / 1000) + 3600, 
        vault: '242.50' 
      });
      setHistory([
        { winner: 'GD7H...5XJ3V', amount: 8400000000, timestamp: Math.floor(Date.now() / 1000) - 3600 },
        { winner: 'GA9K...P92L', amount: 32000000000, timestamp: Math.floor(Date.now() / 1000) - 7200 },
      ]);
      return;
    }

    setLoading(true);
    try {
      const contract = new Contract(CONTRACT_ID);
      
      // Simulate Info call
      const infoTx = contract.call("get_raffle_info");
      const simResult = await rpcServer.simulateTransaction(infoTx);

      if (simResult.result) {
        const [poolStroops, participantCount, deadline, vaultStroops] = scValToNative(simResult.result.retval);
        const xlm = (n) => (Number(n) / 10_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        setData({
          pool: xlm(poolStroops),
          participants: Number(participantCount),
          deadline: Number(deadline),
          vault: xlm(vaultStroops),
        });
      }

      // Simulate History call
      const historyTx = contract.call("get_winner_history");
      const histSimResult = await rpcServer.simulateTransaction(historyTx);
      if (histSimResult.result) {
        setHistory(scValToNative(histSimResult.result.retval));
      }
    } catch (e) {
      console.error("RPC Error:", e);
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger, isDemo, setHistory]);

  useEffect(() => {
    fetchContractData();
    const interval = setInterval(fetchContractData, 20_000);
    return () => clearInterval(interval);
  }, [fetchContractData]);

  useEffect(() => {
    if (!data.deadline) return;
    const tick = () => {
      const diff = data.deadline - Math.floor(Date.now() / 1000);
      if (diff <= 0) {
        setTimeLeft('PROCESSING DRAW...');
        return;
      }
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      
      if (diff < 60) {
         setTimeLeft(`${s} SECONDS LEFT`);
      } else {
         setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [data.deadline]);

  return (
    <div className="glass-panel stat-card animate-in" style={{ background: 'linear-gradient(180deg, white 0%, hsla(243, 75%, 59%, 0.02) 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="stat-label">
           <div className="live-indicator" />
           Next Jackpot
        </div>
        {loading && <span className="loader" style={{ width: '16px', height: '16px', borderTopColor: 'var(--primary)' }} />}
      </div>
      
      <div className="stat-value" style={{ fontSize: '3rem', fontWeight: 900 }}>
        {data.pool} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>XLM</span>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem', background: 'white', border: 'none', boxShadow: 'none' }}>
           <div className="stat-label" style={{ fontSize: '0.7rem' }}>Entries</div>
           <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{data.participants.toLocaleString()}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem', background: 'white', border: 'none', boxShadow: 'none' }}>
           <div className="stat-label" style={{ fontSize: '0.7rem' }}>Draw Countdown</div>
           <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'monospace' }}>
             {timeLeft || '—'}
           </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        borderRadius: '16px', 
        background: 'hsla(215, 16%, 47%, 0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>VAULT BALANCE</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>{data.vault} XLM</span>
      </div>
    </div>
  );
};

export default RaffleInfo;
