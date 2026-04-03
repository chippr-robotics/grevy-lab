You are managing the **grevy-lab** Zcash feature-chain lab stack.
The stack is defined in `docker-compose.yml` at the repository root and
controlled via `Makefile` targets and `scripts/`.

Your task is to carry out the action described by the user's argument: **$ARGUMENTS**

---

## Available operations

Interpret the user's argument and perform the most appropriate action from
the categories below.  Run the commands in your shell tool; do not just
describe what to do.

### Administrative

| Intent | Command |
|--------|---------|
| Start all core services | `make up` |
| Start core + ZSA tx-tool | `make up-zsa-tx` |
| Stop all services (keep volumes) | `make down` |
| Restart all services | `make restart` |
| Pull latest images | `make pull` |

### Monitoring & status

| Intent | Command |
|--------|---------|
| Full container status | `make status` |
| Tail all logs | `make logs` |
| Tail ZSA-node logs | `make logs-zsa` |
| Tail Crosslink-node logs | `make logs-crosslink` |
| Check Prometheus health | `curl -sf http://localhost:9090/-/healthy` |
| Check Grafana health | `curl -sf http://localhost:3000/api/health` |
| ZSA node metrics snapshot | `curl -sf http://localhost:9999/metrics \| head -60` |
| Crosslink node metrics snapshot | `curl -sf http://localhost:9998/metrics \| head -60` |
| Node-exporter metrics snapshot | `curl -sf http://localhost:9100/metrics \| head -40` |
| Query Prometheus instant value | `curl -sG http://localhost:9090/api/v1/query --data-urlencode 'query=<METRIC>'` |

### Maintenance

| Intent | Command |
|--------|---------|
| Destroy stack + wipe chain-state volumes | `make clean` |
| Reload Prometheus config (live) | `curl -sf -X POST http://localhost:9090/-/reload` |
| Restart a single service | `docker compose restart <service>` |
| View running container resource usage | `docker stats --no-stream` |
| Inspect a container's environment | `docker inspect <container> --format '{{json .Config.Env}}'` |

### Configuration

| Intent | Action |
|--------|--------|
| Change any setting | Edit `.env` (copy from `.env.example` if missing) and run `make restart` |
| Switch Crosslink image | Set `CROSSLINK_NODE_IMAGE=shieldedlabs/zebra-crosslink:latest` in `.env` then `docker compose up -d --no-deps crosslink-node` |
| Switch ZSA image | Set `ZSA_NODE_IMAGE=<image>` in `.env` then `docker compose up -d --no-deps zsa-node` |

---

## Service inventory

| Service | Container | Default ports |
|---------|-----------|---------------|
| `zsa-node` | `zsa-node` | 18233 (P2P), 18232 (RPC), 9999 (metrics) |
| `crosslink-node` | `crosslink-node` | 18243 (P2P), 18242 (RPC), 9998 (metrics) |
| `zsa-tx-tool` | `zsa-tx-tool` | — (profile: `zsa-tx`) |
| `prometheus` | `prometheus` | 9090 |
| `grafana` | `grafana` | 3000 |
| `node-exporter` | `node-exporter` | 9100 |

All services run on the internal Docker bridge network **`zcash-lab`**.

---

## Key Prometheus metrics

| Metric | Description |
|--------|-------------|
| `zcash_consensus_best_tip_height` | Best chain-tip block height |
| `zcash_state_committed_block_height` | Last committed (finalized) height |
| `zcash_network_peers` | Peer count (by kind) |
| `zcash_mempool_transactions` | Unconfirmed transactions in mempool |
| `zcash_sync_percent` | Chain sync progress (0–100) |

---

## Rules

1. Always run from the repository root so that `make` and `docker compose`
   commands resolve correctly.
2. If `.env` does not exist, run `cp .env.example .env` first.
3. When the user asks for "status", run both `make status` and the
   endpoint health checks.
4. When the user asks for logs without specifying a service, run
   `make logs` (which follows all services).
5. Never delete volumes unless the user explicitly says to wipe or
   reset chain state.
6. After any destructive operation (`clean`, `down -v`) confirm with
   the user before executing.
7. When displaying metrics output, filter to the most relevant lines
   unless the user requests the full output.
