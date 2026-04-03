#!/usr/bin/env bash
# scripts/stop.sh – Stop the grevy-lab stack (preserves volumes).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[grevy-lab] Stopping services …"
docker compose --profile zsa-tx down

echo "[grevy-lab] All containers stopped. Chain state volumes are intact."
echo "  To also delete chain-state volumes run:  docker compose down -v"
