# [Project Name] Development

## Day-0 Pre-Flight Checklist

**Complete ALL items before writing code:**

### Auth Decision Tree
- [ ] Auth method: [Google OAuth / JWT / Magic Link / Session]
- [ ] Token storage: [httpOnly cookies / localStorage]
- [ ] Mock mode required? [Yes/No] → If yes, document skip points
- [ ] Full auth path documented in `docs/AUTH_FLOW.md`

### API Contract
- [ ] Response envelope: `{ success: boolean, message: string, data: T }`
- [ ] Error format: `{ success: false, message: string, error_code: string }`
- [ ] Type generation: [OpenAPI → TypeScript / tRPC / manual]
- [ ] Defensive defaults: All arrays → `[]`, all objects → `{}`

### Frontend Patterns
- [ ] Data fetching: [React Query / SWR / custom]
- [ ] UI state: [Zustand / Context / Redux]
- [ ] Forms: [React Hook Form + Zod / Formik]
- [ ] Styling: [Tailwind / CSS Modules / Styled Components]
- [ ] Dark mode: [Yes, from day 1 / No / Later]

### Infrastructure Locks
- [ ] Database: PostgreSQL ___ (version LOCKED)
- [ ] Reverse proxy: [Traefik / Nginx / Cloudflare]
- [ ] All `NEXT_PUBLIC_*` vars in compose.yaml
- [ ] Tunnel/domain config documented

---

## Mandatory Behaviors

### Before Auth Changes
1. Document current auth flow first
2. Verify mock mode at EVERY layer (API client, stores, routes, redirects)
3. `grep -r "redirect\|router.push\|window.location"` to find all redirect points

### Before Infrastructure Changes
1. Check existing versions: `docker exec <container> <version_cmd>`
2. Verify env propagation: `docker exec <container> printenv | grep <var>`
3. Read config files BEFORE editing

### Before API Changes
1. Update OpenAPI spec FIRST (if using)
2. Regenerate frontend types
3. Verify hooks unwrap `response.data` AND have defaults (`?? []`)

---

## Critical Warnings

### Docker Environment Variables
`NEXT_PUBLIC_*` vars are baked at build time. After changes:
```bash
docker compose up -d --force-recreate --build frontend
```

### API Response Unwrapping
All endpoints return `{ success, message, data }`. React Query hooks MUST:
```typescript
const { data } = useQuery({
  queryFn: async () => {
    const response = await api.get('/endpoint');
    return response.data ?? [];  // Unwrap AND default
  }
});
```

### Mock Mode Coverage
When mock mode is enabled, verify at ALL layers:
- [ ] API client skips real requests
- [ ] Zustand stores check before API calls
- [ ] Page useEffects check before fetching
- [ ] ProtectedRoute allows access
- [ ] Redirect logic respects flag

---

## Tech Stack

<!-- Fill in your choices -->

**Frontend**:
**Backend**:
**Database**:
**Auth**:
**Deployment**:

---

## Commands

```bash
make dev              # Start local development
make validate         # Quick validation
make test             # Run test suite
```

---

## Project Structure

```
├── frontend/         # Next.js app
├── backend/          # FastAPI/Python
├── infra/            # Docker compose, configs
├── specs/            # API specs, boundaries
└── docs/             # Documentation
```
