---
description: Add timestamped note to current session for later park document processing
---

You are about to add a quick timestamped note to the current session's running notes file. These notes will be incorporated when `/session/park` is run.

## Usage

When the user runs `/session/note [content]`, capture the note and append it to `.claude-sessions/current-session-notes.md`.

## Format

```markdown
### YYYY-MM-DD HH:MM:SS

[User's note content]

---
```

## Execution

1. **Check for existing notes file**
   - File: `.claude-sessions/current-session-notes.md`
   - Create if doesn't exist with header:
     ```markdown
     # Current Session Notes

     Quick notes accumulated during session for park document processing.

     ---
     ```

2. **Append timestamped note**
   - Add timestamp in format: `YYYY-MM-DD HH:MM:SS`
   - Add user's note content
   - Add separator `---`

3. **Confirm to user**
   - "Note added to current session notes"
   - Show note content for verification

## Examples

**User runs:** `/session/note Found bug in OAuth redirect - needs to handle state param`

**Appends:**
```markdown
### 2025-11-18 14:32:15

Found bug in OAuth redirect - needs to handle state param

---
```

**User runs:** `/session/note Need to add validation skill for pre-commit checks`

**Appends:**
```markdown
### 2025-11-18 14:45:22

Need to add validation skill for pre-commit checks

---
```

## Integration with /session/park

When `/session/park` runs:
1. Reads `current-session-notes.md`
2. Incorporates notes into relevant park document sections
3. Clears `current-session-notes.md` after successful park

## Success Criteria

- Note appended with accurate timestamp
- File created if didn't exist
- User confirmation shown
- Format consistent for easy parsing
