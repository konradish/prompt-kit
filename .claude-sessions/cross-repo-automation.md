# Cross-Repo Automation Recommendations

**Source**: Analysis of 172 prompts from ObsidianNotes sessions
**Focus**: Identifying reusable patterns for prompt-kit global config

---

## 1. Global Patterns (Should Live in ~/.claude)

These patterns appear across ALL repos and should be global skills/commands:

### 1.1 Daily Sync Skill

**Pattern detected**: 21% of prompts are daily ritual (warmup + email/calendar/readwise/weather)

**Current state**: Ad-hoc prompts, no standardization
**Recommendation**: Create `claude-config/skills/daily-sync/SKILL.md`

```yaml
triggers: ["daily sync", "morning sync", "warmup", "start my day"]
```

**Template (from patterns analysis):**
```markdown
Morning sync:
- Email: Flag urgent, summarize rest by category
- Calendar: Next 48 hours, flag conflicts
- Readwise: Cluster highlights, triage to 1-2 per cluster
- Weather: Flower Mound, TX brief

Output: Update Inbox/Sync-State.md
```

**Why global**: Same pattern every project - reads external sources, updates Obsidian

### 1.2 URL Ingest Skill

**Pattern detected**: 12% of prompts are URL-only (YouTube, articles)

**Current state**: Bare URLs with no processing instructions
**Recommendation**: Create `claude-config/skills/url-ingest/SKILL.md`

```yaml
triggers: ["ingest:", "ingest this", "summarize url", "youtube.com", "medium.com"]
```

**Template:**
```markdown
Ingest: [URL]
- 1-paragraph summary
- Key frameworks/mental models (bullet points)
- Actionable techniques
- Connect to: [suggest based on current context or vault]
- Target note: [auto-detect from content type]
```

**Why global**: URL processing is project-agnostic, always outputs to Obsidian vault

### 1.3 Enhanced Warmup Command

**Pattern detected**: 36 bare "Warmup" prompts (21%)

**Current state**: Warmup loads context but provides no intent
**Recommendation**: Update `/core/warmup.md` or create new

```markdown
Warmup with intent:
- Load context: ${context_files}
- Today's focus: ${focus_area}
- Active HTK: ${current_htk}
- Blockers from last session: ${check_park_docs}

Surface: Overdue action items, due lessons, related sessions
```

**Why global**: Warmup pattern applies everywhere, should include session management hooks

---

## 2. Project-Specific Patterns (Stay in .claude/)

These patterns vary by project and should NOT be global:

### 2.1 Research Questions

The structured research prompts work well but topics are project-specific:
- SchoolBrain: "Research OAuth providers for education..."
- RecipeBrain: "Research ingredient parsing APIs..."
- prompt-kit: "Research Claude Code hooks..."

**Keep as**: Ad-hoc prompts with the proven structure (numbered specifics, clear scope)

### 2.2 Build/Test Commands

Different projects have different:
- Test frameworks (pytest vs jest)
- Build systems (docker vs npm vs make)
- Deployment targets

**Keep as**: Project-specific `/commands/build.md`, `/commands/test.md`

### 2.3 Domain Entities

Each project has unique domain vocabulary and entity relationships:
- SchoolBrain: students, teachers, courses, gradebook
- RecipeBrain: ingredients, recipes, meal plans

**Keep as**: Project CLAUDE.md domain context

---

## 3. Implementation Recommendations

### Phase 1: Create Global Skills (Priority 1)

**A. Daily Sync Skill**

Location: `claude-config/skills/daily-sync/`

Structure:
```
daily-sync/
├── SKILL.md        # Core workflow, triggers, templates
└── REFERENCE.md    # API details for email/calendar/readwise
```

Key features:
- Auto-detect sync sources from environment (gmail configured? readwise token?)
- Standardized output format for Obsidian
- Priority ordering (urgent first)
- Configurable via YAML frontmatter

**B. URL Ingest Skill**

Location: `claude-config/skills/url-ingest/`

Structure:
```
url-ingest/
├── SKILL.md        # Core workflow, URL detection, templates
└── REFERENCE.md    # Per-domain handling (YouTube→transcript, Medium→readability)
```

Key features:
- Auto-detect URL type (video, article, docs)
- Domain-specific extraction (YouTube transcripts, GitHub READMEs)
- Auto-suggest target note based on content clustering
- Support for batch ingestion

### Phase 2: Enhance Session Management (Priority 2)

**Current session-management skill is good but missing:**

1. **Intent-loaded warmup**: Integrate with park docs for continuity
2. **Daily sync hook**: After sync, auto-suggest relevant past sessions
3. **URL ingest hook**: When ingesting, auto-tag for knowledge graph

Add to `session-management/SKILL.md`:
```yaml
integration_hooks:
  - after_daily_sync: suggest_related_sessions
  - after_url_ingest: add_to_knowledge_graph
  - warmup: load_last_park_intent
```

### Phase 3: Prompt Quality Checklist (Priority 3)

Create: `claude-config/commands/meta/prompt-check.md`

Purpose: User can run `/meta/prompt-check` to validate their prompt before sending

Checks:
- [ ] Intent explicit (not just "read" or "check")
- [ ] Output format specified
- [ ] Scope bounded
- [ ] Priority clear (if multiple items)
- [ ] Success criteria implied

This addresses the 29% "very short" prompts that could be enhanced.

---

## 4. Priority Order

| Priority | Item | Effort | Impact | Why |
|----------|------|--------|--------|-----|
| 1 | Daily Sync Skill | Medium | High | 21% of prompts, daily ritual |
| 2 | URL Ingest Skill | Medium | High | 12% of prompts, knowledge capture |
| 3 | Enhanced Warmup | Low | Medium | Quick upgrade to existing pattern |
| 4 | Prompt Quality Checklist | Low | Medium | Addresses vague prompt anti-pattern |
| 5 | Session Integration Hooks | Medium | Medium | Connects all skills together |

---

## 5. What Already Exists (No Action Needed)

prompt-kit already has these global patterns:
- **HTK workflow**: Excellent for hypothesis-driven work
- **Session management**: Park, remind, link, health
- **Env scanning**: scan-env, env-troubleshoot
- **Code search**: search-code command

These are working well and shouldn't change.

---

## 6. Anti-Pattern Fixes

From the analysis, these anti-patterns need addressing:

### 6.1 Bare Warmups → Intent-Loaded Warmups

**Before:** `Warmup`
**After:** `Warmup. Focus: blog writing. Continue from: oauth-flow-2025-11-15`

Create command `/core/warmup-with-intent.md` that prompts for focus area

### 6.2 URL-Only → URL + Processing

**Before:** `Ingest: https://youtube.com/...`
**After:** Auto-expand via url-ingest skill

### 6.3 Vague Actions → Explicit Outcomes

**Before:** `Check my email`
**After:** Daily sync template with explicit categorization

---

## 7. File Locations Summary

```
~/.claude/ (claude-config/)
├── skills/
│   ├── daily-sync/           # NEW
│   │   ├── SKILL.md
│   │   └── REFERENCE.md
│   ├── url-ingest/           # NEW
│   │   ├── SKILL.md
│   │   └── REFERENCE.md
│   ├── session-management/   # ENHANCE
│   └── htk-workflow/         # KEEP AS-IS
├── commands/
│   ├── core/
│   │   └── warmup-intent.md  # NEW
│   └── meta/
│       └── prompt-check.md   # NEW
```

---

## 8. Next Steps

1. Create `daily-sync` skill with triggers and templates
2. Create `url-ingest` skill with domain-specific handlers
3. Update warmup pattern to include intent
4. Add integration hooks to session-management
5. Create prompt quality checklist command

---

**Analysis complete.** These recommendations are based on actual usage patterns from 172 prompts and align with prompt-kit's existing architecture (progressive disclosure, global vs project, skills vs commands).
