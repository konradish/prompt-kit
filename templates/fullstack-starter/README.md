# Fullstack Starter Template

A minimal Claude Code configuration for fullstack projects (Next.js + Python/FastAPI typical).

## Usage

1. Copy `.claude/CLAUDE.md` to your project's `.claude/` directory
2. Fill in the Day-0 Pre-Flight Checklist before writing code
3. Update the project-specific sections with your stack choices

## What's Included

**CLAUDE.md** (~150 lines) contains:
- Day-0 pre-flight checklist to prevent common rework
- Mandatory behaviors for auth, API, and infrastructure changes
- Critical warnings extracted from real project retrospectives

## Why This Exists

Analysis of a 50-commit fullstack project showed 36% of commits were fixes that could have been prevented with upfront decisions. The most expensive rework categories:

| Category | Commits Saved | Time Saved |
|----------|---------------|------------|
| Auth flow issues | 5 | ~6 hours |
| API contract mismatches | 4 | ~3 hours |
| Infrastructure confusion | 3 | ~4 hours |
| UI architecture changes | 8 | ~8 hours |

This template captures those learnings as a checklist.

## Customization

The template is intentionally minimal. Add project-specific sections for:
- Your specific tech stack patterns
- Team conventions and standards
- Domain-specific workflows

See `docs/project-kickoff.md` for the full pre-flight checklist with more detail.
