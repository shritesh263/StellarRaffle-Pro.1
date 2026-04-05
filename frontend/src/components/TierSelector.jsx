import React from 'react';

const TIERS = [
  { id: 'Bronze', label: 'Bronze', price: 5, entries: 1, color: '#CD7F32' },
  { id: 'Gold', label: 'Gold', price: 20, entries: 5, color: '#FFD700' },
  { id: 'Diamond', label: 'Diamond', price: 50, entries: 15, color: '#B9F2FF' },
];

const TierSelector = ({ selectedTier, setSelectedTier }) => {
  return (
    <div className="tier-grid animate-in">
      {TIERS.map((tier) => (
        <div
          key={tier.id}
          className={`glass-panel tier-card ${selectedTier === tier.id ? 'selected' : ''}`}
          onClick={() => setSelectedTier(tier.id)}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: tier.color }}>{tier.label}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.5rem 0' }}>{tier.price} XLM</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{tier.entries} Entries</div>
        </div>
      ))}
    </div>
  );
};

export default TierSelector;
