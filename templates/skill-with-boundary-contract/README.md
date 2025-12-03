# Skill with Boundary Contract Template

A structured skill template that combines Claude Code skills with explicit boundary contracts for reliable, verifiable execution.

## What's a Boundary Contract?

A boundary contract explicitly defines:
- **Inputs**: What the skill accepts (types, constraints, examples)
- **Outputs**: What the skill produces (format, location, schema)
- **Invariants**: Constraints that must hold (pre/post conditions, runtime limits)

This shifts from "describe & assume" to "declare & verify."

## When to Use This Template

Use this template when your skill:
- Has well-defined inputs and outputs
- Requires validation before/after execution
- Chains with other skills or agents
- Needs reproducible, testable behavior

## Template Structure

```
skill-with-boundary-contract/
├── SKILL.md           # Core workflow with boundary contract (< 500 lines)
├── REFERENCE.md       # Detailed specs, examples, troubleshooting (< 600 lines)
├── templates/         # Reusable artifacts (optional)
│   ├── input.schema.json
│   └── output.schema.json
└── README.md          # This file
```

## Quick Start

1. Copy this folder to your project:
   ```bash
   cp -r templates/skill-with-boundary-contract .claude/skills/your-skill-name
   ```

2. Edit SKILL.md frontmatter:
   ```yaml
   ---
   name: your-skill-name
   description: Your description with trigger keywords.
   applies_to: ["your", "domains"]
   inputs: ["your_input_types"]
   outputs: ["your_output_types"]
   validation: ["your_constraints"]
   ---
   ```

3. Fill in the Boundary Contract section with your specific schema

4. Update the Workflow steps for your use case

5. Add examples and troubleshooting to REFERENCE.md

## Key Concepts

### Three-Phase Workflow

Every skill follows:
1. **Validate Inputs** — Check against boundary contract before starting
2. **Execute Core Logic** — The actual work
3. **Verify Outputs** — Confirm outputs match declared schema

### User-Seam Testing

Verification should happen at the "user seam" — the point where a user or external system observes the result:
- API returns expected response
- File appears in expected location
- UI shows expected state

### Escalation Paths

Skills should know their limits. Define when to escalate to:
- Human review (ambiguous cases)
- Agent delegation (complex judgment)
- Error handling (recovery procedures)

## Frontmatter Reference

| Field | Purpose | Example |
|-------|---------|---------|
| `name` | Unique identifier | `database-migrator` |
| `description` | Trigger keywords, 1024 char max | `Triggers on "migrate", "schema"` |
| `applies_to` | Domain tags | `["database", "sql"]` |
| `inputs` | Input types | `["migration_file", "config"]` |
| `outputs` | Output types | `["migration_log", "schema_diff"]` |
| `validation` | Key constraints | `["max_file_size: 10MB"]` |
| `depends_on` | Other skills needed | `["schema-validator"]` |
| `allowed-tools` | Tool restrictions | `Read, Edit, Bash` |

## Integration with HTK

Boundary contracts integrate naturally with HTK (Hypothesis → Test Kernel):

| Boundary Contract | HTK Component |
|-------------------|---------------|
| Input validation | Preconditions for test |
| Core execution | The "Change" |
| Output verification | The "Verify → Metric" |
| Invariants | Pass/fail criteria |

## Example Skills Using This Pattern

- Database migration runner
- API contract validator
- Documentation sync checker
- Code quality gate
- Deployment pre-flight check

## Related Documents

- [claude-code-best-practices.md](../../docs/claude-code-best-practices.md) — Skills vs agents
- [focus-htk.md](../../docs/focus-htk.md) — HTK methodology
- [execution-scaffolding.md](../../docs/execution-scaffolding.md) — Action headers

---

*Based on Boundary Contract Skill Integration pattern*
