const PROM_BASE = '/api/prometheus';

export async function queryInstant(expr) {
  const url = `${PROM_BASE}/api/v1/query?query=${encodeURIComponent(expr)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Prometheus query failed: ${res.status}`);
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.error || 'Query failed');
  return json.data.result;
}

export async function queryRange(expr, start, end, step = '60s') {
  const url = `${PROM_BASE}/api/v1/query_range?query=${encodeURIComponent(expr)}&start=${start}&end=${end}&step=${step}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Prometheus range query failed: ${res.status}`);
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.error || 'Range query failed');
  return json.data.result;
}

export function extractValue(result, defaultVal = null) {
  if (!result || result.length === 0) return defaultVal;
  const val = result[0]?.value?.[1];
  return val !== undefined ? parseFloat(val) : defaultVal;
}

export function extractLabeledValues(result) {
  return result.map((r) => ({
    labels: r.metric,
    value: parseFloat(r.value?.[1] ?? 0),
  }));
}

export function rangeToTimeSeries(result, labelKey = 'job') {
  if (!result || result.length === 0) return [];

  const allTimestamps = new Set();
  result.forEach((series) => {
    series.values.forEach(([ts]) => allTimestamps.add(ts));
  });

  const sorted = [...allTimestamps].sort((a, b) => a - b);
  return sorted.map((ts) => {
    const point = { time: ts * 1000 };
    result.forEach((series) => {
      const label = series.metric[labelKey] || 'unknown';
      const match = series.values.find(([t]) => t === ts);
      point[label] = match ? parseFloat(match[1]) : null;
    });
    return point;
  });
}

// Fetch all key metrics in one batch
export async function fetchDashboardMetrics() {
  const [
    zsaHeight,
    crosslinkHeight,
    zsaCommitted,
    crosslinkCommitted,
    zsaPeers,
    crosslinkPeers,
    zsaMempool,
    crosslinkMempool,
    zsaSync,
    crosslinkSync,
  ] = await Promise.all([
    queryInstant('zcash_consensus_best_tip_height{job="zsa-node"}').catch(() => []),
    queryInstant('zcash_consensus_best_tip_height{job="crosslink-node"}').catch(() => []),
    queryInstant('zcash_state_committed_block_height{job="zsa-node"}').catch(() => []),
    queryInstant('zcash_state_committed_block_height{job="crosslink-node"}').catch(() => []),
    queryInstant('zcash_network_peers{job="zsa-node",kind="Established"}').catch(() => []),
    queryInstant('zcash_network_peers{job="crosslink-node",kind="Established"}').catch(() => []),
    queryInstant('zcash_mempool_transactions{job="zsa-node"}').catch(() => []),
    queryInstant('zcash_mempool_transactions{job="crosslink-node"}').catch(() => []),
    queryInstant('zcash_sync_percent{job="zsa-node"}').catch(() => []),
    queryInstant('zcash_sync_percent{job="crosslink-node"}').catch(() => []),
  ]);

  return {
    zsa: {
      height: extractValue(zsaHeight, 0),
      committed: extractValue(zsaCommitted, 0),
      peers: extractValue(zsaPeers, 0),
      mempool: extractValue(zsaMempool, 0),
      syncPercent: extractValue(zsaSync, 0),
    },
    crosslink: {
      height: extractValue(crosslinkHeight, 0),
      committed: extractValue(crosslinkCommitted, 0),
      peers: extractValue(crosslinkPeers, 0),
      mempool: extractValue(crosslinkMempool, 0),
      syncPercent: extractValue(crosslinkSync, 0),
    },
  };
}

export async function fetchHeightHistory(hours = 1) {
  const end = Math.floor(Date.now() / 1000);
  const start = end - hours * 3600;
  const result = await queryRange(
    'zcash_consensus_best_tip_height',
    start,
    end,
    '120s'
  ).catch(() => []);
  return rangeToTimeSeries(result, 'job');
}

export async function fetchPeerHistory(hours = 1) {
  const end = Math.floor(Date.now() / 1000);
  const start = end - hours * 3600;
  const result = await queryRange(
    'zcash_network_peers{kind="Established"}',
    start,
    end,
    '120s'
  ).catch(() => []);
  return rangeToTimeSeries(result, 'job');
}
