# Environment Scan Report
*Generated: 2025-06-15T08:31:51Z*

## 🎯 Executive Summary
**Status**: ✅ Development Ready  
**Environment Score**: 8.7/10  
**Critical Issues**: 0  
**Warnings**: 4  

The development environment is well-configured with a comprehensive toolchain, strong authentication setup, and high-performance storage options. Key limitations are related to Claude Code security restrictions and filesystem performance differences.

---

## 🖥️ System Profile
- **OS**: Debian GNU/Linux 12 (bookworm)
- **Environment**: WSL2 on Microsoft Hyper-V
- **Kernel**: 5.15.167.4-microsoft-standard-WSL2
- **CPU**: Intel(R) Core(TM) i9-14900K (32 cores)
- **Memory**: 31GB total, 27GB available
- **Storage**: ext4 filesystem with 945GB available

---

## 🛠️ Tool Inventory

### ✅ Fully Operational
| Tool | Version | Location | Notes |
|------|---------|----------|-------|
| **git** | 2.39.5 | /usr/bin/git | Configured for Konrad Odell |
| **gh** | 2.73.0 | /usr/bin/gh | Authenticated (konradish) |
| **docker** | 28.1.1 | /usr/bin/docker | Daemon accessible |
| **node** | 22.15.1 | nvm managed | Latest LTS |
| **npm** | 11.4.1 | nvm managed | Latest |
| **python3** | 3.12.10 | uv managed | Modern version |
| **uv** | 0.7.6 | local install | Fast Python package manager |
| **uvx** | 0.7.6 | local install | Python app runner |
| **wrangler** | 4.20.0 | npm managed | Cloudflare CLI |
| **aider** | 0.84.0 | uv managed | AI coding assistant |
| **repomix** | 0.3.8 | npm managed | Repository packager |
| **sgpt** | 1.4.5 | uvx alias | Shell GPT |
| **curl** | 7.88.1 | system | HTTP client |
| **jq** | 1.6 | system | JSON processor |
| **direnv** | 2.32.1 | system | Directory environment |

### ❌ Missing Tools
| Tool | Status | Recommended Action |
|------|--------|--------------------|
| **pip** | Not found | Use uv/uvx instead (preferred) |

---

## 🌐 Network Connectivity

### ✅ Service Connectivity
- **GitHub API**: ✅ Fully accessible
- **NPM Registry**: ✅ Fully accessible  
- **PyPI**: ✅ Fully accessible
- **Cloudflare API**: ⚠️ Redirects (functional)

### 🚫 Network Limitations
- **Ping utility**: Blocked due to missing `cap_net_raw+p` capability
- **Workaround**: Use HTTP requests for connectivity testing

---

## ⚡ Performance Analysis

### 📊 Filesystem Performance
| Location | Type | Write Speed | Read Speed | Use Case |
|----------|------|-------------|------------|----------|
| `/tmp`, `~/` | ext4 | **3.2 GB/s** | **11.5 GB/s** | 🎯 **Development work** |
| `/mnt/c` | 9P | 390 MB/s | 415 MB/s | 📁 Windows file access |

**Key Finding**: ext4 is **8.2x faster** for writes and **27.7x faster** for reads compared to 9P mounts.

---

## ⚠️ Environment Limitations

### 🔒 High Priority
**Claude Code Security Restrictions**
- **Issue**: Directory changes restricted to child directories only
- **Impact**: Limits git operations and file access patterns
- **Workaround**: Use absolute paths for commands requiring different directories

### 🐌 Medium Priority  
**9P Filesystem Performance**
- **Issue**: Windows mount points significantly slower than native ext4
- **Impact**: 8-28x slower file I/O operations
- **Recommendation**: Use ext4 locations for performance-critical work

### 📦 Low Priority
**Modern Python Tooling**
- **Issue**: Traditional `pip` not available
- **Impact**: Requires adjustment for developers used to pip
- **Solution**: uv/uvx provides superior performance and functionality

**Network Diagnostics**
- **Issue**: Ping utility blocked by permissions
- **Impact**: Cannot measure network latency directly
- **Workaround**: HTTP-based connectivity testing works fine

---

## 🏗️ Mount Structure Analysis

### Primary Mounts
- **Root**: `/dev/sdf` → `/` (ext4, high performance)
- **Windows**: 9P mounts → `/mnt/c` (cross-platform access)

### Key Symlinks
- `~/projects` → `/mnt/c/projects` (accessible)
- `~/.aws` → `/mnt/c/Users/konra/.aws` (accessible)
- `~/.azure` → `/mnt/c/Users/konra/.azure` (accessible)
- `~/LLM` → `/mnt/c/LLM` (accessible)

---

## 📋 Recommendations

### 🎯 High Priority
1. **Use ext4 for development**: Perform intensive file operations in `/tmp` or `~/` rather than `/mnt/c`
2. **Optimize workflows**: Design development workflows around Claude Code's directory restrictions

### 📈 Medium Priority  
1. **Leverage modern Python tooling**: Embrace uv/uvx for superior package management
2. **Plan git operations**: Account for directory access limitations when working with repositories

### 🔧 Low Priority
1. **HTTP-based monitoring**: Use curl/wget for network connectivity testing
2. **Performance monitoring**: Consider filesystem choice impact on build and test performance

---

## 🎉 Strengths Summary
- ✅ **Complete development toolchain** with modern versions
- ✅ **Authenticated services** (GitHub, Docker) ready for use  
- ✅ **High-performance storage** available via ext4
- ✅ **AI development tools** (aider, sgpt, repomix) installed
- ✅ **Modern Python ecosystem** with uv/uvx
- ✅ **Comprehensive package managers** (npm, uv, apt)

The environment is **production-ready** for software development with excellent tool coverage and performance characteristics where it matters most.