import React, { useState, useEffect } from 'react';
import {
  isAllowed,
  setAllowed,
  getUserInfo,
} from '@stellar/freighter-api';

const Wallet = ({ pubKey, setPubKey, setAlert }) => {
  const [isInstalled, setIsInstalled] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Check every 500ms for 3 seconds
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.freighter) {
        checkConnection();
        clearInterval(interval);
      } else if (attempts > 6) {
        setIsInstalled(false);
        clearInterval(interval);
      }
      attempts++;
    }, 500);

    // Initial check
    checkConnection();
    
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    if (!window.freighter) return;
    
    setIsInstalled(true); 
    
    try {
      const allowed = await isAllowed();
      if (allowed) {
        const info = await getUserInfo();
        if (info.publicKey) {
          setPubKey(info.publicKey);
        }
      }
    } catch (e) {
      console.error("Wallet check failed:", e);
    }
  };



  const connect = async () => {
    setConnecting(true);
    try {
      if (!window.freighter) {
        setIsInstalled(false);
        setConnecting(false);
        return;
      }
      
      const allowed = await setAllowed();
      if (allowed) {
        const info = await getUserInfo();
        if (info && info.publicKey) {
          setPubKey(info.publicKey);
          setAlert({ type: 'success', message: 'Wallet Connected Successfully!' });
        }
      } else {
        setAlert({ type: 'error', message: 'Access Denied. Please allow Freighter to connect.' });
      }
    } catch (e) {
      setAlert({ type: 'error', message: 'Authorization Cancelled or Failed.' });
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setPubKey('');
    setAlert({ type: 'success', message: 'Signed out of session.' });
  };

  if (!isInstalled) {
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

  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-6)}`;

  return (
    <div style={{ marginTop: '0.5rem' }}>
      {!pubKey ? (
        <button 
          onClick={connect} 
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <div className="live-indicator" />
                 <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '0.05em' }}>MAINNET READY</span>
              </div>
              <button 
                onClick={disconnect}
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

