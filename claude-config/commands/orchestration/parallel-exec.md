# Parallel Command Execution

Execute multiple independent commands or tasks concurrently: **$ARGUMENTS**

## Purpose

Run multiple independent operations in parallel to maximize efficiency when tasks don't depend on each other.

## Execution

### 1. Parse Task List

Extract tasks from `$ARGUMENTS`:
- Comma-separated commands
- Newline-separated operations
- JSON array of tasks

### 2. Validate Independence

Check that tasks are truly independent:
- No shared file writes
- No sequential dependencies
- No conflicting resource access

If dependencies detected, warn user and suggest sequential execution.

### 3. Execute in Parallel

**For shell commands:**
```bash
tasks=("$@")
pids=()
results=()

# Launch all tasks in background
for task in "${tasks[@]}"; do
  {
    eval "$task"
    echo $? > /tmp/parallel-$$-${#pids[@]}.exit
  } &
  pids+=($!)
done

# Wait for all to complete
for pid in "${pids[@]}"; do
  wait $pid
done

# Collect results
for i in "${!pids[@]}"; do
  exit_code=$(cat /tmp/parallel-$$-$i.exit)
  results+=($exit_code)
  rm /tmp/parallel-$$-$i.exit
done
```

**For tool operations:**
Launch multiple tool calls in single message when using Claude Code tools.

### 4. Aggregate Results

Collect:
- Exit codes / success status
- Output from each task
- Execution time
- Any errors or warnings

### 5. Report

Format:
```
# PARALLEL EXECUTION RESULTS

Completed: <n> of <n> tasks
Duration: <total time>
Success: <n> tasks
Failed: <n> tasks

## Task Results

✅ <task 1>: <brief result> (<duration>)
✅ <task 2>: <brief result> (<duration>)
❌ <task 3>: <error message> (<duration>)

## Failed Tasks (if any)

<task>:
<full error output>
```

## Examples

### Example 1: Multi-Service Health Check

**Input:** `$ARGUMENTS: "Check database, Redis, and API health"`

**Execution:**
```bash
# Parallel health checks
(curl -f http://localhost:8080/health && echo "API: ✅") &
(redis-cli ping > /dev/null && echo "Redis: ✅") &
(pg_isready -h localhost && echo "PostgreSQL: ✅") &
wait
```

**Output:**
```
# PARALLEL EXECUTION RESULTS

Completed: 3 of 3 tasks
Duration: 1.2s
Success: 3 tasks
Failed: 0 tasks

## Task Results

✅ API health check: Healthy (0.3s)
✅ Redis health check: PONG received (0.1s)
✅ PostgreSQL health check: Accepting connections (0.2s)
```

### Example 2: Multiple Code Analysis Tasks

**Input:** `$ARGUMENTS: "Run linter, type checker, and tests in parallel"`

**Execution:**
```bash
# Analysis in parallel
(eslint . > /tmp/lint.log 2>&1; echo "Lint: $?") &
(tsc --noEmit > /tmp/typecheck.log 2>&1; echo "TypeCheck: $?") &
(npm test > /tmp/test.log 2>&1; echo "Test: $?") &
wait

# Aggregate results
cat /tmp/lint.log /tmp/typecheck.log /tmp/test.log
```

**Output:**
```
# PARALLEL EXECUTION RESULTS

Completed: 3 of 3 tasks
Duration: 15.3s
Success: 2 tasks
Failed: 1 task

## Task Results

✅ ESLint: No errors found (3.2s)
❌ TypeScript: 5 type errors (4.1s)
✅ Test Suite: 47 passed (8.0s)

## Failed Tasks

TypeScript type checking:
src/api/users.ts:23:5 - error TS2339: Property 'email' does not exist on type 'User'.
src/api/users.ts:45:12 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
...
```

### Example 3: Environment Validation

**Input:** `$ARGUMENTS: "Validate staging and production environments"`

**Execution:**
```bash
# Check multiple environments concurrently
(
  echo "=== STAGING ===" &&
  curl -f https://staging.api.example.com/health &&
  echo "Status: ✅"
) &

(
  echo "=== PRODUCTION ===" &&
  curl -f https://api.example.com/health &&
  echo "Status: ✅"
) &

wait
```

**Output:**
```
# PARALLEL EXECUTION RESULTS

Completed: 2 of 2 tasks
Duration: 0.8s
Success: 2 tasks
Failed: 0 tasks

## Task Results

✅ Staging environment: Healthy, version 2.3.1 (0.4s)
✅ Production environment: Healthy, version 2.3.0 (0.5s)

## Notes

- Staging is 1 version ahead of production
- Both environments responding normally
```

### Example 4: Multi-Tool Discovery

**Input:** `$ARGUMENTS: "Check for git, docker, node, and python"`

**Execution:**
```bash
tools=("git" "docker" "node" "python3")

for tool in "${tools[@]}"; do
  (
    if which "$tool" > /dev/null 2>&1; then
      version=$("$tool" --version 2>&1 | head -1)
      echo "$tool: ✅ $version"
    else
      echo "$tool: ❌ Not found"
    fi
  ) &
done

wait
```

**Output:**
```
# PARALLEL EXECUTION RESULTS

Completed: 4 of 4 tasks
Duration: 0.3s
Success: 4 tasks
Failed: 0 tasks

## Task Results

✅ git: Git version 2.39.1 (0.1s)
✅ docker: Docker version 24.0.7 (0.1s)
✅ node: v20.11.0 (0.1s)
✅ python3: Python 3.11.6 (0.1s)
```

## Use Cases

**When to use parallel execution:**
- ✅ Independent health checks
- ✅ Multi-environment validation
- ✅ Tool discovery/version checks
- ✅ Parallel test suites (if isolated)
- ✅ Multiple API calls to different services
- ✅ File operations on different directories

**When NOT to use:**
- ❌ Sequential pipeline (A produces input for B)
- ❌ Shared resource writes (race conditions)
- ❌ Order-dependent operations
- ❌ Single-threaded tools (e.g., npm install)
- ❌ Operations with side effects that interfere

## Error Handling

**Graceful Degradation:**
- Continue executing remaining tasks if one fails
- Collect all errors for final report
- Mark overall execution as failed if any task fails

**Timeout Protection:**
```bash
# Add timeout to prevent hanging
timeout 60s <command> || echo "Task timed out after 60s"
```

**Resource Limits:**
```bash
# Limit concurrent tasks to avoid overwhelming system
max_parallel=4
count=0

for task in "${tasks[@]}"; do
  while [ $(jobs -r | wc -l) -ge $max_parallel ]; do
    sleep 0.1
  done

  eval "$task" &
done

wait
```

## Integration

This command can be:
- Called directly by user: `/parallel-exec "cmd1, cmd2, cmd3"`
- Invoked by skills for concurrent operations
- Used in pipelines for independent validation steps
- Combined with HTK workflow for parallel experiments

## Validation Rules

Before executing:
- [ ] All tasks are truly independent
- [ ] No file conflicts possible
- [ ] No shared state mutations
- [ ] Timeouts set appropriately
- [ ] Resource limits considered
