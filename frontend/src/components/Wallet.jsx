import React, { useState, useEffect } from 'react';
import {
  isAllowed,
  setAllowed,
  getUserInfo,
} from '@stellar/freighter-api';

const Wallet = ({ pubKey, setPubKey, setAlert }) => {
  const [isInstalled, setIsInstalled] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (!window.freighter) {
       setIsInstalled(false);
       return;
    }
    
    try {
      const allowed = await isAllowed();
      if (allowed) {
        const info = await getUserInfo();
        if (info.publicKey) {
          setPubKey(info.publicKey);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const connect = async () => {
    try {
      if (!window.freighter) {
        setIsInstalled(false);
        return;
      }
      await setAllowed();
      const info = await getUserInfo();
      if (info && info.publicKey) {
        setPubKey(info.publicKey);
        setAlert({ type: 'success', message: 'Wallet Authorization Success!' });
      }
    } catch (e) {
      setAlert({ type: 'error', message: 'Authorization Cancelled.' });
    }
  };

  const disconnect = () => {
    setPubKey('');
    setAlert({ type: 'success', message: 'Wallet Session Ended.' });
  };

  if (!isInstalled) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="subtitle" style={{marginBottom: '1.5rem'}}>Stellar Wallet Required</p>
        <a href="https://freighter.app" target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
          Get Freighter
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {!pubKey ? (
        <button onClick={connect} className="btn-primary">
          📲 Connect Wallet
        </button>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem' }}>AUTHORIZED ACCOUNT</span>
            <button 
              onClick={disconnect} 
              style={{ padding: '0.4rem 0.8rem', border: 'none', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.7rem' }}
            >
              Sign Out
            </button>
          </div>
          <div style={{ 
            background: 'white', 
            padding: '1rem', 
            borderRadius: '12px', 
            fontFamily: 'monospace', 
            fontSize: '0.9rem', 
            color: 'var(--primary)',
            border: '1px solid var(--card-border)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
            wordBreak: 'break-all'
          }}>
            {pubKey}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
