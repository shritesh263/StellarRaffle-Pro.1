import React from 'react';

/**
 * WinnerHistory — Displays the last 10 on-chain winner records.
 * Amounts are displayed in XLM (converted from stroops: 1 XLM = 10,000,000 stroops).
 */
const WinnerHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="glass-panel animate-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎲</div>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>No draws yet</p>
        <p className="subtitle" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Be the first to win! Purchase a ticket to enter the current round.
        </p>
      </div>
    );
  }

  const formatAddress = (addr) => {
    if (!addr || addr.length < 12) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}`;
  };

  const formatAmount = (stroops) => {
    // Convert from stroops to XLM; handle both number and bigint forms
    const xlm = Number(stroops) / 10_000_000;
    return xlm.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>🏆 Winner History</h2>
      <p className="subtitle" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
        Last {history.length} draw{history.length !== 1 ? 's' : ''} — all results are immutably stored on-chain.
      </p>

      {history.map((record, i) => (
        <div
          key={i}
          className="glass-panel"
          style={{
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
            }}>
              #{history.length - i}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                {formatAddress(record.winner)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {formatDate(record.timestamp)}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>
              {formatAmount(record.amount)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>XLM WON</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WinnerHistory;
