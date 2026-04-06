import React from 'react';

const TIERS = [
  { id: 'Bronze', label: 'Bronze', price: 5, entries: 1, icon: '🥉', color: '#CD7F32' },
  { id: 'Gold', label: 'Gold', price: 20, entries: 5, icon: '🥇', color: '#FFD700' },
  { id: 'Diamond', label: 'Diamond', price: 50, entries: 15, icon: '💎', color: '#B9F2FF' },
];

const TierSelector = ({ selectedTier, setSelectedTier }) => {
  return (
    <div className="tier-grid">
      {TIERS.map((tier) => (
        <div
          key={tier.id}
          className={`tier-card ${selectedTier === tier.id ? 'selected' : ''}`}
          onClick={() => setSelectedTier(tier.id)}
          style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
        >
          {selectedTier === tier.id && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.2rem' }}>✨</div>
          )}
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{tier.icon}</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{tier.label}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', margin: '0.5rem 0' }}>{tier.price} XLM</div>
          <div style={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.8rem', 
            fontWeight: 700,
            background: 'var(--primary-light)',
            padding: '0.3rem 0.6rem',
            borderRadius: '8px',
            display: 'inline-block'
          }}>
            {tier.entries} ENTRIES
          </div>
        </div>
      ))}
    </div>
  );
};

export default TierSelector;

