---
name: wsl-docker-gotchas
description: Common WSL + Docker pitfalls and solutions
version: 1.0.0
triggers:
  - wsl
  - docker
  - network
  - can't connect
  - connection refused
  - 172.
  - shebang
  - uv run
  - build-time
  - NEXT_PUBLIC
  - environment variable
---

# WSL + Docker Gotchas Skill

Auto-activates when working with WSL networking, Docker builds, or environment variables.

## 1. WSL Networking

### The Problem
WSL has internal IPs (172.25.x.x) that are not accessible from Windows or LAN.

### The Rule
**Always use LAN hostname or IP, never WSL internal IP.**

```bash
# WRONG
curl http://172.25.240.1:8999  # WSL internal - won't work from Windows

# CORRECT
curl http://koni9.lan:8999    # LAN hostname
curl http://192.168.1.174:8999  # LAN IP
```

### How to Find Correct Address
```bash
# From WSL - get Windows host IP
ip route show default | awk '{print $3}'

# Or use hostname
hostname -I | awk '{print $1}'
```

### In Docker Compose
```yaml
# Use host network or explicit ports
services:
  backend:
    ports:
      - "8999:8000"  # Accessible from LAN
```

## 2. Docker Shebang in uv Projects

### The Problem
When building Docker images with uv, Python scripts get WSL paths baked into shebangs:
```
#!/mnt/c/projects/myapp/.venv/bin/python  # BROKEN in container
```

### The Rule
**Always use `uv run` in Dockerfiles, never direct script execution.**

```dockerfile
# WRONG
CMD ["python", "app.py"]
CMD ["./scripts/migrate.sh"]

# CORRECT
CMD ["uv", "run", "python", "app.py"]
CMD ["uv", "run", "alembic", "upgrade", "head"]
```

### Why
`uv run` uses the correct Python from the container's virtual environment, ignoring baked shebangs.

## 3. Build-Time Environment Variables

### The Problem
`NEXT_PUBLIC_*` variables in Next.js are baked at build time, not runtime.

### The Rule
**Rebuild after changing NEXT_PUBLIC_* variables.**

```bash
# Changing NEXT_PUBLIC_API_URL requires rebuild
docker compose up -d --force-recreate --build frontend
```

### Pattern for Runtime Config
```javascript
// Use API route for runtime config instead of NEXT_PUBLIC_*
// pages/api/config.js
export default function handler(req, res) {
  res.json({ apiUrl: process.env.API_URL })
}
```

## 4. Docker DNS Resolution

### The Problem
Some runtimes (Next.js Edge, Cloudflare Workers) can't resolve Docker service names.

### The Rule
**Use explicit hostnames or host.docker.internal for cross-container calls.**

```yaml
# docker-compose.yaml
services:
  frontend:
    environment:
      - BACKEND_URL=http://backend:8000  # Works in Node.js
      # But for Edge runtime:
      - BACKEND_URL=http://host.docker.internal:8999
```

## 5. File Permissions

### The Problem
Files created in WSL may have wrong permissions for Docker.

### Fix
```bash
# In WSL
chmod 755 scripts/*.sh

# Or in Dockerfile
RUN chmod +x /app/scripts/*.sh
```

## Quick Diagnostic Checklist

When something "works in WSL but not in Docker" or vice versa:

1. **Network issue?** Check if using 172.x.x.x (wrong) vs LAN IP (right)
2. **Shebang issue?** Check if script has WSL path, use `uv run`
3. **Build-time var?** Check if NEXT_PUBLIC_*, rebuild if changed
4. **DNS issue?** Check if Edge runtime trying to resolve Docker service name
5. **Permission issue?** Check file modes, especially for scripts
