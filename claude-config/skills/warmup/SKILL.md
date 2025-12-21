# Warmup

Load context and declare session intent at the start of a working session.

## Triggers

- "warmup"
- "getting started"
- "resuming work"
- "starting session"

## Workflow

### 1. Load Prior Context

Check for recent session artifacts:
- `.claude-sessions/` — Recent park documents (last 3)
- `action-items.yaml` or similar task files
- Git branches in progress (`git branch --list`)

### 2. Surface Pending Items

Look for:
- Overdue action items or TODOs
- In-progress work from last session
- Blockers noted in park documents

### 3. Prompt for Intent

Ask the user:
> "What's your focus for this session?"

Options to suggest based on context:
- Continue from last park document
- Start fresh on new task
- Review/triage pending items

### 4. Set Session Context

Based on intent:
- Load relevant files into context
- Set mental model for the session
- Note any constraints or deadlines mentioned

## Output

Brief status report:
```
Session Context:
- Last session: [summary from park doc]
- Pending: [count] action items
- Git: [branch] with [n] uncommitted changes
- Focus: [user's declared intent]
```

## Anti-Pattern Addressed

**Before**: Bare "Warmup" with no intent → context loaded but no direction

**After**: Warmup with focus → context + clear session goal
