# prompt-kit

Reusable prompt components, eval fixtures, and style guides for conversational and tool-using agents. This repository is meant to be shared publicly and consumed either as a Python package or as a git submodule in downstream projects.

## Repository layout

- `prompts/` – canonical prompt definitions organized by role
  - `system/`, `task/`, `tools/`, `fragments/` – reusable prompt slices
  - `fixtures/` – red-team and regression examples to keep prompt diffs small
  - `evals/` – promptfoo or custom harness definitions
- `src/prompt_kit/` – lightweight Python utilities for loading and composing prompts
- `scripts/` – automation helpers (e.g., running evals locally)
- `tests/` – regression tests for loader utilities and prompt schema validation

## Front matter convention

Prompt files MUST start with YAML front matter so they stay diffable and machine-readable. A minimal example:

```md
---
id: summarize.v1
role: system
owner: core
risk: low
tests: [sum_short_english, refuse_pii]
---
You are a concise summarizer.
```

Use semantic version strings in `id` so downstream projects can pin exact prompt revisions. Keep few-shot examples in `prompts/fixtures/` and reference them from the main prompt via placeholders.

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
pytest
```

See `scripts/run-evals.sh` for an example promptfoo workflow.

## Packaging

This repo ships a tiny helper library to make it easy to consume prompts:

```python
from prompt_kit.loader import load_prompt
prompt = load_prompt("prompts/system/base-guardrails.md")
```

The loader returns both metadata and content so callers can enforce policy checks before using a prompt.

## Contributing

1. Run linting and tests (`pytest`).
2. Capture new red-team failures under `prompts/fixtures/`.
3. Document notable changes in `CHANGELOG.md` and bump semantic versions in front matter.

## License

Distributed under the MIT License. See `LICENSE` for details.
