import React, { useState, useEffect } from 'react';
import { Horizon } from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

const Balance = ({ pubKey, refreshTrigger, setAlert }) => {
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pubKey) {
      fetchBalance();
    } else {
      setBalance('0.00');
    }
  }, [pubKey, refreshTrigger]);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const account = await server.loadAccount(pubKey);
      const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
      if (xlmBalance) {
        setBalance(xlmBalance.balance);
      }
    } catch (e) {
      if (e.response?.status === 404) {
        // Account not funded
        setBalance('0.00');
        setAlert({ type: 'error', message: 'Account not funded on Testnet.' });
      } else {
        setAlert({ type: 'error', message: "Can't reach Testnet. Try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="balance-section stat-box">
      <div className="stat-label">Your Balance</div>
      <div className="stat-value">
        {loading ? <div className="loader" style={{margin: '0 auto'}}></div> : `${balance} XLM`}
      </div>
    </div>
  );
};

export default Balance;
