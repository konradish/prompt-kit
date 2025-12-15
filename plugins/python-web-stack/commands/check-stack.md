---
description: Verify project follows python-web-stack patterns
---

# Check Stack Command

Verify this project follows python-web-stack patterns.

## Steps

1. **Check for Makefile**
   ```bash
   ls Makefile
   ```
   If missing: "This project needs a Makefile. Create one with `make dev`, `make validate`, `make logs` targets."

2. **Check for compose.yaml**
   ```bash
   ls compose.yaml infra/compose.yaml 2>/dev/null
   ```
   If missing: "No compose.yaml found. The stack should be containerized."

3. **Check Makefile has required targets**
   ```bash
   grep -E '^(dev|validate|logs|status):' Makefile
   ```
   Report which targets are present/missing.

4. **Check for raw Python/Docker anti-patterns in CLAUDE.md**
   ```bash
   grep -E '(python -m|uvicorn|docker compose up|docker-compose)' CLAUDE.md 2>/dev/null
   ```
   If found: "CLAUDE.md contains raw commands - should reference make targets instead."

5. **Report findings**

   Format as checklist:
   - [x] Makefile present
   - [x] compose.yaml present
   - [ ] Missing `make validate` target
   - etc.

6. **Suggest fixes** for any missing elements.
