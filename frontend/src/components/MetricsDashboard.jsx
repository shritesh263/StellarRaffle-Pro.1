import React from 'react';

const MetricsDashboard = () => {
  return (
    <div className="glass-panel animate-in" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Metrics Dashboard</h2>
          <p className="subtitle" style={{ fontSize: '0.95rem' }}>Real-time platform analytics</p>
        </div>
        <div className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: 'hsla(150, 100%, 35%, 0.1)', border: '1px solid hsla(150, 100%, 35%, 0.3)' }}>
          <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.85rem' }}>● LIVE</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="stat-card glass-panel" style={{ background: 'var(--surface-light)' }}>
          <div className="stat-label">Total Volume (XLM)</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>45,230</div>
          <p style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '0.5rem' }}>↑ 12.5% this week</p>
        </div>
        <div className="stat-card glass-panel" style={{ background: 'var(--surface-light)' }}>
          <div className="stat-label">Active Users</div>
          <div className="stat-value" style={{ color: 'var(--secondary)' }}>1,204</div>
          <p style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '0.5rem' }}>↑ 5.2% this week</p>
        </div>
        <div className="stat-card glass-panel" style={{ background: 'var(--surface-light)' }}>
          <div className="stat-label">Tickets Sold</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>8,492</div>
          <p style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '0.5rem' }}>↑ 22.1% this week</p>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', background: 'var(--surface-light)', borderRadius: '16px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>RPC Node Health</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)' }}></div>
            <span style={{ fontWeight: 600 }}>Soroban Testnet Node</span>
          </div>
          <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>99.9% Uptime</span>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;
