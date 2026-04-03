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

get_env_port() {
  local var_name="$1"
  local default_value="$2"
  local line value
  line="$(grep -m1 -E "^${var_name}=" .env || true)"
  value="${line#*=}"
  if [[ -n "$value" && "$value" != "$line" ]]; then
    echo "$value"
  else
    echo "$default_value"
  fi
}

echo ""
echo "[grevy-lab] Stack is up. Service endpoints:"
echo "  Dashboard    → http://localhost:$(get_env_port DASHBOARD_PORT 8080)"
echo "  Grafana      → http://localhost:$(get_env_port GRAFANA_PORT 3000)"
echo "  Prometheus   → http://localhost:$(get_env_port PROMETHEUS_PORT 9090)"
echo "  ZSA node RPC → http://localhost:$(get_env_port ZSA_RPC_PORT 18232)"
echo "  Crosslink RPC→ http://localhost:$(get_env_port CROSSLINK_RPC_PORT 18242)"
echo ""
echo "  Default Grafana login: admin / grafana"
echo "  (Change GRAFANA_ADMIN_PASSWORD in .env before exposing to a network)"
