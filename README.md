# Prompt Kit

A library of reusable LLM templates and Claude Code configuration for systematic development. Includes a fullstack starter template, HTK (Hypothesis → Test Kernel) workflow, and a learning flywheel that captures lessons across sessions.

## Quick Start

### 1. Setup Global Configuration

```bash
# Clone the repo
git clone https://github.com/youruser/prompt-kit.git
cd prompt-kit

# Run setup (symlinks ~/.claude → claude-config/)
./setup-claude-config.sh
```

This gives you global access to:
- HTK workflow commands (`/htk/plan`, `/htk/run-next`, etc.)
- Session management (`/session:park`, `/session:remind`, etc.)
- Environment utilities (`/scan-env`, `/env-troubleshoot`)

### 2. Use in Any Project

The commands and skills now work in any project. Just open Claude Code and use them.

---

## What's Inside

| Directory | Purpose |
|-----------|---------|
| `templates/fullstack-starter/` | Copy to new projects - pre-flight checklist prevents common rework |
| `docs/` | Reference templates for planning, debugging, architecture |
| `claude-config/` | Global skills and commands (symlinked to `~/.claude`) |
| `.claude-sessions/` | Park documents from this repo's development |

---

## Usage Scenarios

Each scenario below includes a **prompt you can copy** to have Claude do the work for you.

---

### Scenario 1: Create a New Project

**What you do:** Copy the starter template and tell Claude to set it up.

```bash
# Create your project
mkdir my-new-app && cd my-new-app
git init
mkdir -p .claude

# Copy the starter template
cp /path/to/prompt-kit/templates/fullstack-starter/.claude/CLAUDE.md .claude/CLAUDE.md
```

**Then give Claude this prompt:**

```
I just copied the fullstack-starter template to .claude/CLAUDE.md

My project is a [describe your app - e.g., "task management app with team collaboration"].

Tech stack I want to use:
- Frontend: [Next.js / React / Vue]
- Backend: [FastAPI / Express / Rails]
- Database: [PostgreSQL / MySQL / MongoDB]
- Auth: [Google OAuth / JWT / Magic Link]

Please:
1. Read the CLAUDE.md template
2. Fill in all the checklist items with my choices
3. Fill in the Tech Stack section
4. Update the project name
5. Add any project-specific warnings based on my stack choices

Don't start building yet - just configure the CLAUDE.md so we have guardrails before coding.
```

**What Claude does:**
- Reads the template
- Fills in all checkboxes with your choices
- Adds stack-specific warnings (e.g., "Next.js App Router uses server components by default")
- Commits the configured CLAUDE.md

---

### Scenario 2: Plan a Complex Feature

**What you do:** Describe what you want to build and ask for an HTK pipeline.

**Prompt:**

```
I need to add [describe feature - e.g., "real-time collaborative editing"] to my app.

Constraints:
- [e.g., "Must work through our existing Traefik proxy"]
- [e.g., "Budget: $200/month for infrastructure"]
- [e.g., "Timeline: 2 weeks"]

Create an HTK pipeline for this. For each HTK:
1. What it proves (one sentence)
2. Why it's sequenced where it is
3. The specific test that determines pass/fail
4. Rollback plan if it fails

Then start executing the first HTK - create the branch, make the changes, and run the test.
```

**What Claude does:**
- Creates a pipeline like:
  ```
  # NORTH STAR
  Outcome: Real-time collab with 10 concurrent editors, <200ms sync

  # PIPELINE (WIP=1)
  1. websocket-poc — Prove WebSocket connects through Traefik
  2. ot-algorithm — Prove operational transforms sync correctly
  3. cursor-presence — Prove cursor positions sync
  4. load-test — Prove 10 concurrent editors work
  ```
- Creates branch `htk/websocket-poc/20251128-v1`
- Implements the minimal proof-of-concept
- Runs the test and reports pass/fail
- Commits with `HTK:websocket-poc — PASS/FAIL — <results>`

---

### Scenario 3: Retrofit an Existing Project

**What you do:** Point Claude at your existing project and ask it to audit and configure.

**Prompt:**

```
This is an existing project that doesn't have a .claude/CLAUDE.md yet.

Please:
1. Explore the codebase to understand the current architecture
2. Create .claude/CLAUDE.md based on the fullstack-starter template
3. Fill in the checklist with what ALREADY EXISTS (not decisions to make)
4. Mark items with ⚠️ where current implementation differs from best practices
5. Create an HTK pipeline to address the top 3 issues you find

Focus areas to audit:
- API response handling (are there defensive defaults?)
- Auth flow (is it documented? mock mode?)
- Type safety (generated or manual?)
- Environment variable handling
```

**What Claude does:**
- Scans the codebase structure
- Reads key files (package.json, API routes, auth logic)
- Creates CLAUDE.md documenting current state:
  ```markdown
  ### API Contract
  - [x] Response envelope: { data: T } (⚠️ no success/message fields)
  - [x] Error format: varies by endpoint (⚠️ inconsistent)
  - [x] Type generation: Manual (⚠️ drift risk)
  - [ ] Defensive defaults: NOT IMPLEMENTED
  ```
- Proposes improvement HTKs:
  ```
  1. defensive-defaults — Add ?? [] to all hooks. Quick fix, high impact.
  2. response-envelope — Standardize { success, message, data }. Contract clarity.
  3. type-generation — Add OpenAPI pipeline. Prevent drift.
  ```

---

### Scenario 4: Debug a Tricky Issue

**What you do:** Describe the bug and ask Claude to use the debugging playbook.

**Prompt:**

```
I'm getting [describe issue - e.g., "infinite redirect loop on the login page"].

It started [when - e.g., "after I added the OAuth callback"].

Environment:
- [e.g., "Works locally, fails in production"]
- [e.g., "Only happens when not logged in"]

Use the debugging playbook approach:
1. Create a hypothesis queue (3-5 possible causes)
2. Run the investigation commands from the playbook
3. For each hypothesis, run a quick check to confirm/eliminate it
4. Once you find the root cause, propose a fix with rollback plan
```

**What Claude does:**
- Creates hypothesis queue:
  ```
  1. Multiple redirect triggers (middleware + page + component)
  2. OAuth state param not matching
  3. Cookie not sent (SameSite/Secure mismatch)
  ```
- Runs investigation commands:
  ```bash
  grep -rn "redirect\|router.push\|window.location" src/
  curl -v https://production.domain/api/auth/me 2>&1 | grep -i "set-cookie"
  ```
- Reports findings and proposes fix with HTK structure

---

### Scenario 5: Maintain the Learning Flywheel

**What you do:** Use these prompts at key moments.

#### End of Session: Park

```
park and commit
```

Claude creates a park document capturing:
- Decisions made
- Lessons learned
- Mistakes and how to prevent them
- Action items for .claude improvements

#### Start of Session: Review

```
What lessons are due for review? And are there any overdue action items?
```

Claude runs `/session:remind` and `/session:health` to surface:
- Lessons scheduled for spaced repetition
- Overdue improvements from past sessions
- Related past sessions for current work

#### Weekly: Apply Improvements

```
Let's process the action items from recent park documents.
Read the last 3 park documents and implement any .claude improvements that are still pending.
```

Claude:
- Reads recent park documents
- Extracts pending action items
- Creates/updates skills, commands, or CLAUDE.md
- Commits the improvements

#### Finding Related Work

```
I'm about to work on [topic - e.g., "authentication"].
What related sessions exist? Load any relevant context.
```

Claude searches the knowledge graph and surfaces:
- Related park documents
- Key lessons from past work
- Patterns that worked/failed

---

## Command Reference

These commands are available globally after setup:

| Command | Purpose |
|---------|---------|
| `/htk/plan` | Create HTK pipeline for a goal |
| `/htk/run-next` | Execute the next HTK in pipeline |
| `/htk/summarize` | Roll up completed HTKs |
| `/session:park` | Compress session to park document |
| `/session:remind` | Surface due lessons |
| `/session:link <query>` | Find related sessions |
| `/session:health` | View flywheel metrics |
| `/session:apply` | Process .claude improvements |
| `/scan-env` | Scan environment |
| `/env-troubleshoot` | Debug environment issues |

---

## File Size Standards

All documentation follows progressive disclosure:

| File | Max Lines | Purpose |
|------|-----------|---------|
| CLAUDE.md | 200 | Quick reference, always loaded |
| SKILL.md | 500 | Core workflow, loaded on trigger |
| REFERENCE.md | 600 | Detailed specs, loaded on demand |

---

## Setup Details

### What Gets Symlinked

Running `./setup-claude-config.sh`:
- Backs up existing `~/.claude` to `~/.claude.backup.<timestamp>`
- Creates symlink: `~/.claude` → `claude-config/`
- Migrates runtime files

### What's Version Controlled

- `CLAUDE.md` - Global instructions
- `skills/` - HTK workflow, session management
- `commands/` - All slash commands

### What's Gitignored

- `settings.json`, `settings.local.json`
- Runtime files (history, todos, sessions)
- Credentials

### Reverting

```bash
rm ~/.claude
mv ~/.claude.backup.<timestamp> ~/.claude
```

---

## Contributing

1. Keep templates concise (see file size standards)
2. Test patterns via HTK before documenting
3. Park sessions to capture learnings
4. Run `/session:apply` to process improvements

---

## License

MIT - See LICENSE file.
