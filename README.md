# grevy-lab

A lab for testing Zcash feature chains — **ZSA (Zcash Shielded Assets)** and
**Crosslink (hybrid PoW/PoS consensus)** — orchestrated with Docker Compose and
monitored through a Prometheus + Grafana stack.

---

## Architecture

```mermaid
graph TD
    subgraph host["Host machine"]
        subgraph net["Docker network: zcash-lab"]
            zsa["zsa-node\nzebrad · Testnet\n:18233 P2P · :18232 RPC · :9999 metrics"]
            cross["crosslink-node\nzebrad / zebra-crosslink · Testnet\n:18243 P2P · :18242 RPC · :9998 metrics"]
            tx["zsa-tx-tool\n(profile: zsa-tx)"]
            ne["node-exporter\nhost metrics · :9100"]
            prom["Prometheus\nscrapes /metrics every 15 s\n:9090"]
            graf["Grafana\nZcash Feature Chain Overview\n:3000"]
        end
    end

    zsa -->|metrics| prom
    cross -->|metrics| prom
    ne -->|metrics| prom
    prom -->|datasource| graf
    tx -->|RPC :18232| zsa
```

| Service          | Description                                              | Default port(s)         |
|------------------|----------------------------------------------------------|-------------------------|
| `zsa-node`       | Zebra node on Testnet for ZSA (ZIP 226/227) testing      | 18233, 18232, 9999      |
| `crosslink-node` | Zebra node for Crosslink hybrid PoW/PoS experiments      | 18243, 18242, 9998      |
| `zsa-tx-tool`    | QEDIT ZSA transaction tool (optional profile `zsa-tx`)   | –                       |
| `prometheus`     | Metrics collection, 30-day retention                     | 9090                    |
| `grafana`        | Dashboards — "Zcash Feature Chain Overview"              | 3000                    |
| `node-exporter`  | Host-level CPU / memory / network metrics                | 9100                    |

---

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) ≥ 24 with the Compose plugin
- `curl` (used by health checks and `scripts/status.sh`)

### 1 – Clone and configure

```bash
git clone https://github.com/chippr-robotics/grevy-lab.git
cd grevy-lab
cp .env.example .env          # review and adjust as needed
```

> **Important:** change `GRAFANA_ADMIN_PASSWORD` in `.env` before exposing
> Grafana to a network.

### 2 – Start the stack

```bash
# Using the helper script:
./scripts/start.sh

# Or via make:
make up

# Or directly:
docker compose up -d
```

### 3 – Open Grafana

Navigate to <http://localhost:3000> and sign in with the credentials set in
`.env` (default: `admin` / `grafana`).

The **Zcash Feature Chain Overview** dashboard is pre-provisioned under the
*Zcash Lab* folder and auto-refreshes every 30 seconds.

### 4 – Check status

```bash
./scripts/status.sh   # or: make status
```

### 5 – Stop the stack

```bash
./scripts/stop.sh    # stops containers, keeps chain-state volumes
make clean           # stops containers AND deletes volumes (resets chain state)
```

---

## Claude Code `/grevy` command

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) slash command is
provided at `.claude/commands/grevy.md`.  When working inside this repo with
Claude Code, type `/grevy <action>` to let the agent perform administrative,
monitoring, or maintenance tasks on the stack — for example:

```
/grevy status
/grevy up
/grevy logs zsa-node
/grevy restart crosslink-node
/grevy query zcash_consensus_best_tip_height
/grevy clean
```

The command description covers all service names, ports, Makefile targets, and
key Prometheus metrics so the agent can act immediately without further
exploration.

---

## Switching to the Crosslink-specific image

The `crosslink-node` service defaults to `zfnd/zebra:latest`.  Once the
`shieldedlabs/zebra-crosslink` image is published, switch to it by editing
`.env`:

```dotenv
CROSSLINK_NODE_IMAGE=shieldedlabs/zebra-crosslink:latest
```

Then restart the node:

```bash
docker compose up -d --no-deps crosslink-node
```

To build the image locally from the source repo:

```bash
git clone https://github.com/ShieldedLabs/zebra-crosslink.git
cd zebra-crosslink
docker build -f docker/Dockerfile --target runtime -t zebra-crosslink:local .
# In .env:  CROSSLINK_NODE_IMAGE=zebra-crosslink:local
```

---

## Using the ZSA Transaction Tool

The ZSA tx-tool (QEDIT) is gated behind a Docker Compose
[profile](https://docs.docker.com/compose/profiles/) so it does not start by
default.

```bash
# Start core stack + tx-tool:
make up-zsa-tx

# Or directly:
docker compose --profile zsa-tx up -d
```

The tool targets `zsa-node:18232` via the internal `zcash-lab` network.
Configure its behaviour through environment variables in `.env` (see
`.env.example` for the full list).

---

## Repository Layout

```
grevy-lab/
├── docker-compose.yml              # Orchestration – all services
├── Makefile                        # Convenience targets
├── .env.example                    # Environment variable template
├── .claude/
│   └── commands/
│       └── grevy.md                # Claude Code /grevy slash command
├── nodes/
│   ├── zsa-node/
│   │   └── zebrad.toml             # Zebra config for ZSA testnet node
│   └── crosslink-node/
│       └── zebrad.toml             # Zebra config for Crosslink testnet node
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml          # Prometheus scrape configuration
│   └── grafana/
│       ├── provisioning/
│       │   ├── datasources/
│       │   │   └── prometheus.yml  # Auto-provisioned Prometheus datasource
│       │   └── dashboards/
│       │       └── dashboards.yml  # Dashboard file-provider config
│       └── dashboards/
│           └── zcash-overview.json # Pre-built Grafana dashboard
└── scripts/
    ├── start.sh                    # Pull images and bring stack up
    ├── stop.sh                     # Stop stack (preserves volumes)
    └── status.sh                   # Health-check all endpoints
```

---

## Key Metrics

Zebra exposes these Prometheus metrics (among others) at `/metrics`:

| Metric                                | Description                         |
|---------------------------------------|-------------------------------------|
| `zcash_consensus_best_tip_height`     | Best chain-tip block height         |
| `zcash_state_committed_block_height`  | Last committed (finalized) height   |
| `zcash_network_peers`                 | Peer count (by kind)                |
| `zcash_mempool_transactions`          | Unconfirmed transactions in mempool |
| `zcash_sync_percent`                  | Chain sync progress (0–100)         |

The Grafana dashboard includes panels for all of the above, plus a side-by-side
comparison of ZSA and Crosslink node heights and host-level CPU/memory/network
metrics from node-exporter.

---

## References

- [Zebra Docker guide](https://zebra.zfnd.org/user/docker.html)
- [Zebra Metrics guide](https://zebra.zfnd.org/user/metrics.html)
- [Zebra Crosslink Book](https://shieldedlabs.github.io/zebra-crosslink/)
- [ZSA (ZIP 226)](https://zips.z.cash/zip-0226) – Asset Issuance
- [ZSA (ZIP 227)](https://zips.z.cash/zip-0227) – Burn Mechanism
- [ShieldedLabs/zebra-crosslink](https://github.com/ShieldedLabs/zebra-crosslink)
- [QEDIT ZSA testnet updates](https://forum.zcashcommunity.com/t/grant-update-zcash-shielded-assets-monthly-updates/41153)

---

## License

Apache 2.0 – see [LICENSE](LICENSE).
