# Environment Troubleshooting

**CEI Diagnostic Command**: Systematic debugging and resolution guidance for development environment issues

## Objective

Provide intelligent troubleshooting for common development environment problems with step-by-step resolution guidance, automated diagnosis, and WSL2-specific issue handling.

## Troubleshooting Strategy

<troubleshooting_analysis>
<issue_identification>
Analyze the reported problem and categorize by type, severity, and likely causes
</issue_identification>

<diagnostic_execution>
Run targeted diagnostic commands to gather relevant system information
</diagnostic_execution>

<root_cause_analysis>
Apply systematic debugging to identify the underlying cause
</root_cause_analysis>

<resolution_guidance>
Provide step-by-step resolution instructions with verification steps
</resolution_guidance>

<prevention_recommendations>
Suggest preventive measures to avoid similar issues in the future
</prevention_recommendations>
</troubleshooting_analysis>

## Usage Pattern

**Input**: `/env-troubleshoot "$ARGUMENTS"`

**Examples**:
- `/env-troubleshoot "git operations fail in WSL2"`
- `/env-troubleshoot "docker container won't start"`
- `/env-troubleshoot "npm install extremely slow"`
- `/env-troubleshoot "permission denied accessing files"`
- `/env-troubleshoot "network connectivity issues"`

## Implementation

### Phase 1: Issue Classification and Initial Diagnosis

**Issue Categorization**:
```bash
# Parse and categorize the issue from $ARGUMENTS
issue_text="$ARGUMENTS"
issue_category=""

case "$issue_text" in
  *git*symlink*|*git*WSL*|*git*fail*) issue_category="git_wsl2" ;;
  *docker*start*|*docker*daemon*|*docker*container*) issue_category="docker_issues" ;;
  *npm*slow*|*node*slow*|*install*slow*) issue_category="package_manager_performance" ;;
  *permission*denied*|*access*denied*|*sudo*) issue_category="permissions" ;;
  *network*|*connectivity*|*timeout*|*dns*) issue_category="network" ;;
  *performance*|*slow*|*hang*) issue_category="performance" ;;
  *tool*not*found*|*command*not*found*) issue_category="missing_tools" ;;
  *) issue_category="general" ;;
esac
```

**Environment Context Gathering**:
```bash
# Gather relevant context based on issue category (parallel execution)
uname -a &
pwd &
whoami &
groups &
echo $PATH &
wait
```

### Phase 2: Category-Specific Diagnostics

#### Git + WSL2 Issues
```bash
git_wsl2_diagnostics() {
  echo "=== Git WSL2 Diagnostics ==="
  
  # Test git in different locations (parallel)
  (cd /tmp && git init test_repo_tmp &>/dev/null && cd test_repo_tmp && git status && cd .. && rm -rf test_repo_tmp) &
  (cd ~ && pwd && ls -la | grep projects) &
  (git config --list | grep -E "(user\.|safe\.directory)") &
  (mount | grep -E "mnt|projects") &
  wait
  
  # Check git version and WSL specifics
  git --version &
  cat /proc/version | grep -i microsoft &
  wait
  
  # Test symlink behavior
  if [ -L ~/projects ]; then
    echo "~/projects is a symlink to: $(readlink ~/projects)"
    cd ~/projects 2>/dev/null && pwd && git status 2>&1 || echo "Git fails in symlinked directory"
  fi
}
```

#### Docker Issues
```bash
docker_diagnostics() {
  echo "=== Docker Diagnostics ==="
  
  # Docker service and configuration (parallel)
  docker --version &
  docker-compose --version 2>/dev/null || echo "docker-compose not available" &
  service docker status 2>/dev/null || systemctl status docker 2>/dev/null || echo "Cannot check Docker service status" &
  docker info 2>&1 | head -20 &
  wait
  
  # Docker daemon accessibility
  docker ps 2>&1 | head -5
  
  # WSL2 Docker Desktop integration
  if grep -q microsoft /proc/version; then
    echo "WSL2 detected - checking Docker Desktop integration"
    ls -la /var/run/docker.sock 2>/dev/null || echo "Docker socket not accessible"
    echo $DOCKER_HOST
  fi
}
```

#### Package Manager Performance Issues
```bash
package_performance_diagnostics() {
  echo "=== Package Manager Performance Diagnostics ==="
  
  # Network performance to package registries (parallel)
  curl -w "npm registry: %{time_total}s, %{speed_download} bytes/s\n" -o /dev/null -s https://registry.npmjs.org/ &
  curl -w "PyPI: %{time_total}s, %{speed_download} bytes/s\n" -o /dev/null -s https://pypi.org/ &
  wait
  
  # Check package manager configurations
  npm config list 2>/dev/null | grep -E "(registry|proxy|cache)" || echo "npm not available" &
  pip config list 2>/dev/null || echo "pip config not available" &
  wait
  
  # Filesystem performance where packages are installed
  npm_prefix=$(npm config get prefix 2>/dev/null || echo "unknown")
  echo "npm global prefix: $npm_prefix"
  findmnt "$npm_prefix" 2>/dev/null || echo "Cannot determine npm filesystem"
  
  # Test I/O performance in package directories
  if [ -d "$npm_prefix" ]; then
    dd if=/dev/zero of="$npm_prefix/test_write" bs=1M count=10 2>&1 | grep -E "(MB/s|copied)"
    rm -f "$npm_prefix/test_write"
  fi
}
```

#### Permission Issues
```bash
permission_diagnostics() {
  echo "=== Permission Diagnostics ==="
  
  # User and group information (parallel)
  id &
  groups &
  ls -la ~ | head -5 &
  ls -la /var/run/docker.sock 2>/dev/null || echo "Docker socket not accessible" &
  wait
  
  # Sudo configuration
  sudo -l 2>/dev/null | head -5 || echo "No sudo privileges or cannot check"
  
  # Common permission issues
  ls -la ~/.ssh 2>/dev/null | head -5 || echo "No ~/.ssh directory"
  ls -la ~/.docker 2>/dev/null || echo "No ~/.docker directory"
  
  # File creation tests in various locations
  touch /tmp/permission_test && rm /tmp/permission_test && echo "✅ /tmp writable"
  touch ~/permission_test && rm ~/permission_test && echo "✅ ~ writable" || echo "❌ ~ not writable"
  touch /var/tmp/permission_test 2>/dev/null && rm /var/tmp/permission_test && echo "✅ /var/tmp writable" || echo "❌ /var/tmp not writable"
}
```

#### Network Issues
```bash
network_diagnostics() {
  echo "=== Network Diagnostics ==="
  
  # Basic connectivity tests (parallel)
  ping -c 3 8.8.8.8 2>&1 | tail -1 &
  ping -c 3 github.com 2>&1 | tail -1 &
  nslookup github.com | grep -A 2 "Non-authoritative answer" &
  wait
  
  # Service-specific connectivity (parallel)
  curl -I --max-time 5 https://api.github.com &
  curl -I --max-time 5 https://registry.npmjs.org &
  curl -I --max-time 5 https://pypi.org &
  wait
  
  # Network configuration
  ip route show default 2>/dev/null || route -n | grep '^0.0.0.0'
  cat /etc/resolv.conf | grep nameserver
  
  # Proxy configuration check
  echo "HTTP_PROXY: ${HTTP_PROXY:-not set}"
  echo "HTTPS_PROXY: ${HTTPS_PROXY:-not set}"
  echo "NO_PROXY: ${NO_PROXY:-not set}"
}
```

### Phase 3: Intelligent Resolution Generation

Based on diagnostic results, provide targeted solutions:

```bash
generate_resolution() {
  local issue_category="$1"
  local diagnostic_results="$2"
  
  case "$issue_category" in
    "git_wsl2")
      cat << 'EOF'
## Git WSL2 Resolution Steps

### Root Cause
Git operations fail in WSL2 when working with symlinked directories pointing to Windows filesystem.

### Resolution Steps
1. **Immediate Fix**: Work in native Linux filesystem locations
   ```bash
   # Move to ext4 filesystem
   cd /home/$USER/projects  # instead of ~/projects if it's a symlink
   ```

2. **Configure Git Safe Directory** (if symlinks required):
   ```bash
   git config --global safe.directory '*'
   # OR for specific directory:
   git config --global safe.directory /mnt/c/projects
   ```

3. **Verify Fix**:
   ```bash
   cd /your/project/directory
   git status
   ```

### Prevention
- Avoid symlinks from Linux to Windows filesystem for git operations
- Use native Linux filesystem (/home) for development when possible
- Set up git safe.directory configuration proactively
EOF
      ;;
    "docker_issues")
      cat << 'EOF'
## Docker Issues Resolution Steps

### Common Causes and Solutions

1. **Docker Daemon Not Running**:
   ```bash
   # Check status
   service docker status
   
   # Start Docker service
   sudo service docker start
   
   # Enable auto-start (WSL2)
   echo "sudo service docker start" >> ~/.bashrc
   ```

2. **Permission Issues**:
   ```bash
   # Add user to docker group
   sudo usermod -aG docker $USER
   
   # Apply group changes (logout/login or use newgrp)
   newgrp docker
   
   # Test access
   docker run hello-world
   ```

3. **WSL2 Docker Desktop Integration**:
   - Ensure Docker Desktop is running on Windows
   - Enable WSL2 integration in Docker Desktop settings
   - Restart WSL2: `wsl --shutdown` (from Windows)

### Verification
```bash
docker --version
docker info
docker run --rm hello-world
```
EOF
      ;;
    "package_manager_performance")
      cat << 'EOF'
## Package Manager Performance Resolution

### Performance Optimization Steps

1. **Use ext4 Filesystem**:
   ```bash
   # Check current location filesystem
   findmnt $(npm config get prefix)
   
   # If on /mnt/c (9P), change npm global directory
   mkdir -p ~/.npm-global
   npm config set prefix ~/.npm-global
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

2. **Configure Registry and Cache**:
   ```bash
   # Use faster registry mirror (if appropriate)
   npm config set registry https://registry.npmjs.org/
   
   # Clear and relocate cache to ext4
   npm cache clean --force
   npm config set cache ~/.npm-cache
   ```

3. **Python/UV Optimization**:
   ```bash
   # Ensure UV uses ext4 for cache
   export UV_CACHE_DIR="$HOME/.cache/uv"
   mkdir -p "$UV_CACHE_DIR"
   ```

### Verification
```bash
# Test installation speed
time npm install --dry-run some-package
time uv add --dry-run some-package
```
EOF
      ;;
    "permissions")
      cat << 'EOF'
## Permission Issues Resolution

### Common Permission Fixes

1. **Docker Group Membership**:
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   docker run --rm hello-world  # test
   ```

2. **SSH Key Permissions**:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/id_*
   chmod 644 ~/.ssh/id_*.pub
   ```

3. **NPM Global Directory**:
   ```bash
   mkdir -p ~/.npm-global
   npm config set prefix ~/.npm-global
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   ```

4. **Sudo Configuration** (if needed):
   ```bash
   # Check current sudo access
   sudo -l
   
   # Add user to sudo group (requires existing sudo access)
   sudo usermod -aG sudo $USER
   ```

### Verification
```bash
# Test various permissions
docker ps
touch ~/.test && rm ~/.test
npm list -g --depth=0
ls -la ~/.ssh
```
EOF
      ;;
    "network")
      cat << 'EOF'
## Network Connectivity Resolution

### Connectivity Troubleshooting Steps

1. **DNS Resolution**:
   ```bash
   # Test DNS
   nslookup github.com
   nslookup 8.8.8.8
   
   # Fix DNS if needed (WSL2)
   echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
   ```

2. **Proxy Configuration**:
   ```bash
   # Check proxy settings
   env | grep -i proxy
   
   # Configure npm proxy (if needed)
   npm config set proxy http://proxy.company.com:8080
   npm config set https-proxy http://proxy.company.com:8080
   
   # Configure git proxy (if needed)
   git config --global http.proxy http://proxy.company.com:8080
   ```

3. **Firewall Issues**:
   ```bash
   # Check firewall status
   sudo ufw status
   
   # Allow specific ports if needed
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   ```

### Verification
```bash
curl -I https://github.com
curl -I https://registry.npmjs.org
ping -c 3 8.8.8.8
```
EOF
      ;;
    *)
      cat << 'EOF'
## General Troubleshooting Steps

### Systematic Approach

1. **Gather More Information**:
   ```bash
   # Run comprehensive environment scan
   /scan-env-deep
   
   # Check system logs
   journalctl -n 50 --no-pager
   dmesg | tail -20
   ```

2. **Check Common Issues**:
   - Verify tool installations and versions
   - Check file permissions and ownership
   - Test network connectivity
   - Examine environment variables

3. **Get Detailed Help**:
   ```bash
   # Use specific troubleshooting commands
   /env-troubleshoot "specific error message"
   
   # Run tool-specific diagnostics
   /evaluate-tool problematic-tool-name
   ```
EOF
      ;;
  esac
}
```

## Structured Output Format

```xml
<troubleshooting_session>
<session_metadata>
<timestamp>2024-01-15T10:30:00Z</timestamp>
<issue_description>git operations fail in WSL2</issue_description>
<category>git_wsl2</category>
<severity>medium</severity>
</session_metadata>

<diagnostic_results>
<environment_context>
<os>Ubuntu 22.04.1 LTS (WSL2)</os>
<current_directory>/mnt/c/projects/my-repo</current_directory>
<user>developer</user>
<filesystem_type>9p</filesystem_type>
</environment_context>

<issue_analysis>
<root_cause>Git operations fail in symlinked directories on WSL2 due to filesystem compatibility issues</root_cause>
<contributing_factors>
<factor>Working directory is on Windows filesystem (/mnt/c)</factor>
<factor>~/projects is symlinked to /mnt/c/projects</factor>
<factor>Git safe.directory not configured</factor>
</contributing_factors>
</issue_analysis>

<diagnostic_commands>
<command name="git_status_test" result="fatal: detected dubious ownership"/>
<command name="symlink_check" result="~/projects -> /mnt/c/projects"/>
<command name="filesystem_check" result="9p filesystem detected"/>
<command name="git_config_check" result="safe.directory not configured"/>
</diagnostic_commands>
</diagnostic_results>

<resolution_plan>
<immediate_actions>
<action priority="high" estimated_time="2min">
<title>Configure Git Safe Directory</title>
<commands>
<command>git config --global safe.directory '*'</command>
</commands>
<verification>
<command>git status</command>
<expected_result>Should show repository status without errors</expected_result>
</verification>
</action>
</immediate_actions>

<long_term_solutions>
<solution priority="medium" estimated_time="10min">
<title>Move Development to Native Filesystem</title>
<description>Relocate development work to ext4 filesystem for better performance and compatibility</description>
<steps>
<step>Create ~/dev directory on native filesystem</step>
<step>Move or clone repositories to ~/dev</step>
<step>Update shell aliases and shortcuts</step>
</steps>
</solution>
</long_term_solutions>

<prevention_measures>
<measure>Always use native Linux filesystem for git repositories</measure>
<measure>Set up git safe.directory configuration proactively</measure>
<measure>Document filesystem layout for team members</measure>
</prevention_measures>
</resolution_plan>

<follow_up_actions>
<action>Run /scan-env to verify environment after fixes</action>
<action>Test git operations in fixed environment</action>
<action>Update development workflow documentation</action>
</follow_up_actions>

<success_criteria>
<criterion>Git status works without errors</criterion>
<criterion>Git commits and pushes function normally</criterion>
<criterion>No filesystem-related warnings</criterion>
</success_criteria>
</troubleshooting_session>
```

## Workspace Management

### Output Location
Create isolated workspace: `workspace/troubleshoot-$(date +%Y%m%d-%H%M%S)/`

### Generated Files
- `troubleshooting-session.xml` - Complete diagnostic and resolution record
- `diagnostic-results.md` - Human-readable diagnostic summary
- `resolution-guide.md` - Step-by-step resolution instructions
- `prevention-checklist.md` - Preventive measures checklist
- `verification-steps.md` - Testing and verification procedures

### Output Format Options
- `$ARGUMENTS --format=xml` - Complete structured output (default)
- `$ARGUMENTS --format=guide` - Focused resolution guide
- `$ARGUMENTS --format=checklist` - Actionable steps checklist
- `$ARGUMENTS --format=summary` - Brief diagnostic summary

## Integration and Learning

### Knowledge Base Integration
- Common issues and resolutions are catalogued
- Solutions are refined based on success patterns
- Environment-specific knowledge is accumulated

### Command Chaining
- Results can inform `/scan-env-deep` analysis
- Resolutions can be validated with `/evaluate-tool`
- Fixed environments can be profiled with `/create-memory-profile`

### Team Knowledge Sharing
- Troubleshooting sessions generate reusable documentation
- Common fixes become part of team runbooks
- Environment-specific issues are documented for onboarding