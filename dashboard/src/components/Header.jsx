import React from 'react';

export default function Header({ lastUpdated }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <svg viewBox="0 0 48 48" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Zebra silhouette - stylized */}
              <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.1)" />
              <g transform="translate(8, 6)" stroke="#e8eef4" strokeWidth="2" strokeLinecap="round" fill="none">
                {/* Zebra head shape */}
                <path d="M6 28 Q2 20 8 12 Q12 6 20 4 Q28 2 30 8 Q32 14 28 18 Q24 22 20 24 L16 28 Z" fill="rgba(255,255,255,0.15)" stroke="#c8d6e5" strokeWidth="1.5"/>
                {/* Stripes */}
                <line x1="12" y1="10" x2="22" y2="6" opacity="0.5"/>
                <line x1="10" y1="14" x2="24" y2="10" opacity="0.5"/>
                <line x1="10" y1="18" x2="24" y2="14" opacity="0.5"/>
                <line x1="12" y1="22" x2="22" y2="18" opacity="0.4"/>
                {/* Eye */}
                <circle cx="24" cy="9" r="1.5" fill="#e8eef4" />
                {/* Ear */}
                <path d="M24 4 L28 0 L30 6" strokeWidth="1.5" opacity="0.7"/>
              </g>
            </svg>
          </div>
          <div>
            <h1 className="header-title">Grevy Lab</h1>
            <p className="header-subtitle">Zcash Shielded Assets Dashboard</p>
          </div>
        </div>
        <div className="header-status">
          <div className="header-badge">
            <span className="status-dot" />
            Testnet
          </div>
          {lastUpdated && (
            <span className="header-time">
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      {/* Zebra stripe decoration */}
      <div className="header-stripes">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="header-stripe"
            style={{
              left: `${i * 9}%`,
              opacity: i % 2 === 0 ? 0.06 : 0.03,
              width: i % 3 === 0 ? '3%' : '2%',
            }}
          />
        ))}
      </div>
    </header>
  );
}
