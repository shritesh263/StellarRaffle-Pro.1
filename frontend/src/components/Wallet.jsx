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
    // Basic heuristics to check Freighter 
    // Usually it injects window.freighter
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
        setAlert({ type: 'success', message: 'Wallet connected!' });
      }
    } catch (e) {
      setAlert({ type: 'error', message: 'Error connecting wallet.' });
    }
  };

  const disconnect = async () => {
    setPubKey('');
    setAlert({ type: 'success', message: 'Wallet disconnected.' });
  };

  if (!isInstalled) {
    return (
      <div className="wallet-section stat-box">
        <p className="stat-label" style={{marginBottom: '0.5rem'}}>Freighter is required</p>
        <a href="https://freighter.app" target="_blank" rel="noreferrer" className="btn">
          Install Freighter
        </a>
      </div>
    );
  }

  return (
    <div className="wallet-section">
      {!pubKey ? (
        <button onClick={connect} className="btn" style={{width: '100%'}}>
          Connect Freighter
        </button>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <button onClick={disconnect} className="btn" style={{background: 'rgba(255,255,255,0.1)'}}>
            Disconnect Wallet
          </button>
          <div className="wallet-address stat-label">
            {pubKey.substring(0, 6)}...{pubKey.substring(pubKey.length - 6)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
