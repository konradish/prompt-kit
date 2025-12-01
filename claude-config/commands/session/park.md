---
description: Compress current conversation session into AI-optimized park document for institutional knowledge capture
---

You are about to create a "park document" that compresses this conversation session into an AI-optimized summary for future reference and continuous improvement.

## Analysis Phase

Review the conversation history and identify:

1. **Core Context**
   - What problem/feature/task was being addressed?
   - What were the key architectural decisions?
   - What specific code changes were made?

2. **Technical Details** (preserve these)
   - Bug root causes and fixes
   - Configuration changes with specific values
   - API patterns discovered
   - Database schema modifications
   - Architecture insights

3. **Lessons Learned**
   - What worked well?
   - What didn't work initially?
   - What would you do differently?
   - What was surprising or non-obvious?

4. **Mistakes & Inefficiencies** (CRITICAL - Document These First)

   **Tool Call Failures & Inefficiencies:** ⚠️ REVIEW EVERY TOOL CALL
   - Invalid file paths (Read/Edit on non-existent files)
   - Failed searches (Grep/Glob that returned nothing useful)
   - Wrong parameters (incorrect regex, wrong directory)
   - Sequential calls that could have been parallel
   - Wrong tool selection (e.g., Bash cat instead of Read)
   - Repeated/redundant searches for same information
   - Overly broad searches that returned too much noise
   - Missing context that required follow-up calls

   **AI Agent Mistakes:**
   - Wrong assumptions, missing knowledge, incorrect approaches YOU took
   - Commands/approaches YOU tried that failed or had to be abandoned
   - Time wasted and how it could have been prevented
   - What YOU should have checked/validated FIRST to avoid the mistake

   **User Mistakes & When to Push Back:**
   - User assumptions/requirements that were incorrect
   - Times when YOU should have questioned user assumptions MORE strongly
   - Plans/specifications provided by user that had errors YOU should have caught

   **Shared/Process Mistakes:**
   - Hidden assumptions that didn't hold for BOTH user and AI
   - Missing validation steps that would have caught errors early
   - Documentation gaps that led BOTH parties astray

5. **Knowledge Gaps**
   - What documentation was missing/outdated?
   - What tools/commands were hard to find?
   - What patterns should be codified?

6. **`.claude` Improvements Needed**
   - Missing skills that would have helped
   - Commands that should exist
   - CLAUDE.md additions for common patterns
   - REFERENCE.md clarifications

7. **Project Enhancements** (Code-Level Improvements)
   - Tech debt discovered during this session
   - Code smells or refactoring opportunities
   - Feature ideas that emerged from the work
   - Performance improvements identified
   - Testing gaps discovered
   - API/schema design improvements

## Compression Strategy

**Keep (Priority Order):**
1. **Mistakes and wrong approaches** (most valuable for learning)
2. **Architectural decisions and rationale**
3. **Bug root causes with specific details**
4. **Configuration values and why they were chosen**
5. **Non-obvious implementation details**
6. **Specific file paths and code snippets**

**Discard:**
- Redundant command outputs
- Conversational pleasantries
- Intermediate debugging steps that led nowhere
- Repetitive explanations

## Output Format

Create file: `.claude-sessions/YYYY-MM-DD-[topic-slug]-compressed.md`

Use this AI-optimized format:

```markdown
# [Topic] - YYYY-MM-DD

## Context
[2-3 sentences: what was the goal, what triggered this work]

## Mistakes Are Learnings (Read This First)

**Key mistakes in this session**:
1. [Mistake 1]: [Why it happened] → [Impact] → [Prevention]
2. [Mistake 2]: [Why it happened] → [Impact] → [Prevention]

**Time wasted**: [X minutes/hours on Y] - Could have been prevented by [Z]

## Decisions
- **[Decision]**: [Rationale]. [Specific details/values].

## Implementation
- Changed [file]: [specific change and why]
- Added [component]: [purpose and key details]
- Fixed [bug]: [root cause → solution]

## Lessons
- ✅ [What worked well]
- ❌ [What didn't work initially]
- 💡 [Key insight for future]

## Mistakes & Efficiency Improvements

### Tool Call Failures & Inefficiencies
*(Review conversation for ALL failed/suboptimal tool calls)*

| Tool | Issue | Better Approach |
|------|-------|-----------------|
| Read | File not found: `/wrong/path.md` | Should have used Glob first to find file |
| Grep | No results for `pattern` | Pattern too specific, try broader search |
| Bash | Sequential `git status` then `git diff` | Parallel: both in single message |
| Edit | Failed - old_string not found | Read file first to get exact content |

**Wasted tool calls:** N calls that returned errors or empty results
**Sequential→Parallel opportunities:** N instances where parallel calls would be faster
**Wrong tool selections:** [List any Bash cat/grep instead of Read/Grep]

### AI Agent Mistakes
1. **[Wrong approach]**: [Why seemed right, why failed, correct approach]

### User Mistakes (Where AI Should Push Back)
1. **[Incorrect assumption]**: [User assumed X, but reality was Y]

### Times AI Correctly Pushed Back
- **Questioned [X]**: [Saved mistake by asking...]

## Knowledge Gaps
- Missing: [documentation/tool/command]
- Unclear: [pattern/workflow]

## .claude Improvements

### Routing Decision (IMPORTANT)
Before listing improvements, determine the correct destination:

| If it's... | Route to... | NOT to... |
|------------|-------------|-----------|
| Detailed technical reference (configs, IDs, patterns) | `skills/[domain]/REFERENCE.md` | CLAUDE.md |
| A repeating workflow (3+ occurrences) | New skill or command | CLAUDE.md |
| Project-wide one-liner rule | CLAUDE.md (if <200 lines) | Detailed prose |
| Domain-specific debugging steps | `skills/troubleshooting/REFERENCE.md` | CLAUDE.md |

### Skills (patterns that repeat 3+ times)
- [ ] Create skill: [name] - triggers: [keywords] - purpose: [what it does]
- [ ] Update `skills/[name]/REFERENCE.md`: [topic] - [details to add]

### Commands (workflows someone would run)
- [ ] Create command: [category]/[name] - [what it automates]

### REFERENCE.md (detailed technical info)
- [ ] Add to `skills/[domain]/REFERENCE.md`: [specific technical details]
  - infrastructure: tunnel IDs, server configs, network details
  - troubleshooting: debugging steps, log locations, error patterns
  - database-schema-manager: migration patterns, field mappings
  - ai-integration: prompt patterns, model configs, response handling

### CLAUDE.md (ONLY if all of these are true)
- [ ] Rule is universal (applies to ALL work in this project)
- [ ] Rule is a one-liner (not detailed reference)
- [ ] CLAUDE.md is currently < 80 lines
- [ ] No existing skill covers this domain
→ If yes to all: Update CLAUDE.md: [one-line rule]
→ If no: Route to appropriate REFERENCE.md instead

## Project Enhancements (Code-Level Work)

### Tech Debt Discovered
*(Code smells, workarounds, design issues found during this session)*

| Issue | Location | Impact | Suggested Fix |
|-------|----------|--------|---------------|
| [Issue name] | `path/to/file.py` | [high/medium/low] | [Brief fix description] |

**Recommended GitHub Labels:** `tech-debt`, `refactor`, `code-quality`

### Feature Ideas
*(New capabilities or improvements that emerged from this work)*

- [ ] **[Feature name]**: [Description] - Priority: [P0/P1/P2]
  - Files affected: [list]
  - Complexity: [small/medium/large]

### Refactoring Opportunities
*(Structural improvements, not bug fixes)*

- [ ] **[Refactor name]**: [Current state] → [Desired state]
  - Motivation: [Why this matters]
  - Approach: [High-level how]

### Testing Gaps
*(Missing test coverage discovered)*

- [ ] [Component/function]: [What's not tested]

### Action: Create GitHub Issues
*(Mark items that should become GitHub issues for `/session:apply` to process)*

For items marked with `→ GH ISSUE`, `/session:apply` will:
1. Create GitHub issue with appropriate labels
2. Link to this park document for context
3. Track in `action-items.yaml` with `type: project-enhancement`

## Related Sessions
- [YYYY-MM-DD-topic]: [how it relates]

## Artifacts
- Files modified: [list]
- Commands run: [key commands]
- Tests added: [if applicable]
```

## Extract Lessons for Spaced Repetition

After creating the park document, extract lessons for `lesson-index.yaml`:

### Lesson Extraction Rules

1. **From "Lessons" section**: Each ✅, ❌, or 💡 becomes a lesson
2. **From "Mistakes" section**: Each mistake prevention becomes a lesson
3. **From "Knowledge Gaps"**: Each gap becomes a low-priority lesson

### Lesson Format

```yaml
# Append to .claude-sessions/lesson-index.yaml
- id: lesson-YYYY-MM-DD-NNN
  source: YYYY-MM-DD-[topic]-compressed.md
  lesson: "[One actionable sentence]"
  category: security|efficiency|architecture|debugging|workflow|testing
  impact: high|medium|low
  keywords: [relevant, terms, for, matching]
  last_surfaced: YYYY-MM-DD
  surface_after: YYYY-MM-DD  # +7 days from today
  interval_days: 7
  times_surfaced: 0
  times_applied: 0
```

### Category Assignment

- **security**: Auth, validation, secrets, CSRF, injection
- **efficiency**: Parallel execution, caching, tool selection
- **architecture**: Design patterns, file structure, boundaries
- **debugging**: Root cause analysis, logging, error handling
- **workflow**: Git, CI/CD, deployment, testing strategies
- **testing**: Test patterns, coverage, mocking

## Extract Entities for Knowledge Graph

After creating the park document, update `knowledge-graph.yaml`:

### Entity Extraction Rules

1. **From file paths**: Extract component names (e.g., `src/auth/oauth.py` → `oauth`, `auth`)
2. **From technical terms**: Capitalized or hyphenated terms (e.g., `OAuth`, `rate-limiting`)
3. **From section headers**: Topics discussed (e.g., "Caching Strategy" → `caching`)
4. **From bug names**: Named issues (e.g., "state-param-csrf-bug")

### Entity Format

```yaml
# Append/update in .claude-sessions/knowledge-graph.yaml
entities:
  - name: [lowercase-hyphenated]
    type: feature|domain|component|pattern|bug|file
    sessions: [add this session filename]
    keywords: [related, terms]
    first_seen: YYYY-MM-DD  # Only if new
    last_updated: YYYY-MM-DD  # Today
```

### Relationship Inference

- **Same file modified in multiple sessions** → `related_to`
- **Bug fix** → Session `fixes` bug entity
- **New feature** → Session `implements` feature entity
- **References another session** → `builds_on`

```yaml
relationships:
  - from: [this-session-filename]
    to: [related-session-or-entity]
    type: builds_on|caused_by|related_to|implements|fixes|uses
    strength: high|medium|low
    context: "[Brief explanation]"
```

## Check for Repeated Mistakes

Before finalizing, check if any mistakes are repeated:

```bash
# Search existing lessons for similar mistakes
grep -i "[key mistake term]" .claude-sessions/lesson-index.yaml
```

If found:
1. Note in park doc: "⚠️ REPEATED MISTAKE: Also occurred in [session]"
2. Increment `repeated_mistakes` in metrics.yaml
3. Consider escalating related action items to higher priority

## Update Metrics

After creating park document, update `.claude-sessions/metrics.yaml`:

```yaml
# Initialize if doesn't exist
version: 1
period_start: YYYY-MM-DD  # First park date if new
period_end: YYYY-MM-DD    # Today

# Increment capture metrics
capture:
  sessions_parked: +1
  lessons_captured: +N        # Number of lessons extracted
  action_items_created: +M    # From .claude Improvements
  mistakes_documented: +K     # From Mistakes section

# Calculate compression ratio
# compression_ratio = park_doc_lines / conversation_message_count
# Update avg_compression_ratio as running average

# Add history entry
history:
  - date: YYYY-MM-DD
    event: parked
    details: "[topic]: N decisions, M lessons, K mistakes"
```

## Multi-Agent Extraction (Optional - For Complex Sessions)

For sessions with 50+ messages or complex multi-topic discussions, use parallel extraction:

### Agent Coordination

```markdown
Launch these agents in parallel (no dependencies):

1. **Decision Extractor Agent**
   - Focus: Architectural decisions, rationale, trade-offs
   - Extract: decision-name, rationale, alternatives-considered, outcome

2. **Mistake Analyzer Agent**
   - Focus: AI mistakes, user mistakes, process gaps
   - Extract: mistake-description, root-cause, prevention, time-wasted

3. **Lesson Synthesizer Agent**
   - Focus: What worked, what didn't, key insights
   - Extract: lesson-text, category, impact, keywords

4. **Entity Linker Agent**
   - Focus: Related sessions, entity extraction, graph updates
   - Extract: entities, relationships, related-sessions

After all complete, synthesize into final park document.
```

### When to Use Multi-Agent

- [ ] Session has 50+ messages
- [ ] Multiple distinct topics discussed
- [ ] Complex debugging with many dead ends
- [ ] Major architectural decisions made

## Execution Checklist

1. [ ] Analyze conversation for all 6 categories
2. [ ] Generate topic slug from main task
3. [ ] Create compressed park document in `.claude-sessions/`
4. [ ] Extract lessons to lesson-index.yaml
5. [ ] Extract entities to knowledge-graph.yaml
6. [ ] Check for repeated mistakes
7. [ ] Update metrics.yaml
8. [ ] Incorporate session notes if they exist in `current-session-notes.md`
9. [ ] Clear `current-session-notes.md` after incorporating
10. [ ] Report summary to user

## Report to User

After parking, show:

```markdown
## Session Parked Successfully

**Document:** .claude-sessions/YYYY-MM-DD-[topic]-compressed.md
**Size:** N lines (X% compression)

### Captured
- Decisions: N
- Lessons: M (added to spaced repetition)
- Mistakes: K
- Action items: J

### Knowledge Graph Updated
- Entities added/updated: N
- Relationships added: M
- Related sessions linked: K

### Metrics
- Total sessions parked: X
- Lesson index size: Y lessons

### Next Steps
- Run `/session:apply` to process improvements
- Run `/session:remind` to review due lessons
- Run `/session:health` to see flywheel metrics
```

## Success Criteria

- [ ] Mistakes documented FIRST with prevention strategies
- [ ] Document is dense (not verbose)
- [ ] Technical details preserved
- [ ] `.claude` improvements actionable (checklist format)
- [ ] File < 500 lines
- [ ] Lessons extracted with proper categories
- [ ] Entities extracted for knowledge graph
- [ ] Metrics updated accurately
- [ ] Readable by both AI and humans (optimized for AI)
