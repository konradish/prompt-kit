# Claude Knowledge Architecture

Use this pattern when your CLAUDE.md grows beyond ~500 tokens or contains knowledge needed across multiple projects.

## Directory Structure

```
project-root/
├── CLAUDE.md                     # Lightweight entry point
├── .claude/
│   ├── guides/                   # Process & workflow knowledge
│   │   ├── deploying-cloudflare.md
│   │   ├── docker-compose.md
│   │   ├── git-workflow.md
│   │   ├── testing-patterns.md
│   │   └── debugging-strategies.md
│   ├── frameworks/               # Tech-specific patterns
│   │   ├── nextjs-patterns.md
│   │   ├── fastapi-patterns.md
│   │   └── react-patterns.md
│   ├── environments/             # Environment configs
│   │   ├── local-development.md
│   │   ├── staging-deployment.md
│   │   └── production-checklist.md
│   └── troubleshooting/          # Known issues & fixes
│       ├── common-errors.md
│       ├── dependency-issues.md
│       └── performance-problems.md
```

## Knowledge Categories

### guides/
**Process and workflow knowledge** that applies across environments.

Examples:
- Git branching strategies
- Testing approaches (unit, integration, e2e)
- Deployment checklists
- Code review patterns

### frameworks/
**Technology-specific patterns** tied to your stack.

Examples:
- Next.js routing conventions
- FastAPI dependency injection
- React state management patterns
- Django ORM best practices

### environments/
**Environment-specific configurations** and setup guides.

Examples:
- Local development setup
- Docker Compose patterns
- CI/CD pipeline configs
- Production deployment checklists

### troubleshooting/
**Known issues and their solutions** discovered during development.

Examples:
- Common build errors
- Dependency conflicts
- Performance bottlenecks
- Integration failures

## When to Modularize

**Keep in CLAUDE.md:**
- Project overview (< 200 tokens)
- Current phase/context
- Quick reference info
- Pointers to modules

**Move to modules:**
- Detailed procedures (> 100 tokens)
- Reusable patterns
- Framework-specific knowledge
- Historical troubleshooting notes

## Module Naming Convention

Use descriptive, action-oriented names:
- ✅ `deploying-cloudflare.md` (verb + noun)
- ✅ `testing-patterns.md` (domain + type)
- ❌ `cloudflare.md` (too generic)
- ❌ `info.md` (not descriptive)

## Benefits

**Token efficiency**: Load only relevant context per task
**Reusability**: Share modules across projects
**Maintainability**: Update once, apply everywhere
**Scalability**: Add knowledge without bloating CLAUDE.md

## Next Steps

1. Create `.claude/` directory structure
2. Extract content from CLAUDE.md into modules
3. Update CLAUDE.md to reference modules (see smart-claude-context-template.md)
4. Use module paths in prompts: `@.claude/guides/testing-patterns.md`
