import React, { useState, useEffect } from 'react';
import Wallet from './components/Wallet';
import Balance from './components/Balance';
import RaffleInfo from './components/RaffleInfo';
import BuyTicket from './components/BuyTicket';

function App() {
  const [pubKey, setPubKey] = useState('');
  const [alert, setAlert] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Clear alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleTransactionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container">
      <div className="glass-card">
        <header>
          <h1>StellarRaffle</h1>
          <p className="subtitle">Fully On-Chain Testnet Lottery</p>
        </header>

        {alert && (
          <div className={`notification notif-${alert.type}`}>
            {alert.message}
          </div>
        )}

        <Wallet pubKey={pubKey} setPubKey={setPubKey} setAlert={setAlert} />

        <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
          <Balance pubKey={pubKey} refreshTrigger={refreshTrigger} setAlert={setAlert} />
        </div>

        <RaffleInfo refreshTrigger={refreshTrigger} />

        {pubKey && (
          <BuyTicket 
            pubKey={pubKey} 
            setAlert={setAlert} 
            onSuccess={handleTransactionSuccess} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
