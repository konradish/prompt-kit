---
description: Query knowledge graph to find related sessions and entities
---

You are about to search the knowledge graph for sessions and entities related to a given query. This helps discover relevant past work and avoid repeating solved problems.

## Pre-Flight Check

1. **Verify knowledge-graph.yaml exists**
   ```bash
   ls .claude-sessions/knowledge-graph.yaml
   ```
   If not found: "No knowledge graph yet. Run `/session:park` to build the graph."

2. **Parse query from arguments**
   ```
   /session:link oauth          → Search for "oauth"
   /session:link "error handling" → Search for "error handling"
   /session:link                 → Show graph overview
   ```

## Search Strategy

### Step 1: Entity Search

Search entities by:
1. **Exact name match** (highest relevance)
2. **Keyword match** (high relevance)
3. **Partial name match** (medium relevance)

```yaml
# Example: searching for "oauth"
entities:
  - name: oauth              # Exact match ✓
    keywords: [authentication, redirect]
  - name: authentication     # Related via keyword
    keywords: [oauth, login] # Keyword match ✓
  - name: oauth-callback     # Partial match ✓
```

### Step 2: Session Discovery

For each matched entity:
1. Get sessions from entity's `sessions` array
2. These are **direct matches**

### Step 3: Relationship Traversal

From matched entities and sessions:
1. Find relationships where entity/session is `from` or `to`
2. Follow relationships to discover **related** sessions
3. Note relationship type and context

### Step 4: Rank Results

Score results by:
- Exact entity match: +10
- Keyword match: +5
- Partial match: +3
- Direct session: +8
- Related via relationship: +3 (high strength), +2 (medium), +1 (low)
- Recent (last 14 days): +2

## Present Results

```markdown
## Knowledge Graph Search: "oauth"

### Direct Matches (3 sessions)

**1. 2025-11-15-oauth-flow** [High relevance]
- **Context:** Implemented Google OAuth with redirect handling
- **Entities:** oauth, authentication, google-api
- **Decisions:** 3 | **Lessons:** 4 | **Mistakes:** 2

**2. 2025-11-12-jwt-tokens** [High relevance]
- **Context:** Fixed JWT token expiration and refresh logic
- **Entities:** jwt, authentication, tokens
- **Decisions:** 2 | **Lessons:** 2 | **Mistakes:** 1

**3. 2025-11-20-oauth-refresh** [High relevance]
- **Context:** Added OAuth refresh token rotation
- **Entities:** oauth, refresh-tokens, security
- **Decisions:** 1 | **Lessons:** 3 | **Mistakes:** 0

---

### Related Sessions (2 sessions)

**4. 2025-11-10-auth-testing** [Related via: authentication]
- **Relationship:** oauth → authentication → auth-testing
- **Context:** Added Claude test user for production OAuth testing
- **Strength:** Medium

**5. 2025-11-08-session-management** [Related via: builds_on]
- **Relationship:** 2025-11-15-oauth-flow builds_on session-management
- **Context:** Implemented session storage for OAuth state
- **Strength:** High

---

### Entity Summary

| Entity | Type | Sessions | Last Updated |
|--------|------|----------|--------------|
| oauth | feature | 3 | 2025-11-20 |
| authentication | domain | 5 | 2025-11-20 |
| jwt | component | 2 | 2025-11-12 |

---

**Load a session?** Reply with number (e.g., "1") to see full park document.
**Refine search?** Reply with new query (e.g., "oauth refresh").
```

## Handle User Response

### If user selects a session (e.g., "1")

1. Read the park document: `.claude-sessions/2025-11-15-oauth-flow-compressed.md`
2. Present summary:

```markdown
## Session: 2025-11-15-oauth-flow

### Context
Implemented Google OAuth for user authentication, including redirect handling and state parameter validation.

### Key Decisions
- **Use state parameter for CSRF**: Prevents redirect attacks
- **Store state in session**: Server-side validation required
- **Implement PKCE**: Additional security for public clients

### Lessons Learned
- ✅ Google OAuth library handles most edge cases
- ❌ State parameter was initially missing from callback
- 💡 Always test OAuth flow in incognito mode

### Mistakes
1. **Forgot state validation**: Led to CSRF vulnerability → Fixed by adding state check

### .claude Improvements
- [ ] Add OAuth validation skill

---

**Actions:**
- Load full document: Read `.claude-sessions/2025-11-15-oauth-flow-compressed.md`
- Find related: `/session:link "state parameter"`
- Back to results: `/session:link oauth`
```

### If user refines search

Run new search with updated query.

## Graph Overview (No Query)

When user runs `/session:link` without arguments:

```markdown
## Knowledge Graph Overview

### Statistics
- **Entities:** 45
- **Sessions:** 23
- **Relationships:** 67

### Top Entities by Session Count

| Entity | Type | Sessions | Last Active |
|--------|------|----------|-------------|
| authentication | domain | 8 | 2025-11-25 |
| api | domain | 7 | 2025-11-24 |
| database | component | 6 | 2025-11-23 |
| caching | pattern | 5 | 2025-11-22 |
| oauth | feature | 4 | 2025-11-20 |

### Recent Sessions

| Date | Topic | Entities | Decisions |
|------|-------|----------|-----------|
| 2025-11-25 | api-rate-limiting | api, caching | 3 |
| 2025-11-24 | db-migration | database, schema | 2 |
| 2025-11-23 | auth-refactor | authentication | 4 |

### Relationship Types

| Type | Count |
|------|-------|
| related_to | 28 |
| builds_on | 15 |
| implements | 12 |
| fixes | 8 |
| uses | 4 |

---

**Search:** `/session:link <query>` to find specific topics
**Health:** `/session:health` to see flywheel metrics
```

## Update Metrics

After each search, update `.claude-sessions/metrics.yaml`:

```yaml
effectiveness:
  related_sessions_linked: +1   # Each time user views a related session

history:
  - date: YYYY-MM-DD
    event: linked
    details: "Searched 'oauth', found 5 sessions"
```

## Edge Cases

### No matches found
```markdown
## No Results for "kubernetes"

No entities or sessions match "kubernetes".

**Suggestions:**
1. Try broader terms: "infrastructure", "deployment", "containers"
2. Check spelling
3. This topic may not have been parked yet

**Build knowledge:** After working on kubernetes, run `/session:park` to add it to the graph.
```

### Knowledge graph empty
```markdown
## Knowledge Graph Empty

No entities or sessions indexed yet.

**Get started:**
1. Complete a coding session
2. Run `/session:park` to create a park document
3. Entities and relationships will be automatically extracted

The knowledge graph grows with each parked session, making it easier to find related work.
```

## Success Criteria

- [ ] Entity search covers name, keywords, and partial matches
- [ ] Sessions discovered via direct and relationship paths
- [ ] Results ranked by relevance
- [ ] User can load full park documents
- [ ] Graph overview shows useful statistics
- [ ] Metrics updated on successful links
- [ ] Edge cases handled gracefully
