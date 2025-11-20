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

4. **Knowledge Gaps**
   - What documentation was missing/outdated?
   - What tools/commands were hard to find?
   - What patterns should be codified?

5. **`.claude` Improvements Needed**
   - Missing skills that would have helped
   - Commands that should exist
   - CLAUDE.md additions for common patterns
   - REFERENCE.md clarifications

6. **Spec & Boundary Updates**
   - What boundaries were added/modified during this session?
   - Were they added via `python specs/kernel/add-boundary.py`? (NEVER manual CSV edits)
   - Were module specs updated (FR/NFR tables)?
   - Were CONTRACT.md files created for backend boundaries?
   - Any spec drift detected (boundaries in CSV but missing from module specs)?
   - Run validation: `python specs/kernel/validate-boundaries.py && python specs/kernel/sync-spec-coverage.py`

## Compression Strategy

**Keep:**
- Architectural decisions and rationale
- Bug root causes with specific details
- Configuration values and why they were chosen
- Non-obvious implementation details
- Specific file paths and code snippets

**Discard:**
- Redundant command outputs
- Conversational pleasantries
- Intermediate debugging steps that led nowhere
- Repetitive explanations

## Output Format

Create file: `.claude-sessions/YYYY-MM-DD-[topic-slug]-compressed.md`

Use this AI-optimized format (freeform, dense, technical):

```markdown
# [Topic] - YYYY-MM-DD

## Context
[2-3 sentences: what was the goal, what triggered this work]

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

1. Analyze conversation history using the criteria above
2. Generate topic slug from main task (e.g., "auth-oauth-flow", "database-migration-perf")
3. Create compressed park document in `.claude-sessions/`
4. Report: file created, size, key insights captured
5. If session notes exist in `.claude-sessions/current-session-notes.md`, incorporate them and then clear the file

## Success Criteria

- Document is dense (not verbose)
- Technical details preserved
- `.claude` improvements actionable
- File < 500 lines
- Readable by both AI and humans (but optimized for AI)
