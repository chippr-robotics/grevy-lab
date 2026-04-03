let rpcId = 0;

async function rpcCall(endpoint, method, params = []) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: ++rpcId,
      method,
      params,
    }),
  });
  if (!res.ok) throw new Error(`RPC call failed: ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || 'RPC error');
  return json.result;
}

export async function zsaRpc(method, params = []) {
  return rpcCall('/api/zsa-rpc', method, params);
}

export async function crosslinkRpc(method, params = []) {
  return rpcCall('/api/crosslink-rpc', method, params);
}

export async function getBlockchainInfo(node = 'zsa') {
  const fn = node === 'zsa' ? zsaRpc : crosslinkRpc;
  return fn('getblockchaininfo');
}

export async function getBlock(hash, verbosity = 1, node = 'zsa') {
  const fn = node === 'zsa' ? zsaRpc : crosslinkRpc;
  return fn('getblock', [hash, verbosity]);
}

export async function getBlockHash(height, node = 'zsa') {
  const fn = node === 'zsa' ? zsaRpc : crosslinkRpc;
  return fn('getblockhash', [height]);
}

export async function getRawMempool(node = 'zsa') {
  const fn = node === 'zsa' ? zsaRpc : crosslinkRpc;
  return fn('getrawmempool');
}

export async function getInfo(node = 'zsa') {
  const fn = node === 'zsa' ? zsaRpc : crosslinkRpc;
  return fn('getinfo');
}

export async function fetchNodeInfo(node = 'zsa') {
  try {
    const info = await getBlockchainInfo(node);
    return {
      chain: info.chain || 'unknown',
      blocks: info.blocks || 0,
      headers: info.headers || 0,
      bestblockhash: info.bestblockhash || '',
      difficulty: info.difficulty || 0,
      upgrades: info.upgrades || {},
      consensus: info.consensus || {},
      commitments: info.commitments || 0,
      valuePools: info.valuePools || [],
    };
  } catch {
    return null;
  }
}
