import React, { useState, useEffect } from 'react';

const Monitoring = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Simulate incoming monitoring logs
    const interval = setInterval(() => {
      const types = ['INFO', 'WARN', 'SUCCESS'];
      const messages = [
        'Checked contract state balance',
        'Validating Soroban instance',
        'Fetching latest blocks',
        'Ledger sequence updated',
        'High latency detected on public RPC'
      ];
      const type = types[Math.floor(Math.random() * types.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      
      setLogs(prev => {
        const newLogs = [{ time: new Date().toLocaleTimeString(), type, message }, ...prev];
        return newLogs.slice(0, 8); // Keep last 8 logs
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel animate-in" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>System Monitoring</h2>
          <p className="subtitle" style={{ fontSize: '0.95rem' }}>Active tracking of contract events and RPC status</p>
        </div>
      </div>

      <div style={{ background: '#0f172a', borderRadius: '16px', padding: '1.5rem', fontFamily: 'monospace', color: '#38bdf8', minHeight: '300px', overflow: 'hidden' }}>
        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #1e293b', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8' }}>Live Event Stream</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
            Connected
          </span>
        </div>
        
        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: '0.75rem', opacity: Math.max(0.3, 1 - index * 0.15), display: 'flex', gap: '1rem' }}>
            <span style={{ color: '#64748b', minWidth: '80px' }}>[{log.time}]</span>
            <span style={{ 
              color: log.type === 'INFO' ? '#60a5fa' : log.type === 'WARN' ? '#fbbf24' : '#34d399',
              minWidth: '60px',
              fontWeight: 'bold'
            }}>
              {log.type}
            </span>
            <span>{log.message}</span>
          </div>
        ))}
        {logs.length === 0 && <div style={{ color: '#64748b', fontStyle: 'italic' }}>Waiting for incoming events...</div>}
      </div>
    </div>
  );
};

export default Monitoring;
