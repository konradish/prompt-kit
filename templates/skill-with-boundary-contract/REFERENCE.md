# Skill Name — Reference

Complete specifications, examples, and troubleshooting for [Skill Name].

---

## Boundary Contract Specification

### Input Schema

```yaml
inputs:
  input1:
    type: string
    required: true
    constraints:
      - "max_length: 1000"
      - "pattern: ^[a-zA-Z0-9_-]+$"
    examples:
      - "valid-input-1"
      - "another_valid_input"

  input2:
    type: object
    required: false
    properties:
      field1: string
      field2: number
    defaults:
      field1: "default_value"
      field2: 0
```

### Output Schema

```yaml
outputs:
  primary_output:
    type: file
    format: json
    location: "output/{input1}.json"
    schema:
      id: string
      created_at: ISO8601
      data: object

  side_effects:
    - type: log_entry
      location: "logs/skill-name.log"
      format: "[timestamp] [level] message"
```

### Validation Rules

```yaml
invariants:
  pre_conditions:
    - "Input file must exist"
    - "User must have write permissions to output directory"

  post_conditions:
    - "Output file is valid JSON"
    - "Output file size < 10MB"
    - "No sensitive data in output (PII check passed)"

  runtime_constraints:
    - "Execution time < 30 seconds"
    - "Memory usage < 512MB"
```

---

## Detailed Workflow

### Phase 1: Input Validation

**Step 1.1: Check Required Inputs**
```bash
# Verify input file exists
test -f "$INPUT_FILE" || { echo "Error: Input file not found"; exit 1; }
```

**Step 1.2: Validate Input Format**
```python
# Example validation logic
def validate_input(data):
    if len(data) > 1000:
        raise ValueError("Input exceeds max length")
    if not re.match(r'^[a-zA-Z0-9_-]+$', data):
        raise ValueError("Input contains invalid characters")
    return True
```

**Step 1.3: Check Preconditions**
- Verify file permissions
- Check available disk space
- Validate external service connectivity (if applicable)

### Phase 2: Core Execution

**Step 2.1: [First Major Step]**

[Detailed description of what happens in this step]

Example:
```python
# Process input
result = process_input(validated_input)
```

**Step 2.2: [Second Major Step]**

[Detailed description]

See also: [Link to external documentation if applicable]

**Step 2.3: [Third Major Step]**

[Detailed description]

### Phase 3: Output Verification

**Step 3.1: Validate Output Format**
```bash
# Verify JSON is valid
jq '.' output.json > /dev/null 2>&1 || { echo "Invalid JSON output"; exit 1; }
```

**Step 3.2: Check Postconditions**
- Output file size within limits
- Required fields present
- No sensitive data leaked

**Step 3.3: User-Seam Test**
```bash
# Verify output is accessible at expected location
curl -s http://localhost:3000/api/output/123 | jq '.status'
# Expected: "success"
```

---

## Examples

### Example 1: Basic Usage

**Input:**
```json
{
  "input1": "example-task",
  "input2": {
    "field1": "value1",
    "field2": 42
  }
}
```

**Expected Output:**
```json
{
  "id": "example-task-20231201",
  "created_at": "2023-12-01T10:00:00Z",
  "data": {
    "processed": true,
    "result": "success"
  }
}
```

### Example 2: Edge Case — Missing Optional Input

**Input:**
```json
{
  "input1": "minimal-task"
}
```

**Expected Output:**
```json
{
  "id": "minimal-task-20231201",
  "created_at": "2023-12-01T10:00:00Z",
  "data": {
    "processed": true,
    "result": "success",
    "used_defaults": true
  }
}
```

### Example 3: Validation Failure

**Input:**
```json
{
  "input1": "invalid input with spaces!"
}
```

**Expected Error:**
```
Validation Error: input1 contains invalid characters
Pattern required: ^[a-zA-Z0-9_-]+$
Received: "invalid input with spaces!"
```

---

## Troubleshooting

### Common Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| "Input file not found" | Path is relative, not absolute | Use `$(pwd)/filename` |
| "Permission denied" | Output directory not writable | Check `ls -la` on target dir |
| "Timeout exceeded" | Large input file | Increase timeout or chunk input |
| "Invalid JSON output" | Upstream encoding issue | Check input encoding is UTF-8 |

### Debug Mode

Enable verbose logging:
```bash
export SKILL_DEBUG=1
```

This outputs:
- Input validation steps
- Each phase entry/exit
- Timing information
- Memory usage snapshots

### Recovery Procedures

**If skill fails mid-execution:**
1. Check for partial output files
2. Remove incomplete outputs: `rm -f output/*.partial`
3. Reset any modified state
4. Re-run with `--resume` flag if supported

**If validation repeatedly fails:**
1. Examine raw input: `cat input.json | jq '.'`
2. Check constraint violations one by one
3. Consult Examples section for valid formats

---

## Integration Patterns

### With Other Skills

```yaml
# This skill can chain to:
chains_to:
  - skill: post-processor
    trigger: on_success
    passes: output.json

  - skill: error-handler
    trigger: on_failure
    passes: error_log.txt

# This skill depends on:
depends_on:
  - skill: input-validator
    receives: validated_input.json
```

### With Agents

When escalated to an agent:
1. Pass the full boundary contract as context
2. Include the specific failure reason
3. Request agent to either fix input or modify constraints

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-01 | Initial release |
| 1.1.0 | 2024-02-01 | Added validation rules |
| 1.2.0 | 2024-03-01 | Improved error messages |

---

*This reference document should NOT link to other REFERENCE.md files (keep depth = 1).*
