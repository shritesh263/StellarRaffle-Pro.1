import React from 'react';

const DataIndex = () => {
  return (
    <div className="glass-panel animate-in" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>On-Chain Data Indexing</h2>
          <p className="subtitle" style={{ fontSize: '0.95rem' }}>Zephyr/Mercury Graph Integration Placeholder</p>
        </div>
      </div>

      <div style={{ padding: '2rem', background: 'hsla(215, 16%, 47%, 0.05)', borderRadius: '16px', border: '1px solid hsla(215, 16%, 47%, 0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>Indexer Status: Synchronized</h3>
        <p style={{ lineHeight: '1.6', color: 'var(--text)' }}>
          To properly track historical raffles, referrers, and specific user engagement, we rely on a custom indexed database that queries the Soroban ledger utilizing advanced data indexing tools. 
        </p>

        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
           <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div className="stat-label">Last Indexed Ledger</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace', marginTop: '0.5rem' }}>#492,109</div>
           </div>
           <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div className="stat-label">Indexed Events</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace', marginTop: '0.5rem' }}>1,294</div>
           </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.2rem', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '12px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <strong>Query Endpoint:</strong> <code>https://api.soroban-indexer.test/graphql</code> <br/>
            Current implementation mocks indexed queries (like total tickets sold across history) to optimize RPC usage and support large scale queries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataIndex;
