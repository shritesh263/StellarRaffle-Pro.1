import React from 'react';
import { useFreighter } from '../hooks/useFreighter';

const Wallet = ({ setAlert }) => {
  const { 
    publicKey: pubKey, 
    connectWallet, 
    disconnectWallet, 
    connecting, 
    isFreighterInstalled 
  } = useFreighter();

  const formatAddress = (addr) => addr ? `${addr.slice(0, 8)}...${addr.slice(-8)}` : '';

  if (!isFreighterInstalled) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Freighter Wallet not detected.
        </p>
        <a 
          href="https://freighter.app" 
          target="_blank" 
          rel="noreferrer" 
          className="btn-primary" 
          style={{ textDecoration: 'none', display: 'inline-block', fontSize: '0.9rem', padding: '0.75rem 1.5rem', marginBottom: '1rem' }}
        >
          Download Freighter
        </a>
        <div style={{ marginTop: '0.5rem' }}>
          <button 
            onClick={() => window.location.reload()} 
            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'underline' }}
          >
            I have it installed. Refresh App.
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '0.5rem' }}>
      {!pubKey ? (
        <button 
          onClick={connectWallet} 
          disabled={connecting}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
        >
          {connecting ? <span className="loader" style={{ width: '18px', height: '18px' }} /> : '🌐'}
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="glass-panel" style={{ background: 'white', padding: '1rem', border: '1px solid #F1F5F9', boxShadow: 'none' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'center', alignItems: 'center', gap: '0.5rem' }}>
                 <div className="live-indicator" />
                 <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '0.05em' }}>MAINNET READY</span>
              </div>
              <button 
                onClick={disconnectWallet}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', padding: '0.2rem 0.5rem', borderRadius: '6px' }}
              >
                Sign Out
              </button>
           </div>
           <div style={{ 
             fontFamily: 'monospace', 
             fontSize: '1rem', 
             fontWeight: 700, 
             color: 'var(--primary)',
             background: 'var(--primary-light)',
             padding: '0.75rem',
             borderRadius: '10px',
             textAlign: 'center',
             letterSpacing: '0.05em'
           }}>
             {formatAddress(pubKey)}
           </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;

