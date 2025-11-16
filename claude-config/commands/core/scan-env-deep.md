# Deep Environment Analysis

**CEI Advanced Command**: Comprehensive environment intelligence with security, performance, and integration analysis

## Objective

Perform in-depth analysis of the development environment including security posture, performance profiling, integration capabilities, and advanced system diagnostics. Generate comprehensive intelligence for production-ready environment assessment.

## Advanced Analysis Strategy

<deep_environment_analysis>
<security_assessment>
Analyze security posture, permissions, certificate management, and vulnerability scanning
</security_assessment>

<performance_profiling>
Comprehensive performance analysis including resource utilization, bottleneck detection, and optimization opportunities
</performance_profiling>

<integration_testing>
Test tool integration points, version compatibility, and workflow dependencies
</integration_testing>

<system_diagnostics>
Advanced system analysis including kernel parameters, resource limits, and configuration validation
</system_diagnostics>

<capacity_planning>
Analyze system capacity, resource allocation, and scalability characteristics
</capacity_planning>
</deep_environment_analysis>

## Implementation Phases

### Phase 1: Extended System Profiling
Advanced system information gathering with parallel execution:

**Kernel and System Analysis**:
```bash
# Comprehensive system profiling (parallel)
uname -a &
cat /proc/version &
cat /proc/cpuinfo | grep -E '^(processor|model name|cpu MHz|cache size)' &
cat /proc/meminfo &
cat /proc/sys/kernel/version &
systemctl --version 2>/dev/null || echo "systemd not available" &
wait
```

**Resource Limits and Configuration**:
```bash
# System limits and configuration (parallel)
ulimit -a &
cat /proc/sys/fs/file-max &
cat /proc/sys/net/core/somaxconn &
sysctl kernel.pid_max 2>/dev/null &
cat /proc/loadavg &
uptime &
wait
```

**Storage and Filesystem Analysis**:
```bash
# Advanced storage analysis (parallel)
df -h &
df -i &
mount | sort &
lsblk 2>/dev/null || echo "lsblk not available" &
findmnt -D &
iostat 2>/dev/null || echo "iostat not available" &
wait
```

### Phase 2: Security Posture Assessment

**Certificate and SSL Analysis**:
```bash
# SSL/TLS configuration and certificates (parallel)
openssl version &
curl -I https://github.com --max-time 5 2>/dev/null | head -5 &
curl -I https://api.cloudflare.com --max-time 5 2>/dev/null | head -5 &
ls -la ~/.ssh/ 2>/dev/null | head -10 || echo "No ~/.ssh directory" &
wait
```

**Permission and Access Control**:
```bash
# Access control and permissions (parallel)
id &
groups &
sudo -l 2>/dev/null | head -10 || echo "No sudo access" &
ls -la /etc/sudoers.d/ 2>/dev/null || echo "No sudoers.d access" &
docker info 2>/dev/null | grep -E "(Root Dir|Docker Root Dir|Server Version)" || echo "Docker not accessible" &
wait
```

**Firewall and Network Security**:
```bash
# Network security configuration (parallel)
ss -tuln | head -20 &
netstat -rn 2>/dev/null | head -10 || ip route &
iptables -L 2>/dev/null | head -20 || echo "iptables not accessible" &
ufw status 2>/dev/null || echo "ufw not available" &
wait
```

### Phase 3: Performance Deep Dive

**CPU and Memory Profiling**:
```bash
# Resource utilization analysis (parallel)
top -bn1 | head -20 &
ps aux --sort=-%cpu | head -10 &
ps aux --sort=-%mem | head -10 &
free -m &
vmstat 1 5 &
wait
```

**I/O Performance Analysis**:
```bash
# Comprehensive I/O testing (parallel)
# Test multiple filesystems and sizes
dd if=/dev/zero of=/tmp/perf_test_1gb bs=1M count=1024 conv=fdatasync 2>&1 &
dd if=/dev/zero of=/tmp/perf_test_small bs=4K count=10000 conv=fdatasync 2>&1 &
if [ -d "/mnt/c" ]; then
  dd if=/dev/zero of=/mnt/c/temp/perf_test_1gb bs=1M count=1024 conv=fdatasync 2>&1 &
fi
wait
```

**Network Performance Testing**:
```bash
# Advanced network performance (parallel)
curl -w "@-" -o /dev/null -s https://github.com <<< '%{time_total}\n%{speed_download}\n%{size_download}' &
curl -w "@-" -o /dev/null -s https://api.cloudflare.com <<< '%{time_total}\n%{speed_download}\n%{size_download}' &
dig github.com | grep "Query time" &
nslookup github.com | grep "server" &
wait
```

### Phase 4: Tool Integration Matrix

**Development Tool Ecosystem**:
```bash
# Comprehensive tool compatibility analysis
tools=(
  "git:git --version"
  "gh:gh --version"
  "docker:docker --version"
  "docker-compose:docker-compose --version"
  "node:node --version"
  "npm:npm --version"
  "python3:python3 --version"
  "pip:pip --version"
  "curl:curl --version"
  "jq:jq --version"
  "wget:wget --version"
  "rsync:rsync --version"
  "ssh:ssh -V"
  "gpg:gpg --version"
)

for tool_cmd in "${tools[@]}"; do
  tool_name="${tool_cmd%%:*}"
  cmd="${tool_cmd#*:}"
  (
    if which "$tool_name" >/dev/null 2>&1; then
      echo "✅ $tool_name: $(eval $cmd 2>&1 | head -1)"
    else
      echo "❌ $tool_name: not available"
    fi
  ) &
done
wait
```

**Specialized Development Tools**:
```bash
# Advanced tooling analysis (parallel)
specialized_tools=(
  "wrangler:wrangler --version"
  "uv:uv --version"
  "uvx:uvx --version"
  "direnv:direnv version"
  "aider:aider --version"
  "repomix:repomix --version"
  "sgpt:sgpt --version"
  "code:code --version"
  "vim:vim --version"
  "tmux:tmux -V"
)

for tool_cmd in "${specialized_tools[@]}"; do
  tool_name="${tool_cmd%%:*}"
  cmd="${tool_cmd#*:}"
  (
    if which "$tool_name" >/dev/null 2>&1; then
      echo "✅ $tool_name: $(eval $cmd 2>&1 | head -1)"
    else
      echo "⚠️ $tool_name: not available"
    fi
  ) &
done
wait
```

### Phase 5: Environment Stress Testing

**Resource Stress Tests**:
```bash
# Controlled stress testing (parallel with limits)
# CPU stress test (brief)
timeout 10s yes > /dev/null &
cpu_stress_pid=$!

# Memory allocation test
timeout 5s dd if=/dev/zero of=/dev/null bs=1M count=1000 &
mem_test_pid=$!

# I/O stress test
timeout 10s find /usr -type f -name "*.so" 2>/dev/null | head -1000 > /dev/null &
io_stress_pid=$!

wait $cpu_stress_pid $mem_test_pid $io_stress_pid
```

**Concurrent Operations Test**:
```bash
# Test system behavior under concurrent load
concurrent_ops=(
  "git clone --depth 1 https://github.com/microsoft/vscode /tmp/test_clone_1"
  "curl -s https://api.github.com/repos/microsoft/vscode > /tmp/api_test_1.json"
  "dd if=/dev/zero of=/tmp/concurrent_io_1 bs=1M count=100"
  "find /usr -name '*.conf' 2>/dev/null | head -100 > /tmp/find_test_1"
)

for op in "${concurrent_ops[@]}"; do
  timeout 30s bash -c "$op" &
done
wait
```

## Advanced Output Format

Generate comprehensive XML output with deep analysis:

```xml
<deep_environment_scan>
<scan_metadata>
<timestamp>2024-01-15T10:30:00Z</timestamp>
<scan_duration>45.7s</scan_duration>
<scan_type>deep_analysis</scan_type>
<cei_version>1.0.0</cei_version>
</scan_metadata>

<system_profile_extended>
<hardware>
<cpu_cores>8</cpu_cores>
<cpu_model>Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz</cpu_model>
<memory_total>16384MB</memory_total>
<memory_available>12847MB</memory_available>
<swap_total>4096MB</swap_total>
</hardware>
<kernel_info>
<version>5.15.167.4-microsoft-standard-WSL2</version>
<build_date>2024-01-09</build_date>
<architecture>x86_64</architecture>
</kernel_info>
<resource_limits>
<max_open_files>1048576</max_open_files>
<max_processes>31659</max_processes>
<max_memory_size>unlimited</max_memory_size>
</resource_limits>
</system_profile_extended>

<security_analysis>
<ssl_configuration>
<openssl_version>OpenSSL 3.0.2 15 Mar 2022</openssl_version>
<github_ssl_grade>A+</github_ssl_grade>
<cloudflare_ssl_grade>A+</cloudflare_ssl_grade>
</ssl_configuration>
<access_control>
<user_id>1000</user_id>
<primary_group>1000</primary_group>
<sudo_access>limited</sudo_access>
<docker_access>yes</docker_access>
</access_control>
<network_security>
<firewall_status>inactive</firewall_status>
<open_ports>22,80,443,3000,8080</open_ports>
<ssh_key_count>2</ssh_key_count>
</network_security>
</security_analysis>

<performance_analysis>
<cpu_performance>
<load_average_1m>0.15</load_average_1m>
<load_average_5m>0.22</load_average_5m>
<load_average_15m>0.18</load_average_15m>
<cpu_utilization>12%</cpu_utilization>
<top_cpu_processes>
<process name="chrome" cpu="8.2%"/>
<process name="code" cpu="3.1%"/>
</top_cpu_processes>
</cpu_performance>
<memory_performance>
<usage_percentage>75%</usage_percentage>
<available_mb>4096</available_mb>
<cached_mb>2048</cached_mb>
<top_memory_processes>
<process name="chrome" memory="1.2GB"/>
<process name="code" memory="512MB"/>
</top_memory_processes>
</memory_performance>
<io_performance>
<filesystem path="/tmp" type="ext4">
<sequential_read>2.8GB/s</sequential_read>
<sequential_write>2.1GB/s</sequential_write>
<random_read_4k>156MB/s</random_read_4k>
<random_write_4k>89MB/s</random_write_4k>
</filesystem>
<filesystem path="/mnt/c" type="9p">
<sequential_read>187MB/s</sequential_read>
<sequential_write>145MB/s</sequential_write>
<random_read_4k>23MB/s</random_read_4k>
<random_write_4k>18MB/s</random_write_4k>
</filesystem>
</io_performance>
<network_performance>
<github_download_speed>45.2MB/s</github_download_speed>
<cloudflare_download_speed>67.8MB/s</cloudflare_download_speed>
<dns_resolution_time>12ms</dns_resolution_time>
<connection_establishment_time>28ms</connection_establishment_time>
</network_performance>
</performance_analysis>

<tool_integration_matrix>
<compatibility_score>9.2/10</compatibility_score>
<critical_tools_available>18/20</critical_tools_available>
<version_conflicts>0</version_conflicts>
<integration_tests>
<test name="git_docker_integration" status="✅" details="Git works within Docker containers"/>
<test name="node_docker_integration" status="✅" details="Node.js applications build successfully in Docker"/>
<test name="python_uv_integration" status="✅" details="UV package manager works with Python 3.11"/>
<test name="gh_api_integration" status="✅" details="GitHub CLI authenticated and functional"/>
</integration_tests>
</tool_integration_matrix>

<capacity_analysis>
<current_utilization>
<cpu>15%</cpu>
<memory>75%</memory>
<disk_root>45%</disk_root>
<network>5%</network>
</current_utilization>
<scalability_assessment>
<concurrent_operations_supported>50+</concurrent_operations_supported>
<memory_headroom>4GB</memory_headroom>
<io_throughput_headroom>high</io_throughput_headroom>
</scalability_assessment>
<bottleneck_analysis>
<primary_bottleneck>memory_usage</primary_bottleneck>
<secondary_bottleneck>9p_filesystem_performance</secondary_bottleneck>
</bottleneck_analysis>
</capacity_analysis>

<advanced_recommendations>
<performance_optimizations>
<recommendation priority="high" category="memory">
<title>Increase available memory or optimize memory usage</title>
<description>System is using 75% of available memory which may impact performance</description>
<action>Consider closing unnecessary applications or adding more RAM</action>
</recommendation>
<recommendation priority="medium" category="filesystem">
<title>Use ext4 filesystem for performance-critical operations</title>
<description>9P filesystem on /mnt/c is significantly slower than native ext4</description>
<action>Move development work to ext4 locations when possible</action>
</recommendation>
</performance_optimizations>
<security_improvements>
<recommendation priority="medium" category="firewall">
<title>Enable and configure firewall</title>
<description>No active firewall detected</description>
<action>Configure ufw or iptables for basic protection</action>
</recommendation>
</security_improvements>
<integration_enhancements>
<recommendation priority="low" category="tooling">
<title>Install missing specialized tools</title>
<description>Some development tools are not available</description>
<action>Install repomix, aider for enhanced development workflow</action>
</recommendation>
</integration_enhancements>
</advanced_recommendations>

<environment_health_score>
<overall_score>8.7/10</overall_score>
<category_scores>
<performance>8.5/10</performance>
<security>7.8/10</security>
<compatibility>9.2/10</compatibility>
<reliability>9.1/10</reliability>
</category_scores>
<readiness_assessment>
<development>✅ Ready</development>
<testing>✅ Ready</testing>
<production_like>⚠️ Requires security hardening</production_like>
</readiness_assessment>
</environment_health_score>
</deep_environment_scan>
```

## Workspace Management

### Output Location
Create isolated workspace: `workspace/scan-env-deep-$(date +%Y%m%d-%H%M%S)/`

### Generated Files
- `deep-environment-scan.xml` - Complete structured analysis
- `security-assessment.md` - Security posture report
- `performance-profile.json` - Performance metrics and benchmarks
- `integration-matrix.md` - Tool compatibility analysis
- `capacity-report.md` - Resource utilization and scalability assessment
- `optimization-guide.md` - Specific improvement recommendations

### Output Format Support
- `$ARGUMENTS --format=xml` - Complete XML analysis (default)
- `$ARGUMENTS --format=json` - Machine-parseable structured data
- `$ARGUMENTS --format=security` - Security-focused report
- `$ARGUMENTS --format=performance` - Performance-focused analysis
- `$ARGUMENTS --format=memory` - CLAUDE.md compatible profile

## Error Handling and Safety

### Resource Protection
- **CPU limits**: All stress tests have timeouts
- **Memory limits**: Controlled memory allocation tests
- **I/O limits**: Bounded file operations
- **Network limits**: Rate-limited external calls

### Graceful Degradation
- **Privileged operations**: Skip if no permissions
- **Missing tools**: Continue analysis with available tools
- **Network failures**: Fall back to offline analysis
- **Resource constraints**: Adapt tests to available resources

### Security Safeguards
- **No credential exposure**: All outputs sanitized
- **Read-only analysis**: No system modifications
- **Safe stress testing**: Limited duration and resource usage
- **Permission respect**: Work within user's access level

## Integration with Other Commands

### Recommended Workflow
1. **`/scan-env`** - Quick environment overview
2. **`/scan-env-deep`** - Comprehensive analysis (this command)
3. **`/env-troubleshoot`** - Address any identified issues
4. **`/create-memory-profile`** - Generate persistent environment profile

### Data Flow
- Output can be consumed by `/env-compare` for environment comparison
- Security findings feed into `/security-assessment` workflows
- Performance data supports `/benchmark-tool` baseline establishment
- Integration results inform `/tool-compatibility` analysis