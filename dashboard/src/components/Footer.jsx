import React from 'react';

const GRAFANA_URL = `http://localhost:${import.meta.env.VITE_GRAFANA_PORT || 3000}`;
const PROMETHEUS_URL = `http://localhost:${import.meta.env.VITE_PROMETHEUS_PORT || 9090}`;

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-name">Grevy Lab</span>
          <span className="footer-sep">&middot;</span>
          <span>Zcash Feature Chain Testing</span>
        </div>
        <div className="footer-links">
          <a href={GRAFANA_URL} target="_blank" rel="noopener noreferrer">
            Grafana
          </a>
          <a href={PROMETHEUS_URL} target="_blank" rel="noopener noreferrer">
            Prometheus
          </a>
        </div>
      </div>
      {/* Subtle zebra stripe bottom border */}
      <div className="footer-stripes">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="footer-stripe"
            style={{ opacity: i % 2 === 0 ? 0.08 : 0.03 }}
          />
        ))}
      </div>
    </footer>
  );
}
