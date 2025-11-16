# Claude Code Global Instructions

This file contains global instructions that Claude Code will follow across all projects.

## General Best Practices

- Use `uv` and `uvx` for any Python actions
- Don't work around failures by using placeholders, ask the user first
- **Subshell PATH Issues**: When using commands that execute strings in a subshell (e.g., `bash -c "..."`, `asciinema rec -c "..."`), aliases from `.zshrc` or `.bashrc` will not be available. Always use the absolute path to executables inside these commands. Use `which <command>` to find the path before constructing the subshell command.

## Development Philosophy

- Prefer explicit over implicit
- Test-driven development for all features
- Progressive disclosure in documentation
- Security-first approach (tenant isolation, auth)

## Quality Standards

- CLAUDE.md files: < 100 lines
- SKILL.md files: < 500 lines
- REFERENCE.md files: < 600 lines
- Use progressive disclosure pattern

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
