import React, { useState, useEffect } from 'react';
import Wallet from './components/Wallet';
import Balance from './components/Balance';
import RaffleInfo from './components/RaffleInfo';
import BuyTicket from './components/BuyTicket';
import TierSelector from './components/TierSelector';
import WinnerHistory from './components/WinnerHistory';

import { useFreighter } from './hooks/useFreighter';
import { useStellar } from './hooks/useStellar';

function App() {
  const { 
    publicKey: pubKey, 
    isFreighterInstalled, 
    connecting, 
    error: walletError, 
    connectWallet, 
    disconnectWallet 
  } = useFreighter();

  const [alert, setAlert] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('play'); // 'play', 'history', 'referral'
  const [selectedTier, setSelectedTier] = useState('Bronze');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (walletError) {
      setAlert({ type: 'error', message: walletError });
    }
  }, [walletError]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleTransactionSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };


  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${pubKey}`;
    navigator.clipboard.writeText(link);
    setAlert({ type: 'success', message: 'Referral link copied to clipboard!' });
  };

  return (
    <div className="app-container">
      <header style={{ textAlign: 'center' }}>
        <h1>StellarRaffle <span style={{fontWeight: 300}}>Pro</span></h1>
        <p className="subtitle">High-Stakes Decentralized Lottery on Soroban</p>
      </header>

      {alert && (
        <div className={`notification notif-${alert.type}`}>
          <span style={{ fontSize: '1.2rem' }}>{alert.type === 'success' ? '✨' : '⚠️'}</span>
          {alert.message}
        </div>
      )}

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'play' ? 'active' : ''}`}
            onClick={() => setActiveTab('play')}
          >
            🎮 Play
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            🏆 Winners
          </button>
          <button 
            className={`tab-btn ${activeTab === 'referral' ? 'active' : ''}`}
            onClick={() => setActiveTab('referral')}
          >
            🤝 Referrals
          </button>
        </div>
      </div>

      <div className="dash-grid">
        <main className="main-content">
          {activeTab === 'play' && (
            <div className="animate-in">
              <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Choose Your Tier</h2>
                    <p className="subtitle" style={{ fontSize: '0.95rem' }}>Select a ticket to enter the next draw</p>
                  </div>
                  <div className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: 'var(--primary-light)', border: 'none' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem' }}>TESTNET LIVE</span>
                  </div>
                </div>
                
                <TierSelector selectedTier={selectedTier} setSelectedTier={setSelectedTier} />
                
                {pubKey ? (
                  <BuyTicket 
                    tier={selectedTier}
                    setAlert={setAlert} 
                    onSuccess={handleTransactionSuccess} 
                  />
                ) : (
                  <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: 'hsla(243, 75%, 59%, 0.03)', borderRadius: '20px', border: '1px dashed var(--primary)' }}>
                     <p className="subtitle" style={{marginBottom: '1rem'}}>Wallet Authorization Required</p>
                     <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Connect your Stellar wallet to participate in the raffle.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <WinnerHistory history={history} />
          )}

          {activeTab === 'referral' && (
            <div className="glass-panel animate-in" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Referral Program</h2>
              <p className="subtitle" style={{marginTop: '0.5rem'}}>
                Earn <b>1% instant XLM</b> for every ticket your friends buy. 
                Rewards are distributed automatically on-chain.
              </p>
              
              <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'hsla(150, 100%, 35%, 0.03)', border: 'none' }}>
                  <div className="stat-label">✨ Your Bonus</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>1% Reward</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'hsla(199, 89%, 48%, 0.03)', border: 'none' }}>
                  <div className="stat-label">🤝 Payouts</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>Instant</div>
                </div>
              </div>

              {pubKey ? (
                <div style={{ marginTop: '2.5rem' }}>
                  <div className="stat-label">YOUR PERSONAL LINK</div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    marginTop: '0.75rem',
                    background: 'white',
                    padding: '0.5rem',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <div style={{ 
                      flex: 1, 
                      padding: '0.75rem 1rem', 
                      fontFamily: 'monospace', 
                      fontSize: '0.85rem', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: 'var(--primary)'
                    }}>
                      {window.location.origin}?ref={pubKey}
                    </div>
                    <button 
                      onClick={copyReferralLink}
                      style={{ 
                        padding: '0.75rem 1.5rem', 
                        borderRadius: '12px', 
                        border: 'none', 
                        background: 'var(--primary)', 
                        color: 'white', 
                        fontWeight: 700, 
                        cursor: 'pointer' 
                      }}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              ) : (
                 <div style={{marginTop: '2rem', padding: '1.5rem', background: 'hsla(330, 81%, 60%, 0.05)', borderRadius: '16px', textAlign: 'center'}}>
                    <p style={{color: 'var(--accent)', fontWeight: 700}}>Connect your wallet to generate your referral link.</p>
                 </div>
              )}
            </div>
          )}
        </main>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel stat-card">
             <div className="stat-label">🔐 SECURE ACCOUNT</div>
             <Wallet setAlert={setAlert} />
          </div>
          
          <Balance refreshTrigger={refreshTrigger} />

          <RaffleInfo refreshTrigger={refreshTrigger} setHistory={setHistory} />
        </aside>
      </div>
    </div>
  );
}

export default App;

