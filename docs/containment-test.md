# Containment Test

**Purpose:** Validate that your abstractions are intuitive by checking if a newcomer can draw the part-whole hierarchy in 2 minutes.

**Core Insight:** Good structure mirrors how the body organizes experience — parts contained within wholes, smaller nested inside larger. If you can't "point to where this lives" the way you can point to your foot, the abstraction fights cognition.

---

## The 2-Minute Exercise

1. Hand someone your skill/doc/system description
2. Give them 2 minutes and blank paper
3. Ask: "Draw what contains what"

### Pass Criteria
- They can draw boxes-in-boxes showing containment
- They know where to "point" to find each part
- No circular arrows or "it depends" confusion

### Fail Signals
- "Wait, does X contain Y or does Y contain X?"
- Drawing arrows in multiple directions
- Needing to ask clarifying questions
- Taking longer than 2 minutes

---

## ASCII Templates

Copy the template that matches your structure. Fill in the boxes.

### Template 1: Simple Skill/Function

```
┌────────────────────────────────┐
│ Context/System                 │
│  ┌──────────────────────────┐  │
│  │ Your Skill/Function      │  │
│  │  Input → Process → Output│  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

### Template 2: Skill with Sub-components

```
┌─────────────────────────────────────┐
│ Parent System                       │
│  ┌───────────────────────────────┐  │
│  │ Your Skill                    │  │
│  │  ┌─────────┐  ┌─────────────┐ │  │
│  │  │ Phase 1 │→ │ Phase 2     │ │  │
│  │  └─────────┘  └──────┬──────┘ │  │
│  │                      ↓        │  │
│  │               ┌─────────────┐ │  │
│  │               │ Phase 3     │ │  │
│  │               └─────────────┘ │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Template 3: Multi-Layer System

```
┌──────────────────────────────────────────┐
│ Outer Context (e.g., Project)            │
│  ┌────────────────────────────────────┐  │
│  │ Middle Layer (e.g., Feature)       │  │
│  │  ┌──────────────┐ ┌──────────────┐ │  │
│  │  │ Component A  │ │ Component B  │ │  │
│  │  │  ┌────────┐  │ │  ┌────────┐  │ │  │
│  │  │  │ Part 1 │  │ │  │ Part 1 │  │ │  │
│  │  │  │ Part 2 │  │ │  │ Part 2 │  │ │  │
│  │  │  └────────┘  │ │  └────────┘  │ │  │
│  │  └──────────────┘ └──────────────┘ │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Template 4: Pipeline/Flow

```
┌─────────────────────────────────────────────────┐
│ System                                          │
│                                                 │
│  ┌───────┐    ┌───────┐    ┌───────┐           │
│  │ Stage │ → │ Stage │ → │ Stage │ → Output   │
│  │   1   │    │   2   │    │   3   │           │
│  └───────┘    └───────┘    └───────┘           │
│      ↑                                          │
│   Input                                         │
└─────────────────────────────────────────────────┘
```

### Template 5: Config Hierarchy (Claude Code)

```
┌────────────────────────────────────────────┐
│ Claude Code Session                        │
│  ┌──────────────────────────────────────┐  │
│  │ ~/.claude/ (Global)                  │  │
│  │  • CLAUDE.md                         │  │
│  │  • commands/                         │  │
│  │  • skills/                           │  │
│  └──────────────────────────────────────┘  │
│           ↓ overridden by                  │
│  ┌──────────────────────────────────────┐  │
│  │ .claude/ (Project)                   │  │
│  │  • CLAUDE.md                         │  │
│  │  • commands/                         │  │
│  │  • skills/                           │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

---

## When the Test Fails

If a newcomer can't draw your hierarchy in 2 minutes, apply these fixes:

### Fix 1: Flatten Unnecessary Nesting

**Before (too deep):**
```
System → Module → Submodule → Component → Part → Detail
```

**After (flattened):**
```
System → Component → Detail
```

Ask: "Does this intermediate layer add meaning, or just indirection?"

### Fix 2: Rename Ambiguous Containers

**Before (confusing):**
```
Handler contains Manager contains Controller contains Service
```

**After (clear):**
```
RequestHandler contains AuthValidator contains DatabaseClient
```

Names should describe *what's inside*, not generic patterns.

### Fix 3: Break Circular Dependencies

**Before (circular):**
```
A contains B, B references A, both use C
```

**After (hierarchical):**
```
C (shared utilities)
├── A (uses C)
└── B (uses C, called by A)
```

If you can't draw it as a tree, refactor until you can.

### Fix 4: Add the Diagram to the Doc

Sometimes the abstraction is fine but the documentation is missing. Add a 3-5 line ASCII diagram at the top of every:
- SKILL.md
- CLAUDE.md
- README.md for complex modules

---

## Integration with Other Patterns

### With Three Edges Filter
Run the Containment Test **after** passing Ship Ugly, Anchor to Who, and Delete Before Add. It's the final validation before shipping.

### With HTK
Each HTK cycle should produce artifacts that pass the Containment Test. If your test kernel can't be drawn in 2 minutes, the scope is too large.

### With Boundary Contracts
The boundary contract's input/output/invariants should map clearly to boxes in your containment diagram. If they don't align, something is mis-abstracted.

---

## Quick Reference

**When to run:** Before shipping any skill, doc, or system design

**Time required:** 2 minutes (that's the point)

**Pass:** Newcomer draws boxes-in-boxes correctly

**Fail → Fix by:**
1. Flatten nesting
2. Rename containers
3. Break circular deps
4. Add ASCII diagram

**Mantra:** *If you can't point to it like you can point to your foot, simplify until you can.*

---

## Related Documents

- [claude-code-best-practices.md](./claude-code-best-practices.md) — Three Edges Filter (now Four Edges)
- [execution-scaffolding.md](./execution-scaffolding.md) — Action Headers
- [boundary-decomposition-guide.md](./boundary-decomposition-guide.md) — Decomposition patterns
