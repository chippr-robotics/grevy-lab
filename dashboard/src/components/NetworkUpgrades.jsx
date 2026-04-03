import React from 'react';

const UPGRADE_NAMES = {
  '5ba81b19': 'Overwinter',
  '76b809bb': 'Sapling',
  '2bb40e60': 'Blossom',
  'f5b9230b': 'Heartwood',
  'e9ff75a6': 'Canopy',
  'c2d6d0b4': 'NU5',
  '37519621': 'NU6',
};

export default function NetworkUpgrades({ nodeInfo }) {
  if (!nodeInfo?.upgrades) return null;

  const upgrades = Object.entries(nodeInfo.upgrades)
    .map(([id, info]) => ({
      id,
      name: info.name || UPGRADE_NAMES[id] || id.slice(0, 8),
      status: info.status || 'unknown',
      activationheight: info.activationheight,
    }))
    .sort((a, b) => (a.activationheight || 0) - (b.activationheight || 0));

  if (upgrades.length === 0) return null;

  return (
    <div className="card">
      <div className="card-header">
        <h3>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
          Network Upgrades
        </h3>
      </div>
      <div className="upgrades-timeline">
        {upgrades.map((u, i) => (
          <div key={u.id} className={`upgrade-item ${u.status}`}>
            <div className="upgrade-dot" />
            {i < upgrades.length - 1 && <div className="upgrade-line" />}
            <div className="upgrade-info">
              <span className="upgrade-name">{u.name}</span>
              <span className="upgrade-height">
                {u.activationheight != null
                  ? `Height ${u.activationheight.toLocaleString()}`
                  : 'Pending'}
              </span>
              <span className={`upgrade-status ${u.status}`}>{u.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
