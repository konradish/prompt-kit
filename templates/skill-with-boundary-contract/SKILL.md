---
name: your-skill-name
description: Brief description with trigger keywords. Triggers on "keyword1", "keyword2". Max 1024 chars.
applies_to: ["domain1", "domain2"]
inputs: ["input_type1", "input_type2"]
outputs: ["output_type1"]
validation: ["constraint1", "constraint2"]
depends_on: []
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
---

# Skill Name

## Purpose

[1-2 sentences describing what this skill accomplishes and when to use it]

## Containment Map

```
┌─────────────────────────────────────┐
│ [Parent System/Context]             │
│  ┌───────────────────────────────┐  │
│  │ This Skill                    │  │
│  │  ┌─────────┐  ┌─────────────┐ │  │
│  │  │ Input   │→ │ Core Logic  │ │  │
│  │  └─────────┘  └──────┬──────┘ │  │
│  │                      ↓        │  │
│  │               ┌─────────────┐ │  │
│  │               │ Output      │ │  │
│  │               └─────────────┘ │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**2-Minute Test:** Can a newcomer draw this from your description? If not, simplify.

## Trigger Cues

Activate when user mentions:
- "keyword1", "keyword2", "keyword3"
- [Describe the situation/context that triggers this skill]

## Boundary Contract

```yaml
# What this skill accepts
inputs:
  - name: input1
    type: string
    required: true
    description: Brief description

# What this skill produces
outputs:
  - name: output1
    type: file
    location: path/to/output
    description: Brief description

# Constraints that must hold
invariants:
  - "Constraint 1: e.g., max file size"
  - "Constraint 2: e.g., required format"
```

## Workflow

### 1. Validate Inputs
- [ ] Check all required inputs present
- [ ] Verify input constraints (see Boundary Contract)
- [ ] If validation fails, report specific issue and stop

### 2. Execute Core Logic
- [ ] Step 1: [Brief instruction]
- [ ] Step 2: [Brief instruction, link to REFERENCE.md for details]
- [ ] Step 3: [Brief instruction]

### 3. Verify Outputs
- [ ] Output matches expected format
- [ ] All invariants satisfied
- [ ] User-seam test passes (see Success Checklist)

## Success Checklist

- [ ] All inputs validated against boundary contract
- [ ] Core workflow completed without errors
- [ ] Output matches declared output type
- [ ] User-visible verification (API call, UI check, file exists)

## Escalation

Escalate to human or agent when:
- Input validation fails repeatedly
- Core logic encounters unexpected state
- Output verification fails

## Quick Reference

**Before starting:** Validate inputs against boundary contract
**After completing:** Run user-seam test from Success Checklist
**If stuck:** Check REFERENCE.md for detailed specifications

See [REFERENCE.md](./REFERENCE.md) for complete specifications and examples.
