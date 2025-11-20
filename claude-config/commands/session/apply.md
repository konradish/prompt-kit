---
description: Extract and apply .claude improvements from recent park documents
---

You are about to analyze recent park documents and apply accumulated `.claude` improvement suggestions to skills, commands, and documentation.

## Analysis Phase

1. **Read Recent Park Documents**
   - Check `.claude-sessions/` for park documents from last 7 days
   - Extract all `.claude Improvements` sections
   - Group suggestions by type: skills, commands, CLAUDE.md, REFERENCE.md

2. **Identify Patterns**
   - Count repeated suggestions (e.g., "forgot X 3 times")
   - Prioritize high-frequency pain points
   - Note blocking issues vs. nice-to-haves

3. **Assess Impact**
   - High impact: Prevents repeated mistakes
   - Medium impact: Improves efficiency
   - Low impact: Minor convenience

## Application Strategy

### For Skills
- Create new skill if 3+ sessions needed it
- Update existing skill if pattern unclear
- Add to REFERENCE.md if detail missing
- Location: `~/.claude/skills/[domain]/`

### For Commands
- Create new command if workflow repeated 2+ times
- Update existing command if incomplete
- Location: `~/.claude/commands/[category]/`

### For CLAUDE.md
- Add to Quick Commands if new script/workflow
- Add to Best Practices if repeated mistake
- Add to Troubleshooting if common issue
- Keep under 100 lines (link to docs/ for details)

### For REFERENCE.md
- Add technical details that were hard to find
- Clarify ambiguous instructions
- Add examples for complex patterns
- Keep under 600 lines per file

## Execution Workflow

1. **Scan Park Documents**
   ```bash
   # Find park documents from last 7 days
   find .claude-sessions/ -name "*-compressed.md" -mtime -7
   ```

2. **Extract Suggestions**
   - Read each park document
   - Collect all `.claude Improvements` items
   - Categorize by type and impact

3. **Apply Changes**
   - Start with high-impact, high-frequency items
   - Create/update files as needed
   - Test commands/skills if possible
   - Follow progressive disclosure (link vs. duplicate)

## Validate Spec Sync

1. **Scan park documents for "Spec Updates" section**
   - Extract boundary additions/modifications
   - Extract module spec updates

2. **Validate CSV sync:**
   - For each boundary mentioned in park docs, check if exists in BOUNDARY_INDEX.csv
   - Flag missing boundaries: "❌ Boundary '<name>' in park doc but missing from CSV"
   - Suggest command: `python specs/kernel/add-boundary.py --name <name> ...`

3. **Validate module spec coverage:**
   ```bash
   python specs/kernel/sync-spec-coverage.py --report
   # Parse drift-report.txt for discrepancies
   ```

4. **Report spec sync status:**
   - ✅ All boundaries synced (CSV + module specs aligned)
   - ⚠️ Drift detected: [list boundaries in CSV but not in specs]
   - ❌ CSV validation failed: [list errors from validate-boundaries.py]
   - 💡 Suggested fixes: [commands to run]

5. **Auto-apply fixes (if safe):**
   - If drift is just missing FR rows → offer to update module spec
   - If CSV has validation errors → do NOT auto-fix (manual review needed)

## Report Summary

After completing the above validation:
   ```markdown
   ## Session Apply Report - YYYY-MM-DD

   ### Park Documents Analyzed
   - YYYY-MM-DD-[topic] (X improvements)
   - YYYY-MM-DD-[topic] (X improvements)

   ### Changes Applied

   #### Skills Created/Updated
   - [skill-name]: [what changed]

   #### Commands Created/Updated
   - [command-name]: [what changed]

   #### CLAUDE.md Updates
   - [section]: [what added]

   #### REFERENCE.md Updates
   - [file]: [what clarified]

   ### Spec Sync Status

   #### Boundaries Validated
   - ✅ [boundary-name]: CSV + module spec aligned
   - ⚠️ [boundary-name]: Drift detected - [description]
   - ❌ [boundary-name]: CSV validation failed - [error]

   #### Module Specs Checked
   - [module-name]: [X boundaries verified]

   #### Recommended Actions
   - [ ] Run: `python specs/kernel/add-boundary.py --name <name> ...`
   - [ ] Update module spec FR table for [module]
   - [ ] Create CONTRACT.md for [boundary]

   ### Patterns Detected
   - [Pattern]: Occurred in X sessions → [Action taken]

   ### Deferred Items
   - [Item]: [Why deferred]

   ### Next Session Focus
   - [Suggestion for user's next workflow improvement]
   ```

5. **Clean Up**
   - Mark applied suggestions as complete in park documents
   - Archive park documents > 30 days to `.claude-sessions/archive/`

## Success Criteria

- High-impact improvements applied immediately
- Patterns detected and addressed
- No duplicate content across files
- Progressive disclosure maintained
- File size limits respected
- Changes tested where possible

## Important Notes

- **Don't apply everything blindly** - Use judgment on value
- **Prefer links over duplication** - Keep files focused
- **Test before committing** - Verify commands/skills work
- **Respect file size limits** - CLAUDE.md < 100 lines, SKILL.md < 500 lines
- **Document rationale** - Explain why suggestion applied or deferred
