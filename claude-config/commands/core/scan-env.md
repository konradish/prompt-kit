# Enhanced Environment Discovery

**CEI Core Command**: Systematic environment discovery and analysis with structured output

## Objective

Analyze the current development environment systematically using parallel execution and structured output. Generate comprehensive environment intelligence in workspace-isolated location.

## Execution Strategy

<environment_analysis>
<system_info>
Gather OS details, architecture, kernel version, and distribution information using parallel system calls
</system_info>

<tool_discovery>
Identify available development tools and their versions using concurrent tool detection
</tool_discovery>

<limitation_detection>
Test for known environment limitations including:
- WSL2 symlink behavior with git operations
- File system permissions and mount points  
- Network connectivity and proxy settings
- Container runtime availability and configuration
</limitation_detection>

<performance_baseline>
Establish baseline metrics for file I/O, network latency, and compute performance
</performance_baseline>
</environment_analysis>

## Implementation

### Phase 1: Parallel System Discovery
Execute these commands simultaneously for maximum efficiency:

**System Information** (parallel execution):
- `uname -a` - complete system information
- `cat /etc/os-release` - distribution details
- `lscpu | head -20` - CPU architecture and capabilities
- `free -h` - memory information
- `df -h /` - root filesystem usage

**Mount and Storage Analysis** (parallel execution):
- `mount | grep -E '^(/dev|tmpfs)'` - active mounts
- `ls -la ~ | grep -E '^l'` - symlink analysis
- `ls -la /mnt 2>/dev/null || echo 'no /mnt'` - WSL2 mount points
- `findmnt -T $PWD` - current directory filesystem

### Phase 2: Tool Detection and Validation
Run concurrent tool discovery for comprehensive inventory:

**Core Development Tools**:
```bash
# Execute in parallel batches for efficiency
tools=("git" "gh" "docker" "node" "npm" "python3" "pip" "curl" "jq")
for tool in "${tools[@]}"; do
  (which $tool && $tool --version 2>/dev/null) &
done
wait
```

**Specialized Tools**:
```bash  
specialized=("wrangler" "uv" "uvx" "direnv" "aider" "repomix" "sgpt")
for tool in "${specialized[@]}"; do
  (which $tool && $tool --version 2>/dev/null) &
done
wait
```

**Authentication Status**:
- `gh auth status` - GitHub CLI authentication
- `docker info` - Docker daemon status
- `git config --global user.name` - Git configuration

### Phase 3: Network Connectivity Assessment
Test connectivity to key services concurrently:

```bash
# Parallel network tests
curl --head --max-time 5 https://api.github.com &
curl --head --max-time 5 https://api.cloudflare.com &
curl --head --max-time 5 https://registry.npmjs.org &
curl --head --max-time 5 https://pypi.org &
wait
```

### Phase 4: Performance Benchmarking
Establish performance baselines:

**File I/O Testing**:
```bash
# Test different filesystem performance
dd if=/dev/zero of=/tmp/test_file bs=1M count=100 2>&1 &
dd if=/dev/zero of=/mnt/c/temp/test_file bs=1M count=100 2>&1 &
wait
```

**Network Latency**:
```bash
# Measure network performance
ping -c 4 8.8.8.8 &
ping -c 4 github.com &
wait
```

### Phase 5: Environment Limitation Detection

**WSL2 Specific Tests**:
```bash
# Test git operations in different locations
cd /tmp && git init test_repo && cd test_repo && git status
cd ~/projects 2>/dev/null && git status || echo "Symlink git failure detected"
```

**Permission Testing**:
```bash
# Test file permissions and capabilities
touch /tmp/permission_test && rm /tmp/permission_test
docker run --rm hello-world 2>/dev/null || echo "Docker access limited"
```

## Structured Output Format

Generate output in XML format for reliable parsing:

```xml
<environment_scan>
<scan_metadata>
<timestamp>2024-01-15T10:30:00Z</timestamp>
<scan_duration>3.2s</scan_duration>
<cei_version>1.0.0</cei_version>
</scan_metadata>

<system_profile>
<os>Ubuntu 22.04.1 LTS</os>
<kernel>5.15.167.4-microsoft-standard-WSL2</kernel>
<architecture>x86_64</architecture>
<environment_type>WSL2</environment_type>
<memory_total>16GB</memory_total>
<storage_root>ext4 - 512GB available</storage_root>
</system_profile>

<tool_inventory>
<tool name="git" version="2.39.1" status="✅" location="/usr/bin/git">
  <auth_status>configured (user.name set)</auth_status>
  <limitations>fails in symlinked directories</limitations>
</tool>
<tool name="docker" version="24.0.7" status="⚠️" location="/usr/bin/docker">
  <auth_status>daemon accessible</auth_status>
  <limitations>requires manual start</limitations>
</tool>
<tool name="gh" version="2.40.1" status="✅" location="/usr/bin/gh">
  <auth_status>authenticated</auth_status>
</tool>
<!-- Additional tools... -->
</tool_inventory>

<network_analysis>
<connectivity>
<service name="GitHub API" url="api.github.com" status="✅" response_time="125ms"/>
<service name="Cloudflare API" url="api.cloudflare.com" status="✅" response_time="89ms"/>
<service name="NPM Registry" url="registry.npmjs.org" status="✅" response_time="156ms"/>
</connectivity>
<dns_resolution>
<server>8.8.8.8</server>
<avg_latency>12ms</avg_latency>
</dns_resolution>
</network_analysis>

<performance_metrics>
<file_io>
<filesystem path="/tmp" type="ext4" write_speed="2.1GB/s" read_speed="2.8GB/s"/>
<filesystem path="/mnt/c" type="9p" write_speed="145MB/s" read_speed="187MB/s"/>
</file_io>
<network_latency>
<target host="github.com" avg="28ms" status="good"/>
<target host="8.8.8.8" avg="12ms" status="excellent"/>
</network_latency>
</performance_metrics>

<environment_limitations>
<limitation severity="high" category="git">
<description>Git operations fail in symlinked directories (WSL2 limitation)</description>
<workaround>Use real paths for git repositories</workaround>
<affected_paths>~/projects (if symlinked to /mnt/c)</affected_paths>
</limitation>
<limitation severity="medium" category="performance">
<description>9P filesystem significantly slower than ext4</description>
<workaround>Use ext4 locations for performance-critical operations</workaround>
<affected_paths>/mnt/c/*</affected_paths>
</limitation>
<limitation severity="low" category="docker">
<description>Docker daemon requires manual start</description>
<workaround>sudo service docker start</workaround>
</limitation>
</environment_limitations>

<recommendations>
<recommendation priority="high" category="setup">
Configure git safe.directory for symlinked repositories
</recommendation>
<recommendation priority="medium" category="performance">
Use ext4 filesystem for development work when possible
</recommendation>
<recommendation priority="low" category="automation">
Set up Docker auto-start script
</recommendation>
</recommendations>

<summary>
<status>✅ Development Ready</status>
<confidence>High</confidence>
<critical_issues>0</critical_issues>
<warnings>2</warnings>
<environment_score>8.5/10</environment_score>
</summary>
</environment_scan>
```

## Workspace Management

### Output Location
Create isolated workspace: `workspace/scan-env-$(date +%Y%m%d-%H%M%S)/`

### Generated Files
- `environment-scan.xml` - Structured XML output
- `environment-report.md` - Human-readable summary
- `environment-profile.json` - Machine-parseable data
- `recommendations.md` - Actionable improvement suggestions

### Output Format Options
Support multiple formats via `$ARGUMENTS`:

- `$ARGUMENTS --format=xml` - Structured XML (default)
- `$ARGUMENTS --format=markdown` - Human-readable report
- `$ARGUMENTS --format=json` - Machine-parseable JSON
- `$ARGUMENTS --format=memory` - CLAUDE.md compatible format

## Error Handling

### Graceful Degradation
- **Missing tools**: Mark as "not available" rather than failing
- **Permission errors**: Document limitations and suggest workarounds
- **Network failures**: Continue with offline analysis
- **Performance test failures**: Use fallback methods or skip

### Retry Logic
- **Network calls**: 2 retries with exponential backoff
- **Tool detection**: Single retry for transient failures
- **File operations**: Immediate failure (permission issues)

### Security Considerations
- **No credential exposure**: Sanitize all outputs
- **Safe commands only**: Read-only operations unless explicitly needed
- **Rate limiting**: Respect API limits and network resources

## Verification Steps

1. **Parallel execution**: Verify multiple tools run concurrently
2. **XML validation**: Ensure output parses correctly
3. **Performance impact**: Scan should complete in <5 seconds
4. **Error handling**: Test with missing tools and restricted permissions
5. **Cross-platform**: Verify behavior on WSL2, Linux, macOS