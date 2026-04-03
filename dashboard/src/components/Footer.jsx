import React from 'react';

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
          <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
            Grafana
          </a>
          <a href="http://localhost:9090" target="_blank" rel="noopener noreferrer">
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
