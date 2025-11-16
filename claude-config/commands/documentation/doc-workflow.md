# Document and Test Tool Workflow

Document (./tool-workflow-timestamp.md) and validate a specific tool workflow with verified steps: **$ARGUMENTS**

## Execution

### 1. Pre-flight & Workspace Setup
- Create workspace directory: `workspace/{tool}-{workflow}-{timestamp}`
- Change to workspace for all file operations
- Verify tool version, auth status, and permissions
- Check for missing prerequisites

### 2. Workflow Discovery
- Document exact commands for each step
- Note configuration requirements and decision points
- Identify dry-run options and verification methods

### 3. Execution with Verification
- Use dry-run mode when available, request approval if destructive
- Execute each step from workspace, capture output, verify success
- Stop on failures, document errors, request human guidance
- Never use placeholders - all commands must be verified

### 4. Generate Dense Guide
```
Tool: {tool_name} v{version}
Auth: {auth_status}
Workflow: {workflow_name}
Workspace: {workspace_path}

Steps:
1. {command} → {expected_output} | verify: {success_indicator}
2. {command} → {expected_output} | verify: {success_indicator}

Workspace Cleanup: rm -rf {workspace_path}
Service Cleanup: {rollback_commands}
Limitations: {discovered_issues}
```

## Requirements
- All commands verified through execution
- No placeholders or unverified steps  
- Reproducible by other agents
- Clear workspace isolation and cleanup instructions
- Separate service/resource cleanup from workspace cleanup

**Workspace Benefits:**
- Clean working directory
- Multiple experiments can coexist
- Easy cleanup without affecting other work
- Clear audit trail of generated vs. pre-existing files