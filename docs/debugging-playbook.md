# Debugging Playbook

Use this when an LLM needs to isolate and resolve issues in code, data pipelines, or complex prompts.

## 1. Symptom Snapshot
- What breaks? Include logs, error messages, or failing tests.
- When did the issue start and what changed recently?
- What is the current impact or blast radius?

## 2. Fast Reproduction
- Minimal steps or code snippet to reproduce.
- Environment details (runtime, dependencies, feature flags).
- Expected vs. actual behavior comparison.

## 3. Hypothesis Queue
- Brainstorm 3-5 plausible root causes.
- For each, note quick checks or experiments to falsify it.
- Prioritize by likelihood and ease of testing.

## 4. Investigation Log
1. Run the highest-priority check and record findings.
2. Update the hypothesis queue based on new evidence.
3. Repeat until one hypothesis is confirmed or all are exhausted.

## 5. Fix & Verification
- Proposed fix with rationale.
- Tests or validation steps to run immediately.
- Rollback or mitigation plan if the fix fails.

## 6. Follow-up Actions
- Monitoring or alerts to add.
- Documentation or incident report updates.
- Lessons learned to prevent recurrence.

---

## Defensive Coding Patterns

### API Response Handling

**Problem**: Backend returns `{ success, message, data }` but frontend expects raw data.

**Pattern**: Always unwrap AND default:
```typescript
const { data } = useQuery({
  queryFn: async () => {
    const response = await api.get('/endpoint');
    return response.data ?? [];  // Unwrap AND default
  }
});
```

**Anti-pattern**:
```typescript
// ❌ No unwrap - will fail
return response;

// ❌ No default - undefined if empty
return response.data;
```

### Mock Mode Coverage

**Problem**: Mock mode works in API client but real requests still fire from other locations.

**Pattern**: Check mock mode at every layer:
```typescript
// 1. API client
if (isMockMode) return mockData;

// 2. Zustand stores
if (isMockMode) return; // Skip API call

// 3. Page useEffects
if (isMockMode) return; // Skip fetch

// 4. Protected routes
if (isMockMode) return true; // Allow access

// 5. Redirect logic
if (isMockMode) return; // Don't redirect
```

### Environment Variable Propagation

**Problem**: Changed `NEXT_PUBLIC_*` var but app still uses old value.

**Pattern**: Force rebuild for Next.js env changes:
```bash
docker compose up -d --force-recreate --build frontend
```

**Why**: `NEXT_PUBLIC_*` vars are baked at build time, not runtime.

---

## Infrastructure Verification Commands

### Before Making Changes

```bash
# Check actual database version
docker exec <postgres-container> postgres --version

# Check actual env vars in container
docker exec <frontend-container> printenv | grep NEXT_PUBLIC

# Check proxy routing
docker logs <proxy-container> --tail 50
```

### Auth Flow Tracing

```bash
# Find all redirect locations in codebase
grep -r "redirect\|router.push\|window.location" frontend/

# Test each layer independently
curl http://localhost:8999/api/v1/auth/me          # Direct backend
curl -H "Host: app.localhost" http://localhost/api/v1/auth/me  # Through proxy
curl https://production.domain/api/v1/auth/me      # Full stack
```

### Contract Validation

```bash
# Find hand-written interfaces that might drift
grep -r "interface.*Response" frontend/ --include="*.ts" | grep -v api-generated

# Find fetches missing defensive defaults
grep -r "response\.data" frontend/ --include="*.ts" -A2 | grep -v "?? \[\]"
```

---

## Common Issue Patterns

### Infinite Redirect Loop

**Symptoms**: Page keeps reloading, browser shows redirect count error

**Hypothesis Queue**:
1. Multiple redirect triggers (middleware + page + component)
2. Auth state not persisting across redirects
3. Mock mode not checked before redirect logic

**Investigation**:
```bash
# Find all redirect locations
grep -rn "redirect\|router.push\|window.location" src/
```

### 401 Errors in Production Only

**Symptoms**: Works locally, fails in production

**Hypothesis Queue**:
1. Cookie not sent (SameSite, Secure, domain mismatch)
2. Proxy stripping auth headers
3. CORS blocking credentials

**Investigation**:
```bash
# Check response headers
curl -v https://production.domain/api/v1/auth/me 2>&1 | grep -i "set-cookie\|access-control"
```

### Data Undefined Errors

**Symptoms**: "Cannot read property X of undefined"

**Hypothesis Queue**:
1. API response not unwrapped (`response.data`)
2. Missing defensive default (`?? []`)
3. Loading state not handled

**Investigation**:
```typescript
// Add logging to identify the source
console.log('Raw response:', response);
console.log('Unwrapped data:', response?.data);
console.log('With default:', response?.data ?? []);
```

---

Keep the tone objective and evidence-driven so the model stays focused on facts instead of guesswork.
