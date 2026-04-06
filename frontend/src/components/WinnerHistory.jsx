import React from 'react';

const WinnerHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="glass-panel animate-in" style={{ padding: '4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h3 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-main)' }}>No Winners Yet</h3>
        <p className="subtitle" style={{ marginTop: '0.75rem', fontSize: '1rem' }}>
          Be the first to claim the jackpot! Select a tier and enter the draw.
        </p>
      </div>
    );
  }

  const formatAddress = (addr) => {
    if (!addr || addr.length < 12) return addr;
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}`;
  };

  const formatAmount = (stroops) => {
    const xlm = Number(stroops) / 10_000_000;
    return xlm.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
         <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Hall of Fame</h2>
            <p className="subtitle">Real-time records of previous draw winners</p>
         </div>
         <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
            {history.length} RECORDS
         </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {history.map((record, i) => (
          <div
            key={i}
            className="glass-panel"
            style={{
              padding: '1.5rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'white',
              border: '1px solid #F1F5F9',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--primary-light), white)',
                border: '1px solid var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)', fontWeight: 800, fontSize: '1rem',
              }}>
                #{history.length - i}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                  {formatAddress(record.winner)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.2rem' }}>
                  CONCLUDED ON {formatDate(record.timestamp).toUpperCase()}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--success)', letterSpacing: '-0.02em' }}>
                +{formatAmount(record.amount)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em' }}>XLM DISTRIBUTED</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinnerHistory;
