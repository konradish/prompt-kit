# Project Kickoff Planning

Use this template when scoping a new request for an LLM so you capture constraints, success criteria, and hazards before generating detailed output.

## 1. Quick Summary
- What is the user asking for?
- Why does it matter or what is the intended impact?

## 2. Inputs Available
- Link or paste the primary source material or specs.
- Note any missing context or ambiguous requirements.
- Call out non-text assets (spreadsheets, diagrams) and how to reference them.

## 3. Constraints
- Hard deadlines or response length limits.
- Policies the answer must obey (security, privacy, tone).
- Tooling limitations (offline mode, languages/frameworks allowed).

## 4. Success Criteria
- Required deliverables (files, summaries, action items).
- Objective checks (tests must pass, reviewers to notify, metrics to improve).
- Subjective qualities (clarity, empathy, authority, simplicity).

## 5. Plan of Attack
1. Break work into discreet steps.
2. Assign owner or agent role for each step if applicable.
3. List checkpoints to validate progress early.

## 6. Risks & Mitigations
- Potential blockers or unknowns.
- Early warning signs to watch for.
- Fallback options or manual steps if automation fails.

## 7. Communication Cadence
- How often to share updates and in what format.
- Stakeholders who must be looped in.
- Handoff notes or follow-up tasks after completion.

---

## Day-0 Pre-Flight Checklist

**Complete these items before writing code to prevent common rework patterns.**

### Auth Decision Tree
- [ ] Auth method chosen: OAuth / JWT / Magic Link / Session
- [ ] Token storage decided: httpOnly cookies / localStorage
- [ ] Mock mode required? If yes, define skip points
- [ ] Full auth path documented (Browser → Proxy → App → Backend → OAuth Provider)

### API Contract
- [ ] Response envelope defined: `{ success: boolean, message: string, data: T }`
- [ ] Error format standardized: `{ success: false, message: string, error_code: string }`
- [ ] Type generation configured: OpenAPI → TypeScript pipeline
- [ ] Defensive defaults: All arrays default to `[]`, all objects default to `{}`

### Frontend Patterns
- [ ] Data fetching approach: React Query / SWR / custom hooks
- [ ] UI state management: Zustand / Context / Redux
- [ ] Form handling: React Hook Form + Zod / Formik
- [ ] Styling approach: Tailwind / CSS Modules / Styled Components
- [ ] Dark mode: supported from day 1? If yes, configure theme system

### Infrastructure Locks
- [ ] Database version recorded (do NOT change without migration plan)
- [ ] Reverse proxy configured: Traefik / Nginx / Cloudflare
- [ ] All `NEXT_PUBLIC_*` vars in compose.yaml (baked at build time)
- [ ] Tunnel/domain configuration documented

### Environment Parity
- [ ] Local dev environment matches production structure
- [ ] All environment variables documented in `.env.template`
- [ ] Docker compose tested with fresh clone

---

## Common Rework Triggers (Watch For These)

**Auth Issues:**
- Infinite redirect loops → Check for redirect logic in multiple locations
- 401 errors → Verify token propagation through all layers
- Mock mode bugs → Ensure mock checks at EVERY layer (API client, stores, routes)

**API Contract Issues:**
- `undefined` errors → Response data not unwrapped properly
- "Cannot read property of undefined" → Missing defensive defaults
- Type mismatches → Hand-written interfaces drifting from backend

**Infrastructure Issues:**
- Env var changes not taking effect → Docker needs rebuild (`--force-recreate --build`)
- Database version mismatch → Check container version vs compose.yaml
- 502/503 errors → Check proxy routing and container health

---

Fill this out quickly (5-10 minutes) before diving deeper. The pre-flight checklist prevents the most common sources of rework in fullstack projects.
