# Claude Code Global Instructions

This file contains global instructions that Claude Code will follow across all projects.

## General Best Practices

- Use `uv` and `uvx` for any Python actions
- Don't work around failures by using placeholders, ask the user first
- **Subshell PATH Issues**: When using commands that execute strings in a subshell (e.g., `bash -c "..."`, `asciinema rec -c "..."`), aliases from `.zshrc` or `.bashrc` will not be available. Always use the absolute path to executables inside these commands. Use `which <command>` to find the path before constructing the subshell command.
- **Park and Commit**: When user says "park and commit", always include the park document (`.claude-sessions/*.md`) in the commit along with code changes
- **Docker Compose**: File is named `compose.yaml` (not `docker-compose.yml`). Located in `infra/` directory.

## Development Philosophy

- Prefer explicit over implicit
- Test-driven development for all features
- Progressive disclosure in documentation
- Security-first approach (tenant isolation, auth)

## No Untested Changes

**Every code change MUST be verified before considering it complete.**

### The Rule:
- Write or update tests BEFORE or WITH the change, never after as an afterthought
- Run the relevant test suite after making changes
- If tests don't exist, create them; if they can't be created, explain why and get approval
- "It works on my machine" is not verification—automated tests are

### Verification Hierarchy:
1. **Unit tests** — For functions, classes, modules
2. **Integration tests** — For component interactions, API contracts
3. **E2E tests** — For critical user paths
4. **Manual verification** — Only when automated testing is impossible (document why)

### What Counts as Verification:
- ✅ Test suite passes (pytest, jest, etc.)
- ✅ Type checker passes (mypy, tsc)
- ✅ Linter passes (ruff, eslint)
- ✅ Build succeeds
- ✅ Specific manual check with documented steps and result

### What Does NOT Count:
- ❌ "The code looks right"
- ❌ "It should work"
- ❌ "I'll test it later"
- ❌ Assuming existing tests cover the change without running them

## Pragmatic Flexibility (Code Design)

**Core Principle: Parameterize, don't hardcode. Configure, don't duplicate.**

### When Implementing Features:

1. **Parameterize variants** — If tempted to create `/getCSV`, create `/get?format=csv` instead
2. **Config over conditionals** — Move environment-specific logic to config objects, not `if (prod)` checks
3. **Layers over views** — Don't duplicate pipelines; point shared layers at different sources, mux at aggregation
4. **Check the ripple radius** — When changing one thing, how many files must change? Minimize coupling
5. **Tell, Don't Ask** — Don't extract→transform→push back; make objects do the work

### When Handling Data:

- Externalize test fixtures and expected results (not inline in test code)
- Put policy (timeouts, thresholds, feature flags) in config; put invariants in code
- Validate at system boundaries; trust internal contracts
- No raw globals—if something must be global, wrap it in an API

### When Handling Errors:

- **Crash early** with clear messages > limp along in undefined state
- **Assert "impossible" conditions** explicitly—if you think "can't happen," check it
- Surface errors visibly; never swallow silently

### Anti-Patterns to Reject:

- ❌ Hardcoded URLs, credentials, magic numbers inline
- ❌ Copy-paste-modify instead of extracting the variable axis
- ❌ Relying on properties you can't control (phone numbers as IDs, external state assumptions)
- ❌ Leaving broken code "for now" without boarding up
- ❌ Chaining long method calls (`order.customer.address.city`)
- ❌ Deep inheritance hierarchies when composition works

### Decision Heuristic:

Before implementing, ask: **"How would someone change this in 6 months?"**
- If the answer involves touching many files → decouple more
- If the answer is "they'd duplicate this code" → parameterize the variant
- If the answer is "they'd change this constant" → externalize to config

## Plan Grounding Requirements

**Before creating implementation plans, verify environmental grounding:**

1. **Runtime Context**: Where does this code actually run? (Browser, Node.js, Edge Runtime, Cloudflare Workers, Docker container)
2. **Network Constraints**: What URLs/DNS are available? (Internal Docker DNS vs external, relative vs absolute paths)
3. **Failure Behavior**: What happens when things fail? (Graceful degradation vs fail-fast, user experience impact)
4. **Problem Validation**: Is there an actual problem to solve? (Don't optimize what isn't broken)
5. **Environment Parity**: Does the plan work in ALL deployment environments? (Local dev, staging, production)

**Red Flags** - Stop and reconsider if:
- Plan assumes uniform runtime across environments
- No consideration of how code behaves on failure
- Solving a theoretical problem without evidence it's real
- Major refactor without testing in production-like environment first

## Quality Standards

- CLAUDE.md files: < 200 lines
- SKILL.md files: < 500 lines
- REFERENCE.md files: < 600 lines
- Use progressive disclosure pattern

## Parallelization Preferences

**When encountering multiple independent tasks, ALWAYS prefer parallel execution:**

### ✅ Run in Parallel (No Dependencies):
- **Validation checks**: Ruff + ESLint + MyPy + pytest + jest simultaneously
- **Feature development**: backend + frontend + tests (different files/layers)
- **Multi-environment testing**: Local + production health checks concurrently
- **Documentation updates**: Multiple files in different directories
- **Code exploration**: Search multiple patterns simultaneously
- **Agent coordination**: Launch multiple Task tool calls in single message when independent

### ❌ Never Parallelize (Dependencies Exist):
- **Sequential workflows**: Steps where B needs output from A
- **Git operations**: Commits, pushes, merges (one at a time to avoid conflicts)
- **Database migrations**: model → migration → apply → verify (strict order)
- **Shared file edits**: Multiple operations on same file

### Implementation Pattern:
When possible, send multiple independent tool calls in a single message rather than waiting for each to complete sequentially.

### Recognition Triggers:
- User says "check", "validate", "test", "verify" → Run all checks in parallel
- User says "implement feature" → Ask: "Should I run backend + frontend + tests in parallel?"
- Tasks touch different files/layers → Default to parallel
- If uncertain about dependencies → Ask user before choosing parallel/sequential

## Project-Specific Configurations

Add your own project-specific configurations below. Examples:

### LiteLLM Server Configuration (Example)

```markdown
Self-hosted LiteLLM server at `http://localhost:4000`

**Available Models via LiteLLM:**
- **Local Ollama**: qwen2.5vl-7b, qwen3-30b-a3b
- **Anthropic**: claude-opus-4, claude-sonnet-4
- **Google**: gemini-2.5-flash, gemini-2.5-pro

**Usage:**
```python
from litellm import completion
response = completion(
    model="gemini-2.5-pro",
    messages=[{"role": "user", "content": "Hello"}],
    api_base="http://localhost:4000"
)
```

**Stack Management:**
- Start: `cd /path/to/project && docker compose up -d`
- Stop: `docker compose down`
- Logs: `docker compose logs -f litellm`
```

### Deployment Workflows (Example)

```markdown
**Deploy Methods:**

1. **GitHub Actions (Recommended):**
   ```bash
   gh workflow run deploy.yml
   gh run watch  # Monitor deployment
   ```

2. **Interactive Terminal:**
   ```bash
   npx wrangler deploy
   ```
```
