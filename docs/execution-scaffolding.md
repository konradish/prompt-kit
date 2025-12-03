# Execution Scaffolding

**Purpose:** Turn intentions into motion by making the next action mechanically obvious, time-boxed, and verifiable.

**Core Insight:** Clarity → compress into a **first mechanical step** → place it on the calendar → verify at the user seam.

---

## The Action Header

Paste this in every active task, ticket, or note:

```
Goal:
First mechanical action (≤5 min, no thinking):
When (calendar block):
Definition of done (user-seam test):
Main takeaway (1 sentence):
```

### Example: API Endpoint Implementation

```
Goal: Add /api/users/export endpoint
First mechanical action (≤5 min, no thinking): Create empty route file at src/routes/users/export.ts
When (calendar block): Today 2:00-2:30pm
Definition of done (user-seam test): curl localhost:3000/api/users/export returns JSON array
Main takeaway (1 sentence): Users can export their data as JSON for GDPR compliance.
```

### Example: Bug Investigation

```
Goal: Fix login timeout on slow connections
First mechanical action (≤5 min, no thinking): Add console.log timestamps to auth.ts lines 45-60
When (calendar block): Tomorrow 9:00am
Definition of done (user-seam test): Login completes in <5s on throttled connection (Chrome DevTools)
Main takeaway (1 sentence): Timeout was 10s, needs to be 30s for 3G users.
```

---

## Key Principles

1. **One objective now** — Reduce resistance by choosing a single current target
2. **Shrink to mechanical** — Define the smallest, boring, do-it-with-cold-hands step
3. **End-in-mind** — Backward-plan like a chef: plate → fire order → prep
4. **Surface the takeaway** — Every note exposes its main point at the top
5. **Verify at the seam** — Prefer acceptance-style checks (API/UI/user-visible)

---

## Integration with HTK

The Action Header maps directly to HTK components:

| Action Header Field | HTK Component |
|---------------------|---------------|
| Goal | HTK Goal |
| First mechanical action | Test → Change |
| Definition of done | Verify → Metric |
| Main takeaway | Kernel (after validation) |

**Workflow:**
1. Fill Action Header before starting any HTK
2. "First mechanical action" becomes the Test step
3. "Definition of done" becomes the Verify metric
4. After validation, compress learning into "Main takeaway"

---

## Practices

### 5-Minute Spin-Up
When stalled, set a 5-minute timer to perform *only* the mechanical step. No planning, no context-gathering—just the action.

### Chef Backplan (3 lines max)
Work backward from delivery:
```
Plate: User sees export button, clicks, downloads CSV
Fire order (T-30min): Wire up frontend button to endpoint
Prep: Create endpoint, add CSV serialization, write test
```

### Seam Check Snippet
Pick one verification method and commit to it before starting:
- Postman request saved
- UI click-path recorded
- CLI example in README
- Jest/pytest assertion

### Daily Sync
During daily standup or morning review:
1. Update the Action Header for today's focus
2. Drag the calendar block if needed
3. If no Action Header exists, create one before starting

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Vague goal** | "Improve performance" has no exit | Add metric: "P95 latency < 200ms" |
| **Large first step** | "Set up the database" is too big | Shrink: "Run `docker compose up db`" |
| **No calendar block** | Work expands to fill available time | Timebox: 25-min Pomodoro |
| **Internal-only verification** | "Tests pass" but user can't see it | Add user-seam test: "Curl returns 200" |
| **Missing takeaway** | Can't remember why you did this | Write one sentence before moving on |

---

## Success Indicators

- You can point to **one** active Goal at any time
- ≥80% of goals have a filled Action Header and a scheduled block
- Tasks start in ≤2 minutes (no searching for context)
- Demos/tests at the user seam exist for each deliverable

---

## Quick Reference

**When stuck, ask:**
> "What's the smallest executable first step I can take right now?"

**When done, ask:**
> "What's the one-sentence takeaway I'll need in 6 months?"

**When reviewing, ask:**
> "Does this have a user-seam verification, or just internal checks?"

---

## Related Documents

- [focus-htk.md](./focus-htk.md) — HTK methodology for hypothesis testing
- [project-kickoff.md](./project-kickoff.md) — Task framing and constraints
- [debugging-playbook.md](./debugging-playbook.md) — Issue isolation workflow

---

*Source: Execution Scaffolding pattern from personal knowledge management system*
