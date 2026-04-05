import React, { useState, useEffect } from 'react';
import Wallet from './components/Wallet';
import Balance from './components/Balance';
import RaffleInfo from './components/RaffleInfo';
import BuyTicket from './components/BuyTicket';
import TierSelector from './components/TierSelector';
import WinnerHistory from './components/WinnerHistory';

function App() {
  const [pubKey, setPubKey] = useState('');
  const [alert, setAlert] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('play'); // 'play', 'history', 'referral'
  const [selectedTier, setSelectedTier] = useState('Bronze');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleTransactionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>StellarRaffle Pro</h1>
        <p className="subtitle">Premium Decentralized Lottery & Referral Engine</p>
      </header>

      {alert && (
        <div className={`notification notif-${alert.type}`} style={{ marginBottom: '1.5rem' }}>
          {alert.message}
        </div>
      )}

      <div className="dash-grid">
        <div className="main-content">
          <div className="tabs">
            <button 
              className={`tab-btn ${activeTab === 'play' ? 'active' : ''}`}
              onClick={() => setActiveTab('play')}
            >
              🎮 Play Now
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              🏆 Winner History
            </button>
            <button 
              className={`tab-btn ${activeTab === 'referral' ? 'active' : ''}`}
              onClick={() => setActiveTab('referral')}
            >
              🤝 Referral Program
            </button>
          </div>

          {activeTab === 'play' && (
            <div className="animate-in">
              <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Select Your Ticket Tier</h2>
                <TierSelector selectedTier={selectedTier} setSelectedTier={setSelectedTier} />
                
                {pubKey ? (
                  <BuyTicket 
                    pubKey={pubKey} 
                    tier={selectedTier}
                    setAlert={setAlert} 
                    onSuccess={handleTransactionSuccess} 
                  />
                ) : (
                  <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                     <p className="subtitle" style={{marginBottom: '1rem'}}>Connect your wallet to purchase tickets</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <WinnerHistory history={history} />
          )}

          {activeTab === 'referral' && (
            <div className="glass-panel animate-in" style={{ padding: '2rem' }}>
              <h2>Referral Engine</h2>
              <p className="subtitle" style={{marginTop: '1rem'}}>
                Share your link and earn <b>1% instant XLM reward</b> on every ticket your friend buys. 
                Rewards are sent directly to your wallet by the smart contract.
              </p>
              {pubKey ? (
                <div style={{ marginTop: '1.5rem', background: '#F1F5F9', padding: '1rem', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                  <code style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                    {window.location.origin}?ref={pubKey}
                  </code>
                </div>
              ) : (
                 <p style={{marginTop: '1rem', color: 'var(--accent)'}}>Connect wallet to get your referral link.</p>
              )}
            </div>
          )}
        </div>

        <aside>
          <div className="glass-panel stat-card" style={{ marginBottom: '1rem' }}>
             <Wallet pubKey={pubKey} setPubKey={setPubKey} setAlert={setAlert} />
          </div>
          
          <Balance pubKey={pubKey} refreshTrigger={refreshTrigger} setAlert={setAlert} />
          
          <div style={{ marginTop: '1.5rem' }}>
            <RaffleInfo refreshTrigger={refreshTrigger} setHistory={setHistory} />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
