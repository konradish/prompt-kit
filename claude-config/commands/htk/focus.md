# HTK FOCUS Mode

Generate FOCUS options when input is broad or direction unclear: **$ARGUMENTS**

## Purpose

When faced with broad requirements or multiple possible directions, generate 2-3 FOCUS options to identify the best next move.

## Execution

### 1. Context Analysis
Parse user input from `$ARGUMENTS` and available context:
- What is the high-level goal?
- What constraints exist?
- What information is available vs missing?
- What assumptions are necessary?

### 2. Generate Options (≤3)

For each option:
- **Label**: Short identifier (e.g., `reduce-friction`, `improve-perf`)
- **Outcome**: One-sentence description of result
- **Why-first**: ≤2 sentences explaining reasoning/impact

Rank by:
1. Impact potential
2. Risk level (lower is better)
3. Required information (less is better)

### 3. Recommend Choice

Based on:
- Available information
- Quickest path to validation
- Lowest risk
- Highest learning value

### 4. Output Format

```
# FOCUS

Options:
* <label>: <one-sentence outcome> — Why-first: <≤2 sentences>
* <label>: <one-sentence outcome> — Why-first: <≤2 sentences>
* <label>: <one-sentence outcome> — Why-first: <≤2 sentences>

Chosen: <label>

Inputs needed (ranked, stop when enough):
- <critical input 1>
- <critical input 2>
- <nice-to-have input 3>

Assumptions (frozen, ≤3):
- <assumption 1>
- <assumption 2>
```

## Example

**Input:** `$ARGUMENTS: "Our API is slow and users are complaining"`

**Output:**
```
# FOCUS

Options:
* cache-layer: Add Redis caching to reduce DB load 70% — Why-first: Quick win with low risk. DB CPU at 85% suggests this is bottleneck.
* query-optimization: Fix N+1 queries and add indexes — Why-first: Addresses root cause but requires deeper analysis. Higher impact if successful.
* scale-horizontally: Add more API instances — Why-first: Treats symptom not cause. Expensive and temporary fix.

Chosen: cache-layer

Inputs needed (ranked, stop when enough):
- Current DB load metrics (CPU, query patterns)
- API endpoints sorted by traffic volume
- Caching infrastructure availability (Redis/Memcached)

Assumptions (frozen, ≤3):
- Most queries are read-heavy (cacheable)
- DB is the bottleneck (not application logic)
- 1-hour TTL acceptable for most data
```

## Integration

This command is typically called by the `htk-workflow` skill when:
- User input is broad ("improve performance", "better UX")
- Multiple valid approaches exist
- Direction unclear

After FOCUS chosen, skill calls `/htk-create` to build the first HTK.
