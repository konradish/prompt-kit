---
name: session-management
description: Auto-activates after ~50 messages to suggest parking session and linking related knowledge. Triggers on "park", "session", "compress", "knowledge capture".
allowed-tools: Read, Write, Glob, Bash
---

# Session Management Skill

Manages conversation sessions for institutional knowledge capture through compressed park documents.

## Purpose

This skill helps maintain institutional memory by:
1. Detecting when conversation context is growing large
2. Suggesting session parking at natural breakpoints
3. Linking related park documents from previous sessions
4. Facilitating knowledge reuse across sessions

## Auto-Activation Triggers

**Keyword-based:**
- User mentions: "park", "session", "compress", "knowledge capture"
- User runs: `/session/park`, `/session/apply`, `/session/note`

**Context-based (approximate):**
- After ~50 messages in conversation
- When task completion is reached
- When switching between unrelated tasks

## Core Workflows

### Workflow 1: Suggest Parking

**When to suggest:**
- Conversation has ~50+ messages
- Major task just completed
- About to switch to unrelated topic
- User asks "what should I do next?"

**How to suggest:**
```markdown
This conversation has grown to [X] messages. Would you like to park this session?

Running `/session/park` will:
- Compress conversation into AI-optimized summary
- Capture architectural decisions and lessons learned
- Identify .claude improvements for future sessions
- Create park document in .claude-sessions/

Related park documents:
- [YYYY-MM-DD-topic]: [brief relevance]
```

### Workflow 2: Link Related Sessions

**When to link:**
- User starts task similar to past session
- User encounters issue solved before
- User requests background on topic

**How to link:**
1. Search `.claude-sessions/` for relevant park documents
2. Use Grep to find related topics/keywords
3. Present 2-3 most relevant with brief context
4. Offer to load full park document if needed

**Example:**
```markdown
Related sessions on authentication:
- 2025-11-15-oauth-flow: Implemented Google OAuth with redirect handling
- 2025-11-12-jwt-tokens: Fixed token expiration issue
- 2025-11-10-auth-testing: Added Claude test user for production

Would you like me to load details from any of these sessions?
```

### Workflow 3: Facilitate Session Notes

**When user makes important observation:**
- Suggest: "Would you like to capture this as a session note?"
- Guide: "Run `/session/note [your observation]`"
- Context: "This will be incorporated when you park the session"

## Park Document Format (Reference)

Park documents use AI-optimized compression:

```markdown
# [Topic] - YYYY-MM-DD

## Context
[2-3 sentences: goal and trigger]

## Decisions
- **[Decision]**: [Rationale + specifics]

## Implementation
- Changed [file]: [what and why]
- Fixed [bug]: [root cause → solution]

## Lessons
- ✅ [What worked]
- ❌ [What didn't]
- 💡 [Key insight]

## Knowledge Gaps
- Missing: [docs/tools]
- Unclear: [patterns]

## .claude Improvements
- [ ] Add skill: [name]
- [ ] Add command: [name]
- [ ] Update CLAUDE.md: [addition]

## Related Sessions
- [YYYY-MM-DD-topic]: [relation]
```

## Integration with Commands

This skill coordinates three commands:

1. **`/session/park`**
   - Compresses conversation into park document
   - Saves to `.claude-sessions/YYYY-MM-DD-[topic]-compressed.md`
   - Incorporates any notes from `/session/note`

2. **`/session/apply`**
   - Reads park documents from last 7 days
   - Extracts `.claude` improvement suggestions
   - Auto-applies to skills/commands/docs

3. **`/session/note`**
   - Quick timestamped note to `current-session-notes.md`
   - Accumulated during session for park processing

## Search Strategy

**Finding related park documents:**

```bash
# Search by topic keywords
grep -l "authentication\|oauth" .claude-sessions/*-compressed.md

# Search by file paths
grep -l "backend/app/api/v1/auth" .claude-sessions/*-compressed.md

# Search by date range (last 7 days)
find .claude-sessions/ -name "*-compressed.md" -mtime -7

# Search by specific lesson learned
grep -A 3 "Lessons" .claude-sessions/*-compressed.md | grep "OAuth"
```

## Best Practices

### When to Park
- ✅ Task completed successfully
- ✅ After 50+ messages
- ✅ Before switching topics
- ✅ Found important insights to preserve

### When NOT to Park
- ❌ Task incomplete with errors
- ❌ In middle of debugging
- ❌ Conversation < 20 messages
- ❌ No significant decisions made

### Compression Guidelines
- **Preserve:** Architecture decisions, bug root causes, config values
- **Discard:** Redundant outputs, intermediate debugging, pleasantries
- **Target:** Dense, technical, < 500 lines
- **Format:** AI-optimized (freeform but structured)

### Linking Relevance
- **High relevance:** Same component/feature (always suggest)
- **Medium relevance:** Related pattern/workflow (suggest if < 3 docs)
- **Low relevance:** Tangential connection (mention only if asked)

## Success Metrics

**Good park document:**
- Contains actionable `.claude` improvements
- Preserves specific technical details
- Includes lessons learned
- References related sessions
- < 500 lines
- Dense, not verbose

**Effective linking:**
- User avoids repeating solved problems
- User leverages past architectural decisions
- User applies learned patterns
- User requests specific park documents

## Common Scenarios

### Scenario 1: Natural Breakpoint
**User:** "That's working now, what's next?"

**Skill response:**
```markdown
Great! This seems like a natural breakpoint. You've completed [task summary].

Would you like to park this session? (`/session/park`)

This will capture:
- OAuth redirect implementation details
- Bug fix for state parameter handling
- Lesson: Always test redirect URIs in both environments

You could then start fresh on the next task.
```

### Scenario 2: Related Work
**User:** "I need to add another OAuth provider"

**Skill response:**
```markdown
You implemented Google OAuth recently. Let me find that session:

Related: 2025-11-15-oauth-google-flow
- Implemented redirect handling
- Fixed state parameter bug
- Added environment-specific redirect URIs

Would you like me to load the full park document for reference?
Or run `/session/apply` to check for relevant `.claude` improvements?
```

### Scenario 3: Knowledge Gap
**User:** "How do we handle OAuth errors again?"

**Skill response:**
```markdown
Searching park documents for OAuth error handling...

Found in 2025-11-12-auth-error-handling:
- Error handling pattern: Catch OAuth exceptions in callback route
- Log error details but show generic message to user
- Redirect to login with error param

Would you like the full implementation details from that session?
```

## File Locations

**Commands (global):**
- `/home/kodell/.claude/commands/session/park.md`
- `/home/kodell/.claude/commands/session/apply.md`
- `/home/kodell/.claude/commands/session/note.md`

**Park documents (per-project):**
- `.claude-sessions/YYYY-MM-DD-[topic]-compressed.md`
- `.claude-sessions/current-session-notes.md`
- `.claude-sessions/archive/` (for old park documents)

**This skill (global):**
- `/home/kodell/.claude/skills/session-management/SKILL.md`

## Progressive Disclosure

For detailed technical reference on park document format, compression strategies, and application patterns, see:
- REFERENCE.md (when created)
- Project `.claude-sessions/README.md` for project-specific guidelines
