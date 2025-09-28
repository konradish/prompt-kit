# Prompts directory

Each prompt file starts with YAML front matter describing metadata, ownership, and testing expectations. The body is plain Markdown so prompts can be linted and rendered in pipelines.

## Folder structure

- `system/` – guardrails and high-level behavior definitions.
- `task/` – reusable instructions for recurring tasks (summaries, triage, etc.).
- `tools/` – tool-call framing, argument schemas, and affordances for agent tool use.
- `fragments/` – smaller reusable pieces (e.g., tone modifiers).
- `fixtures/` – red-team conversations, regression examples, and few-shot datasets.
- `evals/` – promptfoo/test harness definitions that exercise the prompts.

## Naming

Use kebab-case filenames (e.g., `base-guardrails.md`). For fragments, prefix with the area they support (e.g., `summarize-tone-friendly.md`).

## Metadata contract

| Field | Description |
| --- | --- |
| `id` | Semantic identifier (`name.vMajor.Minor`). |
| `role` | One of `system`, `user`, `assistant`, or `tool`. |
| `owner` | Team or individual responsible for the prompt. |
| `risk` | One of `low`, `medium`, `high`; informs review rigor. |
| `tests` | Array of eval IDs that must pass before release. |
| `tags` | Optional keywords for search and grouping. |

See `templates/prompt-front-matter.md` for a starting point.
