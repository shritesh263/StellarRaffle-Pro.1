import React, { useState, useEffect, useCallback } from 'react';
import { rpc, Contract, scValToNative } from '@stellar/stellar-sdk';

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM"; 
const RPC_URL = import.meta.env.VITE_RPC_URL || "https://soroban-testnet.stellar.org:443";

const rpcServer = new rpc.Server(RPC_URL);

/**
 * RaffleInfo — Polls and displays live contract state:
 * prize pool, ticket count, countdown timer, and vault balance.
 * Auto-refreshes every 30 seconds and on external refreshTrigger.
 */
const RaffleInfo = ({ refreshTrigger, setHistory }) => {
  const [data, setData] = useState({ pool: '0', participants: 0, deadline: 0, vault: '0' });
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const isDemo = CONTRACT_ID.startsWith("CAA");

  const fetchContractData = useCallback(async () => {
    if (isDemo) {
      // Demo mode: show realistic sample data
      setData({ pool: '1,250', participants: 250, deadline: Math.floor(Date.now() / 1000) + 3600, vault: '62.5' });
      setHistory([
        { winner: 'GD7HJMM4GH3XKZPKJRCKMC5XJQN45XJ3V', amount: 8_400_000_000, timestamp: Math.floor(Date.now() / 1000) - 86400 },
        { winner: 'GA9KQVZX77JDWP5FE45MN2VVNF8P92L', amount: 32_000_000_000, timestamp: Math.floor(Date.now() / 1000) - 172800 },
      ]);
      return;
    }

    setLoading(true);
    try {
      const contract = new Contract(CONTRACT_ID);
      const account = await rpcServer.getAccount(CONTRACT_ID);
      
      const infoTx = contract.call("get_raffle_info");
      const simResult = await rpcServer.simulateTransaction(infoTx);

      if (simResult.result) {
        const [poolStroops, participantCount, deadline, vaultStroops] = scValToNative(simResult.result.retval);
        const xlm = (n) => (Number(n) / 10_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 });
        setData({
          pool: xlm(poolStroops),
          participants: Number(participantCount),
          deadline: Number(deadline),
          vault: xlm(vaultStroops),
        });
      }

      const historyTx = contract.call("get_winner_history");
      const histSimResult = await rpcServer.simulateTransaction(historyTx);
      if (histSimResult.result) {
        const history = scValToNative(histSimResult.result.retval);
        setHistory(history);
      }
    } catch (e) {
      console.error("Failed to fetch contract data:", e);
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger, isDemo, setHistory]);

  // Fetch on mount and on refresh trigger
  useEffect(() => {
    fetchContractData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchContractData, 30_000);
    return () => clearInterval(interval);
  }, [fetchContractData]);

  // Live countdown ticker
  useEffect(() => {
    if (!data.deadline) return;
    const tick = () => {
      const diff = data.deadline - Math.floor(Date.now() / 1000);
      if (diff <= 0) {
        setTimeLeft('DRAWING...');
        return;
      }
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setTimeLeft(h > 0
        ? `${h}h ${m}m ${s.toString().padStart(2, '0')}s`
        : `${m}:${s.toString().padStart(2, '0')}`
      );
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [data.deadline]);

  return (
    <div className="glass-panel stat-card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div className="stat-label">💰 Current Prize Pool</div>
        {loading && <span className="loader" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />}
        {!loading && <span><span className="live-indicator" />LIVE</span>}
      </div>
      <div className="stat-value">{data.pool} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>XLM</span></div>

      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <div className="stat-label">🎟️ Ticket Entries</div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{data.participants.toLocaleString()}</div>
        </div>
        <div>
          <div className="stat-label">⏰ Next Draw</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)', fontFamily: 'monospace' }}>
            {timeLeft || '—'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
        <div className="stat-label">🏢 Platform Vault (5% Fee)</div>
        <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{data.vault} XLM</div>
      </div>
    </div>
  );
};

export default RaffleInfo;
