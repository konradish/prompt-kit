# Smart CLAUDE.md Template

Build lightweight CLAUDE.md files that guide Claude to load only relevant context for each task.

## Template

```markdown
# Project Context: {{project_name}}

## Quick Reference
- **Type**: {{project_type}}
- **Stack**: {{tech_stack}}
- **Current Phase**: {{project_phase}}
- **Key Directories**: {{important_paths}}

## Available Knowledge Modules

When working on specific tasks, read the relevant guides below:

### Deployment & Infrastructure
- @.claude/guides/deploying-cloudflare.md - Cloudflare Pages/Workers deployment
- @.claude/guides/docker-compose.md - Container orchestration patterns
- @.claude/environments/production-checklist.md - Pre-deployment verification

### Development Workflows
- @.claude/guides/git-workflow.md - Branch strategies and commit patterns
- @.claude/guides/testing-patterns.md - Unit, integration, e2e testing
- @.claude/frameworks/{{primary_framework}}-patterns.md - Framework-specific practices

### Troubleshooting
- @.claude/troubleshooting/common-errors.md - Frequent issues and solutions
- @.claude/guides/debugging-strategies.md - Systematic debugging approaches

## Context Selection Guide

**Tell me what you're trying to accomplish before starting, and I'll load the right modules.**

### Task → Module Mapping

| Task Intent | Read These Modules |
|-------------|-------------------|
| Deploy to Cloudflare | @.claude/guides/deploying-cloudflare.md |
| Set up local environment | @.claude/guides/docker-compose.md<br>@.claude/environments/local-development.md |
| Debug API errors | @.claude/troubleshooting/common-errors.md<br>@.claude/guides/debugging-strategies.md |
| Write tests | @.claude/guides/testing-patterns.md<br>@.claude/frameworks/{{framework}}-patterns.md |
| Review code | @.claude/guides/git-workflow.md |

## Development Commands

{{common_commands}}

---

*This CLAUDE.md uses modular knowledge architecture. See @.claude/guides/ for detailed patterns.*
```

## Usage Instructions

1. **Copy template above** into your project's CLAUDE.md
2. **Replace placeholders**:
   - `{{project_name}}` → Your project name
   - `{{project_type}}` → web app / API / CLI tool / library
   - `{{tech_stack}}` → Next.js + FastAPI + PostgreSQL
   - `{{project_phase}}` → MVP / Beta / Production
   - `{{important_paths}}` → src/, api/, tests/
   - `{{primary_framework}}` → nextjs / fastapi / django
   - `{{common_commands}}` → npm run dev, pytest, etc.

3. **Update module paths** to match your .claude/ structure
4. **Add task mappings** specific to your project

## Benefits

**Selective loading**: Claude reads only what's needed for the current task
**Token efficiency**: Main CLAUDE.md stays under 500 tokens
**Clear guidance**: Explicit mapping from tasks to knowledge
**Self-service**: Users can suggest modules before starting work

## Tips

- Keep Quick Reference under 100 tokens
- List 8-12 key modules (not everything)
- Update task mappings as patterns emerge
- Add common commands to reduce repeated questions

## Example

```markdown
# Project Context: API Gateway

## Quick Reference
- **Type**: REST API Gateway
- **Stack**: FastAPI + PostgreSQL + Redis
- **Current Phase**: Beta
- **Key Directories**: src/api/, src/models/, tests/

## Available Knowledge Modules

### Deployment & Infrastructure
- @.claude/guides/deploying-railway.md - Railway deployment workflow
- @.claude/environments/production-checklist.md - Pre-release verification

### Development Workflows
- @.claude/guides/testing-patterns.md - API testing with pytest
- @.claude/frameworks/fastapi-patterns.md - Route organization & dependencies

### Troubleshooting
- @.claude/troubleshooting/database-migrations.md - Alembic migration issues
- @.claude/troubleshooting/redis-connection.md - Redis connectivity fixes

## Context Selection Guide

| Task Intent | Read These Modules |
|-------------|-------------------|
| Deploy to Railway | @.claude/guides/deploying-railway.md |
| Fix migration issue | @.claude/troubleshooting/database-migrations.md |
| Add new endpoint | @.claude/frameworks/fastapi-patterns.md |
```
