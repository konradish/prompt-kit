# Claude Code Global Instructions

Global instructions for Claude Code across all projects. See `REFERENCE.md` for detailed tool documentation.

## General Best Practices

- Use `uv` and `uvx` for any Python actions
- Don't work around failures by using placeholders, ask the user first
- **Subshell PATH Issues**: Use absolute paths in `bash -c "..."` commands (aliases won't expand)
- **Park and Commit**: Include `.claude-sessions/*.md` park documents in commits
- **Docker Compose**: File is `compose.yaml` (not `docker-compose.yml`), in `infra/` directory

## Development Philosophy

- Prefer explicit over implicit
- Test-driven development for all features
- Progressive disclosure in documentation
- Security-first approach (tenant isolation, auth)

## No Untested Changes

**Every code change MUST be verified before considering it complete.**

### The Rule:
- Write or update tests BEFORE or WITH the change
- Run the relevant test suite after making changes
- If tests can't be created, explain why and get approval

### Verification Hierarchy:
1. Unit tests → Integration tests → E2E tests → Manual (document why)

### What Counts:
- Test suite passes (pytest, jest)
- Type checker passes (mypy, tsc)
- Linter passes (ruff, eslint)
- Build succeeds

### What Does NOT Count:
- "The code looks right" / "It should work" / "I'll test it later"

## Code Design Principles

**Core: Parameterize, don't hardcode. Configure, don't duplicate.**

1. **Parameterize variants** — `/get?format=csv` not `/getCSV`
2. **Config over conditionals** — Config objects, not `if (prod)` checks
3. **Check the ripple radius** — Minimize coupling
4. **Tell, Don't Ask** — Make objects do the work
5. **Containment test** — Can someone draw the hierarchy in 2 minutes?

### Anti-Patterns:
- Hardcoded URLs, credentials, magic numbers
- Copy-paste-modify instead of extracting
- Deep inheritance hierarchies when composition works

### Decision Heuristic:
**"How would someone change this in 6 months?"**
- Many files → decouple more
- Duplicate code → parameterize
- Change constant → externalize to config

## Plan Grounding Requirements

Before creating plans, verify:
1. **Runtime Context**: Where does this code run?
2. **Network Constraints**: What URLs/DNS are available?
3. **Failure Behavior**: Graceful degradation vs fail-fast?
4. **Problem Validation**: Is there an actual problem?
5. **Environment Parity**: Works in dev, staging, AND production?

**Red Flags**: Uniform runtime assumption, no failure handling, theoretical problems, untested refactors.

## Quality Standards

- CLAUDE.md: < 200 lines
- SKILL.md: < 500 lines
- REFERENCE.md: < 600 lines
- Use progressive disclosure pattern

## Parallelization Preferences

### Run in Parallel (No Dependencies):
- Validation checks (Ruff + ESLint + MyPy + pytest + jest)
- Feature development (backend + frontend + tests)
- Multi-environment testing
- Code exploration (multiple search patterns)

### Never Parallelize (Dependencies Exist):
- Sequential workflows (B needs A's output)
- Git operations (commits, pushes, merges)
- Database migrations (model → migration → apply → verify)
- Shared file edits

### Recognition Triggers:
- "check/validate/test/verify" → Run all checks in parallel
- "implement feature" → Ask about parallel backend + frontend + tests
- Different files/layers → Default to parallel

## Quick Tool Reference

| Tool | Trigger | Details |
|------|---------|---------|
| `nanogen` | Image generation | See REFERENCE.md |
| `bd` (Beads) | Issue tracking | See REFERENCE.md |
| Chrome automation | "win-chrome", "puppeteer" | See REFERENCE.md |

## Project-Specific Configurations

Add project-specific configurations below this line. See REFERENCE.md for examples (LiteLLM, deployment workflows).
