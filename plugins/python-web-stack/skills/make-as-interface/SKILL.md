---
name: make-as-interface
description: Make is the single CLI for all project operations - dev, test, deploy, migrate, everything
version: 1.1.0
triggers:
  - start the app
  - run locally
  - start development
  - run the backend
  - start server
  - docker compose
  - run python
  - start uvicorn
  - development server
  - run tests
  - pytest
  - deploy
  - migrate
  - database
  - build
  - lint
  - format
---

# Make as Project Interface

**Core principle: Make is the single CLI for the entire project.**

Every operation that could be a script should be a make target instead. This provides:
- Discoverability (`make help`)
- Consistency (same interface for dev, CI, deployment)
- Configuration encapsulation (env vars, paths, flags)
- Documentation (self-documenting targets)

## The Rule

**If you're about to run a raw command, check for a make target first.**

```bash
# FIRST: Check what's available
make help

# THEN: Use the target
make <operation>
```

## Operation Categories

### Development
```bash
make dev              # Start local environment
make stop             # Stop services
make down             # Stop and remove containers
make logs             # View logs (make logs SVC=backend)
make restart          # Restart service (make restart SVC=frontend)
make rebuild          # Rebuild and restart
make status           # Show service status
```

### Database
```bash
make migrate          # Run migrations (upgrade to head)
make migrate-down     # Rollback last migration
make migrate-new MSG="description"  # Create new migration
make migrate-status   # Show migration status
```

### Testing
```bash
make test             # Run all tests
make test-backend     # Backend tests only
make test-frontend    # Frontend tests only
make test-e2e         # End-to-end tests
```

### Validation & Linting
```bash
make validate         # Quick validation (<5s, pre-commit)
make validate-full    # Full validation (<2m, pre-push)
make validate-deep    # Deep validation (<5m, troubleshooting)
make lint             # Run all linters
make format           # Format code
```

### Deployment
```bash
make build            # Build Docker images
make build-push       # Build and push to registry
make deploy-production  # Full production deploy
make deploy-frontend  # Frontend only
make deploy-backend   # Backend only
```

### Type Generation
```bash
make generate-types   # Generate TypeScript from OpenAPI
make generate-openapi # Generate OpenAPI spec from FastAPI
```

### Shell Access
```bash
make shell-backend    # Shell into backend container
make shell-db         # psql into database
make shell-frontend   # Shell into frontend container
```

## Anti-Pattern Detection

| Raw Command | Make Target | Why Make is Better |
|-------------|-------------|-------------------|
| `docker compose up -d` | `make dev` | Includes project name, orphan cleanup, env setup |
| `uvicorn server:app --reload` | `make dev` | Misses container, DB, env vars |
| `pytest test/ -v` | `make test` | Misses test env setup, coverage flags |
| `alembic upgrade head` | `make migrate` | Misses directory, env activation |
| `cd backend && uv run ruff check .` | `make lint` | Misses full lint chain |
| `./scripts/deploy.sh` | `make deploy-*` | Scripts should be wrapped in make |
| `psql -U postgres` | `make shell-db` | Misses container context, credentials |

## When Creating New Operations

Before writing a script:
1. Add a Makefile target first
2. Script goes in `scripts/` if complex
3. Make target calls the script
4. Document with `## Comment` for `make help`

```makefile
my-operation: ## Description shown in make help
	./scripts/my-operation.sh
```

## Makefile Template

```makefile
# ============================================================================
# Project Makefile - Single Source of Truth for All Operations
# ============================================================================

.PHONY: help dev stop logs test validate deploy

# Configuration
COMPOSE_FILE := infra/compose.yaml
PROJECT := myproject

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

# Development
dev: ## Start local development
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT) up -d

stop: ## Stop services
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT) stop

logs: ## View logs (make logs SVC=backend)
	docker compose -f $(COMPOSE_FILE) -p $(PROJECT) logs -f $(SVC)

# Testing
test: ## Run all tests
	cd backend && uv run pytest tests/ -v

# Validation
validate: ## Quick validation
	cd backend && uv run ruff check . && uv run mypy .

# Database
migrate: ## Run migrations
	cd backend && uv run alembic upgrade head

# Deployment
deploy: ## Deploy to production
	./scripts/deploy.sh
```

## Validation Tiers

Projects should implement three validation levels:

| Level | Target | Time | When |
|-------|--------|------|------|
| Quick | `make validate` | <5s | Pre-commit, during dev |
| Full | `make validate-full` | <2m | Pre-push, PR |
| Deep | `make validate-deep` | <5m | Troubleshooting, releases |

**Quick**: Ruff lint + format, mypy (fast mode), import sorting
**Full**: Quick + pytest suite, ESLint, build verification
**Deep**: Full + E2E tests, coverage report, security scans

## Quick Diagnostic

When Claude suggests a raw command:
1. `ls Makefile` - Confirm Makefile exists
2. `make help` - See available targets
3. Use the target, or create one if missing
4. Update CLAUDE.md to reference make targets, not raw commands
