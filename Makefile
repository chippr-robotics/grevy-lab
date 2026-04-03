# grevy-lab Makefile
# Convenience targets that wrap docker compose commands.

COMPOSE = docker compose
COMPOSE_FILE = docker-compose.yml

.PHONY: help up down restart logs logs-dashboard status pull clean

## Show this help message.
help:
	@grep -E '^[a-zA-Z_-]+:.*?##' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "  Profiles:"
	@echo "    make up-zsa-tx   – also start the ZSA transaction-generation tool"

## Bring all core services up (detached).
up:
	@cp -n .env.example .env 2>/dev/null || true
	$(COMPOSE) -f $(COMPOSE_FILE) up -d --remove-orphans

## Bring up all core services + the ZSA tx-tool profile.
up-zsa-tx:
	@cp -n .env.example .env 2>/dev/null || true
	$(COMPOSE) -f $(COMPOSE_FILE) --profile zsa-tx up -d --remove-orphans

## Stop and remove all containers (volumes are preserved).
down:
	$(COMPOSE) -f $(COMPOSE_FILE) --profile zsa-tx down

## Restart all services.
restart: down up

## Tail logs from all running services.
logs:
	$(COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100

## Tail ZSA-node logs.
logs-zsa:
	$(COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100 zsa-node

## Tail Crosslink-node logs.
logs-crosslink:
	$(COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100 crosslink-node

## Tail Dashboard logs.
logs-dashboard:
	$(COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100 dashboard

## Show running container status and health.
status:
	$(COMPOSE) -f $(COMPOSE_FILE) ps

## Pull the latest images without restarting.
pull:
	$(COMPOSE) -f $(COMPOSE_FILE) pull

## Remove all containers AND volumes (destructive – wipes chain state!).
clean:
	$(COMPOSE) -f $(COMPOSE_FILE) --profile zsa-tx down -v --remove-orphans
