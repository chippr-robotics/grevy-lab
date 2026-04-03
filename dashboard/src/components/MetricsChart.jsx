import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CHART_COLORS = {
  'zsa-node': '#3bb08f',
  'crosslink-node': '#e8973f',
};

const CHART_LABELS = {
  'zsa-node': 'ZSA Node',
  'crosslink-node': 'Crosslink Node',
};

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatNumber(val) {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val?.toLocaleString?.() ?? val;
}

export default function MetricsChart({ title, data, dataKeys, yLabel, icon }) {
  const keys = dataKeys || Object.keys(data?.[0] || {}).filter((k) => k !== 'time');

  return (
    <div className="card chart-card">
      <div className="card-header">
        <h3>
          {icon}
          {title}
        </h3>
      </div>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              stroke="#8a9bb5"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#8a9bb5"
              fontSize={11}
              tickFormatter={formatNumber}
              tickLine={false}
              axisLine={false}
              label={
                yLabel
                  ? { value: yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#8a9bb5' } }
                  : undefined
              }
            />
            <Tooltip
              labelFormatter={formatTime}
              formatter={(val, name) => [formatNumber(val), CHART_LABELS[name] || name]}
              contentStyle={{
                background: '#0f2044',
                border: 'none',
                borderRadius: '8px',
                color: '#e8eef4',
                fontSize: '13px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            />
            <Legend
              formatter={(val) => CHART_LABELS[val] || val}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
            {keys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={CHART_COLORS[key] || '#4a90d9'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="chart-empty">
          <p>Waiting for data...</p>
          <p className="chart-empty-sub">Charts populate as metrics are collected.</p>
        </div>
      )}
    </div>
  );
}
