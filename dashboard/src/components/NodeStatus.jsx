import React from 'react';

function StatCard({ label, value, unit, status, icon }) {
  return (
    <div className={`stat-card ${status || ''}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="stat-value">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className="stat-unit">{unit}</span>}
        </span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}

export default function NodeStatus({ title, metrics, nodeInfo, icon }) {
  if (!metrics) {
    return (
      <div className="node-panel">
        <div className="node-header">
          <span className="node-icon">{icon}</span>
          <h2>{title}</h2>
          <span className="node-badge offline">Offline</span>
        </div>
        <div className="node-offline-message">
          Waiting for node connection...
        </div>
      </div>
    );
  }

  const synced = metrics.syncPercent >= 99;
  const syncStatus = synced ? 'Synced' : `${metrics.syncPercent.toFixed(1)}%`;

  return (
    <div className="node-panel">
      <div className="node-header">
        <span className="node-icon">{icon}</span>
        <h2>{title}</h2>
        <span className={`node-badge ${synced ? 'synced' : 'syncing'}`}>
          {synced ? 'Synced' : 'Syncing'}
        </span>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Best Tip Height"
          value={metrics.height}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M5 21V7l7-4 7 4v14" />
              <rect x="9" y="13" width="6" height="8" />
            </svg>
          }
        />
        <StatCard
          label="Committed Height"
          value={metrics.committed}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
        <StatCard
          label="Connected Peers"
          value={metrics.peers}
          status={metrics.peers > 0 ? 'good' : 'warn'}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          label="Mempool Txns"
          value={metrics.mempool}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          }
        />
        <StatCard
          label="Sync Status"
          value={syncStatus}
          status={synced ? 'good' : 'syncing-status'}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          }
        />
        {nodeInfo && (
          <StatCard
            label="Network"
            value={nodeInfo.chain || 'testnet'}
            icon={
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            }
          />
        )}
      </div>

      {/* Value pools from RPC (shielded/transparent breakdown) */}
      {nodeInfo?.valuePools && nodeInfo.valuePools.length > 0 && (
        <div className="value-pools">
          <h3 className="section-label">Value Pools</h3>
          <div className="pool-grid">
            {nodeInfo.valuePools.map((pool) => (
              <div key={pool.id} className="pool-card">
                <div className="pool-name">{pool.id}</div>
                <div className="pool-monitored">
                  {pool.monitored ? (
                    <>
                      <span className="pool-value">
                        {parseFloat(pool.chainValue || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 4,
                        })}
                      </span>
                      <span className="pool-unit">ZEC</span>
                    </>
                  ) : (
                    <span className="pool-unmonitored">Not monitored</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
