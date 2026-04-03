#!/usr/bin/env bash
# scripts/status.sh – Show the current health of all grevy-lab containers.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "=== Container Status ==="
docker compose ps

echo ""
echo "=== Metrics Endpoints ==="

check_endpoint() {
  local name="$1"
  local url="$2"
  if curl -sf --max-time 5 "$url" > /dev/null 2>&1; then
    echo "  [OK]    $name  →  $url"
  else
    echo "  [DOWN]  $name  →  $url"
  fi
}

source .env 2>/dev/null || true

check_endpoint "ZSA node metrics"      "http://localhost:${ZSA_METRICS_PORT:-9999}/metrics"
check_endpoint "Crosslink node metrics" "http://localhost:${CROSSLINK_METRICS_PORT:-9998}/metrics"
check_endpoint "Prometheus"            "http://localhost:${PROMETHEUS_PORT:-9090}/-/healthy"
check_endpoint "Grafana"               "http://localhost:${GRAFANA_PORT:-3000}/api/health"
check_endpoint "Node Exporter"         "http://localhost:${NODE_EXPORTER_PORT:-9100}/metrics"
check_endpoint "Dashboard"             "http://localhost:${DASHBOARD_PORT:-8080}/healthz"
