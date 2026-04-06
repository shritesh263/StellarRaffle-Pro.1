import React, { useState, useEffect, useCallback } from 'react';
import { Horizon } from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

const Balance = ({ pubKey, newBalance, newLoading }) => {
  return (
    <div className="glass-panel stat-card">
      <div className="stat-label">
        <span style={{ fontSize: '1.2rem' }}>💳</span>
        Available Balance
      </div>
      <div className="stat-value" style={{ fontSize: '2.25rem' }}>
        {newLoading ? <div className="loader" style={{ borderTopColor: 'var(--primary)' }}></div> : Number(newBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>XLM</span>
      </div>
    </div>
  );
};


export default Balance;

