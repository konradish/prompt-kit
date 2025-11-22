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

4. **Mistakes & Inefficiencies** ⚠️ **CRITICAL - Identify & Document These First**

   **Analyze the conversation and identify ALL mistakes:**

   **AI Agent Mistakes:**
   - Wrong assumptions, missing knowledge, incorrect approaches YOU took
   - Commands/approaches YOU tried that failed or had to be abandoned
   - Time wasted and how it could have been prevented
   - What YOU should have checked/validated FIRST to avoid the mistake
   - "Obvious" solutions YOU tried that turned out wrong
   - Inefficient workflows YOU used (should have parallelized, better tool existed)

   **User Mistakes & When to Push Back:**
   - User assumptions/requirements that were incorrect (e.g., "deprecate these fields" but they're actually used)
   - Times when YOU should have questioned user assumptions MORE strongly
   - Plans/specifications provided by user that had errors YOU should have caught
   - Requirements that conflicted with production reality (should have validated first)
   - Times when YOU correctly pushed back and saved the user from a mistake (document the pattern)

   **Shared/Process Mistakes:**
   - Hidden assumptions that didn't hold for BOTH user and AI
   - Missing validation steps that would have caught errors early
   - Documentation gaps that led BOTH parties astray

   **Be brutally honest - mistakes (yours, user's, or shared) are the most valuable learning content. Document when you should have pushed back harder on user assumptions.**

5. **Knowledge Gaps**
   - What documentation was missing/outdated?
   - What tools/commands were hard to find?
   - What patterns should be codified?

6. **`.claude` Improvements Needed**
   - Missing skills that would have helped
   - Commands that should exist
   - CLAUDE.md additions for common patterns
   - REFERENCE.md clarifications

7. **Spec & Boundary Updates**
   - What boundaries were added/modified during this session?
   - Were they added via `python specs/kernel/add-boundary.py`? (NEVER manual CSV edits)
   - Were module specs updated (FR/NFR tables)?
   - Were CONTRACT.md files created for backend boundaries?
   - Any spec drift detected (boundaries in CSV but missing from module specs)?
   - Run validation: `python specs/kernel/validate-boundaries.py && python specs/kernel/sync-spec-coverage.py`

## Compression Strategy

**Keep (Priority Order):**
1. **Mistakes and wrong approaches** (most valuable for learning)
   - What was tried that failed
   - Why it failed (assumptions, missing knowledge)
   - How it was discovered/corrected
   - Prevention strategy for future
2. **Architectural decisions and rationale**
3. **Bug root causes with specific details**
4. **Configuration values and why they were chosen**
5. **Non-obvious implementation details**
6. **Specific file paths and code snippets**

**Discard:**
- Redundant command outputs
- Conversational pleasantries
- Intermediate debugging steps that led nowhere (unless they reveal a common trap)
- Repetitive explanations

**Philosophy**: Success patterns teach what works, but mistakes teach what to avoid and reveal process gaps that need tooling/automation.

## Output Format

Create file: `.claude-sessions/YYYY-MM-DD-[topic-slug]-compressed.md`

Use this AI-optimized format (freeform, dense, technical):

```markdown
# [Topic] - YYYY-MM-DD

## Context
[2-3 sentences: what was the goal, what triggered this work]

## Mistakes Are Learnings (Read This First)

**Emphasize mistakes and inefficiencies as primary learnings.** Success patterns are useful, but mistakes reveal:
- Hidden assumptions that don't hold
- Missing knowledge that should be documented
- Process gaps that need tooling/automation
- Efficiency opportunities for future sessions

**Key mistakes in this session**:
1. [Mistake 1]: [Why it happened] → [Impact] → [Prevention]
2. [Mistake 2]: [Why it happened] → [Impact] → [Prevention]
3. [Mistake 3]: [Why it happened] → [Impact] → [Prevention]

**Time wasted**: [X minutes/hours on Y] - Could have been prevented by [Z]

## Decisions
- **[Decision]**: [Rationale]. [Specific details/values].
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

### AI Agent Mistakes
1. **[Wrong approach]**: [Why seemed right, why failed, correct approach]
2. **[Failed validation]**: [Should have checked X before doing Y, wasted Z time]
3. **[Inefficient workflow]**: [Sequential when could have been parallel, wrong tool used]

### User Mistakes (Where AI Should Push Back)
1. **[Incorrect assumption]**: [User assumed X, but reality was Y, AI should have validated before executing]
2. **[Wrong requirement]**: [User requested A, but production data showed B needed, AI should have caught this]
3. **[Trusted plan too much]**: [User provided plan with errors, AI should have been more skeptical]

### Times AI Correctly Pushed Back (Document the Pattern)
- **Questioned [X]**: [User wanted Y, AI asked "have you checked Z?", saved mistake]
- **Validated [assumption]**: [AI checked production data before executing, caught error]

### Efficiency Improvements Applied
- [Parallel execution used instead of sequential]
- [Better tool/agent selected]
- [Validated early, caught errors before expensive operations]

### What Could Have Been Better
- **Could have pushed back on [user assumption]**: [Should have validated X before trusting plan]
- **Should have validated [data/usage] earlier**: [Before doing expensive refactor/migration]
- **Could have questioned [requirement]**: [User said X, but should have checked if X matched reality]

## Knowledge Gaps
- Missing: [documentation/tool/command]
- Unclear: [pattern/workflow]
- Needed: [skill/reference material]

## .claude Improvements
- [ ] Add skill: [name] - [trigger keywords] - [purpose]
- [ ] Add command: [name] - [what it should do]
- [ ] Update CLAUDE.md: [section] - [addition]
- [ ] Update REFERENCE.md: [file] - [clarification]

## Related Sessions
- [YYYY-MM-DD-topic]: [how it relates]

## Artifacts
- Files modified: [list]
- Commands run: [key commands]
- Tests added: [if applicable]
```

## Execution

1. **Analyze conversation history** - Identify ALL mistakes:
   - AI agent mistakes: wrong assumptions, bad approaches, wasted commands, should have validated earlier
   - User mistakes: incorrect assumptions/requirements that AI should have caught or pushed back on
   - Process mistakes: missing validation, documentation gaps, untested assumptions
   - Times when AI correctly questioned user vs. times when AI should have pushed back harder

2. **Generate topic slug** from main task (e.g., "auth-oauth-flow", "database-migration-perf")

3. **Create compressed park document** in `.claude-sessions/` with "Mistakes Are Learnings" as the FIRST section after Context

4. **Report to user**: file created, size, key insights captured (especially mistakes identified - AI, user, and process)

5. **Incorporate session notes** if they exist in `.claude-sessions/current-session-notes.md`, then clear the file

**Remember**: Mistakes happen at ALL levels - AI agent execution, user assumptions/requirements, and shared process gaps. Document all of them. The goal is to help future AI agents know when to push back on user assumptions and when to validate before executing.

## Success Criteria

- **Mistakes documented FIRST** with why they happened and how to prevent them
- Document is dense (not verbose)
- Technical details preserved
- `.claude` improvements actionable
- File < 500 lines
- Readable by both AI and humans (but optimized for AI)
- Brutally honest about AI agent mistakes (not defensive or glossing over errors)
