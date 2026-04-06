import React, { useState, useEffect, useCallback } from 'react';
import { Horizon } from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

const Balance = ({ pubKey, refreshTrigger, setAlert }) => {
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!pubKey) return;
    setLoading(true);
    try {
      const account = await server.loadAccount(pubKey);
      const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
      if (xlmBalance) {
        setBalance(xlmBalance.balance);
      }
    } catch (e) {
      if (e.response?.status === 404) {
        setBalance('0.00');
        setAlert({ type: 'error', message: 'Account not found on Testnet. Please fund it.' });
      }
    } finally {
      setLoading(false);
    }
  }, [pubKey, setAlert]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, refreshTrigger]);

  return (
    <div className="glass-panel stat-card">
      <div className="stat-label">
        <span style={{ fontSize: '1.2rem' }}>💳</span>
        Available Balance
      </div>
      <div className="stat-value" style={{ fontSize: '2.25rem' }}>
        {loading ? <div className="loader" style={{ borderTopColor: 'var(--primary)' }}></div> : Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>XLM</span>
      </div>
    </div>
  );
};

export default Balance;

