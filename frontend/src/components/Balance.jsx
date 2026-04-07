import React from 'react';
import { useFreighter } from '../hooks/useFreighter';
import { useStellar } from '../hooks/useStellar';

const Balance = ({ refreshTrigger }) => {
  const { publicKey } = useFreighter();
  const { balance, loading } = useStellar(publicKey);

  // We still want to refresh when refreshTrigger changes
  // useStellar handles this via the dependency on publicKey, 
  // but if we want to force refresh on same publicKey, 
  // we could add refreshTrigger to useStellar.
  
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

