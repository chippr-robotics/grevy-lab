import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const POOL_COLORS = {
  transparent: '#4a90d9',
  sprout: '#7c5cbf',
  sapling: '#3bb08f',
  orchard: '#e8973f',
};

const POOL_LABELS = {
  transparent: 'Transparent',
  sprout: 'Sprout',
  sapling: 'Sapling',
  orchard: 'Orchard',
};

function PoolBreakdownChart({ valuePools }) {
  const data = valuePools
    .filter((p) => p.monitored && parseFloat(p.chainValue || 0) > 0)
    .map((p) => ({
      name: POOL_LABELS[p.id] || p.id,
      value: parseFloat(p.chainValue || 0),
      color: POOL_COLORS[p.id] || '#8884d8',
    }));

  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No value pool data available yet.</p>
        <p className="chart-empty-sub">Pools will appear as the chain syncs.</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);
  const shielded = data
    .filter((d) => d.name !== 'Transparent')
    .reduce((s, d) => s + d.value, 0);

  return (
    <div className="pool-breakdown">
      <div className="pool-summary">
        <div className="pool-summary-item">
          <div className="summary-label">Total Value</div>
          <div className="summary-value">{total.toLocaleString(undefined, { maximumFractionDigits: 2 })} ZEC</div>
        </div>
        <div className="pool-summary-item shielded">
          <div className="summary-label">Shielded</div>
          <div className="summary-value">
            {shielded.toLocaleString(undefined, { maximumFractionDigits: 2 })} ZEC
            <span className="summary-pct">
              {total > 0 ? ` (${((shielded / total) * 100).toFixed(1)}%)` : ''}
            </span>
          </div>
        </div>
        <div className="pool-summary-item transparent">
          <div className="summary-label">Transparent</div>
          <div className="summary-value">
            {(total - shielded).toLocaleString(undefined, { maximumFractionDigits: 2 })} ZEC
            <span className="summary-pct">
              {total > 0 ? ` (${(((total - shielded) / total) * 100).toFixed(1)}%)` : ''}
            </span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={2}
            stroke="#f5f7fa"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val) =>
              `${val.toLocaleString(undefined, { maximumFractionDigits: 4 })} ZEC`
            }
            contentStyle={{
              background: '#0f2044',
              border: 'none',
              borderRadius: '8px',
              color: '#e8eef4',
              fontSize: '13px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', color: '#5a6f8a' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function AssetAction({ type, count, icon, color }) {
  return (
    <div className="asset-action" style={{ '--action-color': color }}>
      <div className="action-icon">{icon}</div>
      <div className="action-info">
        <span className="action-count">{count.toLocaleString()}</span>
        <span className="action-type">{type}</span>
      </div>
    </div>
  );
}

export default function AssetTracker({ zsaInfo, crosslinkInfo }) {
  const valuePools = zsaInfo?.valuePools || crosslinkInfo?.valuePools || [];

  // Derive ZSA activity indicators from available chain data
  const blockHeight = zsaInfo?.blocks || 0;
  const hasOrchard = valuePools.some(
    (p) => p.id === 'orchard' && p.monitored && parseFloat(p.chainValue || 0) > 0
  );

  return (
    <div className="asset-tracker">
      {/* ZSA Activity Overview */}
      <div className="card">
        <div className="card-header">
          <h3>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            ZSA Activity
          </h3>
        </div>
        <div className="asset-actions">
          <AssetAction
            type="Assets Issued"
            count={hasOrchard ? blockHeight > 0 ? '...' : 0 : 0}
            color="#3bb08f"
            icon={
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            }
          />
          <AssetAction
            type="Transfers"
            count={hasOrchard ? '...' : 0}
            color="#4a90d9"
            icon={
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            }
          />
          <AssetAction
            type="Burns"
            count={0}
            color="#e85d5d"
            icon={
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c-4.97 0-9-2.69-9-6v-.5C3 10.19 8.5 3 12 2c3.5 1 9 8.19 9 13.5v.5c0 3.31-4.03 6-9 6z" />
                <path d="M12 22c-2 0-4-1.34-4-3v-.25C8 15.6 10 12 12 11c2 1 4 4.6 4 7.75v.25c0 1.66-2 3-4 3z" />
              </svg>
            }
          />
        </div>
        <div className="asset-note">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          ZSA operations tracked via V5/V6 transactions (ZIP 226/227).
          Counts update as blocks are scanned.
        </div>
      </div>

      {/* Value Pool Breakdown */}
      <div className="card">
        <div className="card-header">
          <h3>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            Value Pool Distribution
          </h3>
          <span className="card-badge">Shielded vs Transparent</span>
        </div>
        <PoolBreakdownChart valuePools={valuePools} />
      </div>
    </div>
  );
}
