import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NodeStatus from './components/NodeStatus';
import AssetTracker from './components/AssetTracker';
import MetricsChart from './components/MetricsChart';
import NetworkUpgrades from './components/NetworkUpgrades';
import Footer from './components/Footer';
import {
  fetchDashboardMetrics,
  fetchHeightHistory,
  fetchPeerHistory,
} from './services/prometheus';
import { fetchNodeInfo } from './services/rpc';
import './App.css';

const REFRESH_INTERVAL = 15000; // 15 seconds

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [zsaInfo, setZsaInfo] = useState(null);
  const [crosslinkInfo, setCrosslinkInfo] = useState(null);
  const [heightHistory, setHeightHistory] = useState([]);
  const [peerHistory, setPeerHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [m, zInfo, cInfo, hHist, pHist] = await Promise.all([
        fetchDashboardMetrics().catch(() => null),
        fetchNodeInfo('zsa').catch(() => null),
        fetchNodeInfo('crosslink').catch(() => null),
        fetchHeightHistory(1).catch(() => []),
        fetchPeerHistory(1).catch(() => []),
      ]);

      if (m) setMetrics(m);
      if (zInfo) setZsaInfo(zInfo);
      if (cInfo) setCrosslinkInfo(cInfo);
      setHeightHistory(hHist);
      setPeerHistory(pHist);
      setLastUpdated(Date.now());
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <div className="app">
      <Header lastUpdated={lastUpdated} />

      <main className="main">
        {error && (
          <div className="error-banner">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Connection issue: {error}. Retrying...
          </div>
        )}

        {/* ZSA Asset Section */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              Shielded Assets Overview
            </h2>
          </div>
          <AssetTracker zsaInfo={zsaInfo} crosslinkInfo={crosslinkInfo} />
        </section>

        {/* Node Status Section */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </span>
              Node Status
            </h2>
          </div>
          <div className="nodes-grid">
            <NodeStatus
              title="ZSA Node"
              metrics={metrics?.zsa}
              nodeInfo={zsaInfo}
              icon={
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            />
            <NodeStatus
              title="Crosslink Node"
              metrics={metrics?.crosslink}
              nodeInfo={crosslinkInfo}
              icon={
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </span>
              Chain Metrics
            </h2>
          </div>
          <div className="charts-grid">
            <MetricsChart
              title="Block Height"
              data={heightHistory}
              yLabel="Height"
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              }
            />
            <MetricsChart
              title="Peer Connections"
              data={peerHistory}
              yLabel="Peers"
              icon={
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Network Upgrades Section */}
        {zsaInfo?.upgrades && Object.keys(zsaInfo.upgrades).length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20V10" />
                    <path d="M18 20V4" />
                    <path d="M6 20v-4" />
                  </svg>
                </span>
                Protocol History
              </h2>
            </div>
            <NetworkUpgrades nodeInfo={zsaInfo} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
