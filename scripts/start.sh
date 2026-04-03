#!/usr/bin/env bash
# scripts/start.sh – Start the grevy-lab stack.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Bootstrap .env from example if it does not exist yet.
if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "[grevy-lab] Created .env from .env.example – review and customise as needed."
fi

echo "[grevy-lab] Pulling latest images …"
docker compose pull --quiet

echo "[grevy-lab] Starting services …"
docker compose up -d --remove-orphans

echo ""
echo "[grevy-lab] Stack is up. Service endpoints:"
echo "  Grafana      → http://localhost:$(grep -E '^GRAFANA_PORT' .env | cut -d= -f2 || echo 3000)"
echo "  Prometheus   → http://localhost:$(grep -E '^PROMETHEUS_PORT' .env | cut -d= -f2 || echo 9090)"
echo "  ZSA node RPC → http://localhost:$(grep -E '^ZSA_RPC_PORT' .env | cut -d= -f2 || echo 18232)"
echo "  Crosslink RPC→ http://localhost:$(grep -E '^CROSSLINK_RPC_PORT' .env | cut -d= -f2 || echo 18242)"
echo ""
echo "  Default Grafana login: admin / grafana"
echo "  (Change GRAFANA_ADMIN_PASSWORD in .env before exposing to a network)"
