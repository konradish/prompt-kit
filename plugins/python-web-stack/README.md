# Python Web Stack Plugin

Extracted patterns from SchoolBrain development - the rutter for your next Python web voyage.

## What This Plugin Does

When installed, Claude Code automatically applies these patterns:

1. **Make as Interface** - Make is the single CLI for all operations (dev, test, deploy, migrate)
2. **Validation Pyramid** - Quick/Full/Deep testing strategy
3. **WSL + Docker Gotchas** - Avoids common networking and build pitfalls

## Installation

```bash
# Add the prompt-kit marketplace (one-time)
/plugin marketplace add konradish/prompt-kit

# Install this plugin
/plugin install python-web-stack@prompt-kit

# Restart Claude Code
```

## Skills Included

| Skill | Triggers When |
|-------|---------------|
| `make-as-interface` | Running commands, starting servers, testing, deploying, migrating (includes validation tiers) |
| `wsl-docker-gotchas` | Network issues, Docker builds, env vars |

## Core Principle: Make is the Project CLI

**Every operation uses Make. No raw commands.**

```bash
# Check what's available
make help

# Development
make dev              # Not: docker compose up
make logs             # Not: docker compose logs
make restart SVC=backend

# Testing
make test             # Not: pytest test/
make validate         # Not: ruff check . && mypy .

# Database
make migrate          # Not: alembic upgrade head
make migrate-new MSG="add users"

# Deployment
make deploy-production # Not: ./scripts/deploy.sh
make build-push       # Not: docker build && docker push
```

## Anti-Patterns This Plugin Catches

| If Claude Suggests | Plugin Redirects To |
|-------------------|---------------------|
| `uvicorn server:app` | `make dev` |
| `docker compose up -d` | `make dev` |
| `pytest test/ -v` | `make test` |
| `alembic upgrade head` | `make migrate` |
| `./scripts/deploy.sh` | `make deploy-*` |
| `psql -U postgres` | `make shell-db` |

## Project Setup Checklist

For new projects to work with this plugin:

- [ ] `Makefile` at project root with `help` target
- [ ] `compose.yaml` (not `docker-compose.yml`) in `infra/` or root
- [ ] Make targets for: `dev`, `stop`, `logs`, `test`, `validate`, `migrate`
- [ ] CLAUDE.md references make targets, not raw commands

## Makefile Starter

```makefile
.PHONY: help dev stop logs test validate migrate

COMPOSE_FILE := infra/compose.yaml
PROJECT := myproject

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

dev: ## Start local development
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT) up -d

stop: ## Stop services
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT) stop

logs: ## View logs (make logs SVC=backend)
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT) logs -f $(SVC)

test: ## Run tests
	cd backend && uv run pytest tests/ -v

validate: ## Quick validation
	cd backend && uv run ruff check . && uv run mypy .

migrate: ## Run database migrations
	cd backend && uv run alembic upgrade head
```

## Origins

Patterns extracted from [SchoolBrain](https://github.com/konradish/schoolbrain-app) after learning the hard way. This plugin is the "rutter" - extracted wisdom for the next voyage.

See: [Blog Post - Rutters for Your Tooling](#) (coming soon)
