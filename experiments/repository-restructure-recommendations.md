# Repository Restructure Recommendations
## Research on Claude Code Best Practices from the Community

**Date**: 2025-11-16
**Session**: claude/research-repo-best-practices-01MNwXWoeFrcddmgwQzgBu3Q

## Executive Summary

After researching community best practices from official Anthropic documentation, GitHub repositories (awesome-claude-code, centminmod/my-claude-code-setup, feiskyer/claude-code-settings), and blog posts from practitioners, this document provides actionable recommendations for restructuring the prompt-kit repository.

**Key Finding**: The prompt-kit repository is well-structured but could benefit from:
1. Better organization and categorization of documentation
2. Practical implementation examples alongside templates
3. Enhanced automation through hooks
4. Clearer workflow templates beyond HTK
5. Proper settings and MCP configuration examples

---

## Current State Analysis

### Strengths ✅

1. **Strong CLAUDE.md Foundation**
   - Clear repository purpose and value proposition
   - Progressive disclosure principles documented
   - Explicit quality gates
   - Good separation of global vs project config

2. **HTK Methodology**
   - Well-documented hypothesis-test-kernel workflow
   - Dedicated experiments directory
   - Meta-application (practices what it preaches)

3. **Clean Structure**
   - Logical separation between docs, config, and experiments
   - Symlink approach for global config

### Gaps & Opportunities 🔄

1. **Flat Documentation Structure**
   - 16 markdown files in `/docs` without categorization
   - Hard to navigate and discover relevant templates
   - No clear path from beginner → advanced

2. **Missing Practical Examples**
   - Templates exist but lack concrete implementations
   - No "starter kits" or "quick start" examples
   - Architectures directory disconnected from main docs

3. **Incomplete Configuration**
   - Hooks directory missing (mentioned in CLAUDE.md but not present)
   - Only template files, no working configurations
   - No MCP integration examples

4. **Limited Workflow Diversity**
   - HTK is well-documented but no other workflow templates
   - Missing common patterns: TDD, refactoring, security audits

5. **Command Organization**
   - Only 2 commands in `.claude/commands/docs/`
   - Community examples show richer command libraries

---

## Community Best Practices Summary

### 1. Documentation Organization Patterns

**Pattern: Categorized Command Libraries** (from awesome-claude-code, feiskyer/claude-code-settings)

```
.claude/commands/
├── version-control/     # Git workflows, PR management
├── analysis/            # Code review, refactoring, security
├── testing/             # TDD, test generation, coverage
├── documentation/       # README, changelogs, API docs
├── deployment/          # CI/CD, infrastructure
└── workflows/           # Multi-step procedures
```

**Pattern: Progressive Disclosure** (Anthropic official)
- CLAUDE.md: < 100 lines (quick reference)
- SKILL.md: < 500 lines (core instructions)
- REFERENCE.md: < 600 lines (detailed specs)

**Pattern: Memory Bank System** (centminmod)
- CLAUDE.md as living documentation
- Architectural decision records
- Tool recommendations with rationale
- Codebase relationship mapping

### 2. Skills vs Commands Clarity

**Skills** (model-invoked):
- Claude autonomously decides when to use
- Stored in `.claude/skills/` or `~/.claude/skills/`
- Examples: codex integration, web asset generation, memory synchronization

**Commands** (user-invoked):
- Explicitly triggered with `/command-name`
- Support `$ARGUMENTS` for parameters
- Examples: `/security-audit`, `/create-readme`, `/cleanup-context`

### 3. Hooks for Automation

Common hook implementations found:
- **Pre-tool hooks**: Linting before commits, security checks before deployments
- **Post-tool hooks**: Auto-formatting after edits, test running after code changes
- **Prompt-submit hooks**: Context validation, token optimization

Example from centminmod:
```bash
# .claude/hooks/pre-tool.sh
if [[ $TOOL_NAME == "Edit" ]]; then
  # Run formatter before file edits
  prettier --write "$FILE_PATH"
fi
```

### 4. Settings & Permissions Management

**Three-tier configuration** (from Anthropic docs):
1. `~/.claude/settings.json` - Global user preferences
2. `.claude/settings.json` - Team-shared, checked into git
3. `.claude/settings.local.json` - Personal, gitignored

**Permission patterns**:
```json
{
  "permissions": {
    "allowedTools": ["Read", "Grep", "Glob"],
    "deniedTools": ["Edit(production/*)"],
    "autoApprove": ["Bash(git status)", "Bash(git diff)"]
  }
}
```

### 5. Workflow Templates

Community workflows beyond HTK:

**RIPER Workflow** (from awesome-claude-code):
- Research → Innovate → Plan → Execute → Review
- Phase separation with memory banking
- Specialized for exploratory development

**AB Method** (from awesome-claude-code):
- Transforms large problems into focused missions
- Uses specialized sub-agents per phase
- Ideal for complex refactoring

**Spec-Plan-Task** (GitHub approach):
- Single file combining spec, plan, and tasks
- More efficient than managing multiple documents
- Integrated with issue tracking

### 6. MCP Integration Examples

Projects showing MCP server configurations:
- Gemini CLI integration
- Cloudflare Docs access
- Notion database connectivity
- Chrome DevTools for visual testing

**Configuration pattern**:
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    }
  }
}
```

---

## Recommended Restructure

### Phase 1: Documentation Reorganization

**Current**:
```
docs/
├── (16 flat markdown files)
```

**Proposed**:
```
docs/
├── README.md                          # Landing page with learning path
├── getting-started/
│   ├── quickstart.md                 # 5-minute setup
│   ├── first-project.md              # Hello World example
│   └── common-patterns.md            # Top 5 patterns
├── workflows/
│   ├── boundary-decomposition/       # ⭐ FLAGSHIP: LLM-native architecture
│   │   ├── README.md                # Overview and positioning
│   │   ├── methodology.md           # Protocol v2.6 (unified CSV)
│   │   ├── comparison-to-industry.md  # vs Backstage, OpenAPI, C4
│   │   └── when-to-use.md           # Decision guide
│   ├── htk-methodology.md            # (moved from focus-htk.md)
│   ├── riper-workflow.md             # NEW: Research→Execute
│   ├── tdd-workflow.md               # NEW: Test-driven development
│   ├── spec-plan-task.md             # NEW: GitHub-style workflow
│   └── refactoring-workflow.md       # NEW: Safe refactoring
├── templates/
│   ├── claude-md-template.md         # Project CLAUDE.md starter
│   ├── skill-template.md             # Skill creation guide
│   ├── command-template.md           # Command creation guide
│   ├── knowledge-module-template.md  # (existing)
│   └── smart-claude-context-template.md  # (existing)
├── patterns/
│   ├── progressive-disclosure.md     # (extracted from best practices)
│   ├── agent-delegation-pattern.md   # (existing)
│   ├── boundary-decomposition-guide.md  # (existing)
│   └── memory-bank-pattern.md        # NEW: centminmod approach
├── configuration/
│   ├── claude-code-best-practices.md # (existing)
│   ├── settings-guide.md             # NEW: Settings hierarchy
│   ├── permissions-guide.md          # NEW: Security patterns
│   ├── hooks-guide.md                # NEW: Automation examples
│   └── mcp-integration.md            # NEW: MCP setup
├── guides/
│   ├── project-kickoff.md            # (existing)
│   ├── debugging-playbook.md         # (existing)
│   ├── mermaid-diagram-guide.md      # (existing)
│   └── writing-style-guide.md        # (existing)
├── architecture/
│   ├── claude-knowledge-architecture.md  # (existing)
│   ├── claude-code-docs-pattern.md       # (existing)
│   └── documentation-governance.md       # (existing)
└── index.md                          # Comprehensive index
```

**Benefits**:
- Clear learning path (getting-started → templates → patterns → configuration)
- Easier discoverability through categorization
- Scales better as more docs are added
- Matches mental models from community repos

### Phase 2: Practical Examples Library

**New directory structure**:
```
examples/
├── README.md                         # Example catalog
├── starter-kits/
│   ├── web-app/
│   │   ├── .claude/
│   │   │   ├── CLAUDE.md
│   │   │   ├── commands/
│   │   │   └── skills/
│   │   └── README.md
│   ├── python-project/
│   │   └── ...
│   ├── docs-repository/              # Self-referential example
│   │   └── ...
│   └── monorepo/
│       └── ...
├── workflows/
│   ├── boundary-decomposition/       # ⭐ FLAGSHIP EXAMPLE
│   │   └── email-app/               # Complete working example
│   │       ├── BOUNDARY_INDEX.csv   # 7 boundaries (backend/frontend/infra)
│   │       ├── BOUNDARY_EVENTS.csv  # 3 events
│   │       ├── STATE_MODELS/
│   │       └── README.md            # Full walkthrough
│   ├── htk-complete-example/
│   │   ├── hypothesis.md
│   │   ├── test-plan.md
│   │   ├── results/
│   │   └── README.md
│   ├── tdd-session/
│   │   └── ...
│   └── security-audit/
│       └── ...
├── skills/
│   ├── code-reviewer/
│   │   ├── SKILL.md
│   │   ├── REFERENCE.md
│   │   ├── templates/
│   │   └── README.md
│   ├── test-generator/
│   │   └── ...
│   └── changelog-creator/
│       └── ...
└── commands/
    ├── pr-description-generator/
    │   ├── command.md
    │   ├── examples/
    │   └── README.md
    └── architecture-analyzer/
        └── ...
```

**Benefits**:
- Learn by example (most effective learning method)
- Copy-paste starter kits reduce setup time
- Validates that templates actually work
- Shows progression from simple → complex

### Phase 3: Enhanced .claude Configuration

**Proposed `.claude/` structure**:
```
.claude/
├── CLAUDE.md                         # (existing - enhanced)
├── README.md                         # (existing)
├── settings.json                     # NEW: Team-shared config
├── settings.local.json.template      # NEW: Personal config template
├── .mcp.json                         # NEW: MCP server config
├── commands/
│   ├── docs/
│   │   ├── check-links.md           # (existing)
│   │   ├── validate-structure.md    # (existing)
│   │   ├── generate-index.md        # NEW: Auto-update index.md
│   │   └── publish-docs.md          # NEW: Deploy to docs site
│   ├── quality/
│   │   ├── check-progressive-disclosure.md  # NEW: Validate file sizes
│   │   ├── validate-naming.md       # NEW: Gerund form checker
│   │   └── run-quality-gates.md     # NEW: Pre-merge checks
│   └── workflows/
│       ├── new-template.md          # NEW: Scaffold new template
│       ├── new-example.md           # NEW: Scaffold new example
│       └── compare-token-usage.md   # NEW: HTK measurement
├── skills/
│   ├── docs-curator/
│   │   ├── SKILL.md                 # (existing - enhanced)
│   │   └── REFERENCE.md             # NEW: Detailed curator logic
│   ├── example-validator/
│   │   ├── SKILL.md                 # NEW: Test examples work
│   │   └── test-runner.sh           # NEW: Execution script
│   └── template-improver/
│       ├── SKILL.md                 # NEW: Optimize templates
│       └── metrics.json             # NEW: Token measurements
└── hooks/
    ├── pre-commit.sh                # NEW: Quality gates
    ├── post-edit.sh                 # NEW: Format markdown
    └── README.md                    # NEW: Hook documentation
```

**New files to create**:

1. **`.claude/settings.json`** - Team-shared configuration
2. **`.claude/.mcp.json`** - MCP server setup for docs validation
3. **Quality commands** - Automated checks for standards
4. **Hooks** - Enforce quality gates automatically
5. **Enhanced skills** - Progressive disclosure with REFERENCE.md

### Phase 4: Workflow Templates

**New workflow documentation** (in `docs/workflows/`):

1. **Boundary Decomposition** (`boundary-decomposition/`) — ⭐ **FLAGSHIP WORKFLOW**
   - Methodology: Contract-first system design (v2.6 unified CSV)
   - Comparison: How it relates to industry standards (Backstage, OpenAPI, C4)
   - When to use: Decision guide for applying boundary contracts
   - Complete example: Email app with 7 boundaries (backend, frontend, infra)
   - **Positioning**: "LLM-native architecture documentation"
   - **Unique value**: Synthesizes service catalogs + API contracts + dependency mapping

2. **HTK Methodology** (`htk-methodology.md`) — moved from root level
   - Hypothesis → Test Kernel approach
   - Experiment directory structure
   - Token measurement and validation
   - Integration with other workflows

3. **RIPER Workflow** (`riper-workflow.md`)
   - Research phase: Context gathering
   - Innovate phase: Solution ideation
   - Plan phase: Detailed specification
   - Execute phase: Implementation
   - Review phase: Quality validation

4. **TDD Workflow** (`tdd-workflow.md`)
   - Write failing tests
   - Implement minimal solution
   - Refactor with confidence
   - Example session walkthrough
   - Integration with boundary contracts

5. **Spec-Plan-Task Workflow** (`spec-plan-task.md`)
   - Single-file approach
   - Integration with GitHub issues
   - Example template

6. **Security Audit Workflow** (`security-audit-workflow.md`)
   - OWASP top 10 checklist
   - Automated scanning
   - Remediation tracking
   - PII surface analysis (from boundary protocol)

### Phase 5: Global Config Enhancements

**Proposed `claude-config/` structure**:
```
claude-config/
├── CLAUDE.md                         # (existing - enhanced)
├── README.md                         # (existing)
├── settings.json                     # NEW: Working global config
├── commands/
│   ├── htk/                         # (existing - 5 commands)
│   ├── core/                        # (existing - 3 commands)
│   ├── analysis/                    # (existing - 1 command)
│   ├── documentation/               # (existing - 1 command)
│   ├── orchestration/               # (existing - 1 command)
│   ├── git/                         # NEW: Git workflows
│   │   ├── smart-commit.md
│   │   ├── pr-create.md
│   │   └── history-search.md
│   ├── testing/                     # NEW: Test workflows
│   │   ├── tdd-cycle.md
│   │   └── coverage-report.md
│   └── security/                    # NEW: Security tools
│       ├── audit.md
│       └── dependency-check.md
├── skills/
│   ├── htk-workflow/                # (existing)
│   │   ├── SKILL.md
│   │   └── REFERENCE.md
│   ├── context-optimizer/           # NEW: Token reduction
│   │   ├── SKILL.md
│   │   └── strategies/
│   └── session-saver/               # NEW: Auto-checkpoint
│       └── SKILL.md
└── hooks/
    ├── claude-tts-notify.py         # (existing)
    ├── token-tracker.sh             # NEW: Measure usage
    └── auto-save.sh                 # NEW: Periodic backups
```

---

## Implementation Roadmap

### Immediate Actions (Week 1)

1. **Reorganize docs directory**
   - Create category subdirectories
   - Move existing files to appropriate categories
   - Update internal cross-references
   - Generate new index.md with categories

2. **Create missing configuration files**
   - `.claude/settings.json` with team defaults
   - `.claude/hooks/` directory with examples
   - `claude-config/settings.json` for global config

3. **Add quality commands**
   - `/quality/check-progressive-disclosure`
   - `/quality/validate-naming`
   - `/quality/run-quality-gates`

### Short-term (Week 2-3)

4. **Build examples library**
   - Create `examples/` directory structure
   - Implement 2-3 starter kits (docs-repository, python-project)
   - Add workflow examples (HTK complete example)
   - Validate all examples work

5. **Document additional workflows**
   - RIPER workflow documentation
   - TDD workflow documentation
   - Spec-Plan-Task workflow documentation

6. **Implement hooks**
   - Pre-commit quality gate
   - Post-edit markdown formatting
   - Token usage tracking

### Medium-term (Month 1)

7. **Create additional skills**
   - Example validator skill
   - Template improver skill with metrics
   - Context optimizer skill

8. **MCP integration**
   - Research relevant MCP servers for docs repos
   - Create `.mcp.json` configuration
   - Document MCP usage patterns

9. **Enhanced documentation**
   - Settings guide
   - Permissions guide
   - Hooks guide
   - MCP integration guide

### Long-term (Ongoing)

10. **Community contributions**
    - Share restructure on awesome-claude-code
    - Contribute learnings back to community
    - Gather feedback and iterate

11. **Metrics & optimization**
    - Track token usage per template
    - Measure setup time reduction
    - Collect user feedback
    - Continuous improvement via HTK

---

## Migration Strategy

To minimize disruption, use this phased migration:

### Phase A: Additive Changes (Non-breaking)
1. Create new directories without moving existing files
2. Add new configuration files
3. Create examples and workflows
4. Test in parallel with existing structure

### Phase B: Documentation Migration
1. Create migration script to move docs to categories
2. Update all cross-references
3. Add redirects/aliases for backward compatibility
4. Update CLAUDE.md to reference new structure

### Phase C: Cleanup
1. Archive old structure in `legacy/` directory
2. Update all documentation
3. Announce changes to users
4. Remove legacy after deprecation period

**Git Strategy**:
- Create feature branch for each phase
- Use PRs for review
- Tag major structure changes
- Maintain changelog

---

## Comparison with Community Examples

### vs. awesome-claude-code (hesreallyhim)
**Their strength**: Comprehensive command library across categories
**Our strength**: Documented methodology (HTK) and progressive disclosure
**Learn from them**: Command organization, workflow diversity
**Share with them**: HTK methodology, quality gates

### vs. centminmod/my-claude-code-setup
**Their strength**: Memory bank system, token optimization focus
**Our strength**: Team collaboration focus, documentation governance
**Learn from them**: Settings management, rate limit awareness, subagent patterns
**Share with them**: Documentation templates, quality gates

### vs. feiskyer/claude-code-settings
**Their strength**: Specialized subagents (60-70% speed claims via CoD mode)
**Our strength**: Beginner-friendly templates, learning path
**Learn from them**: Subagent specialization, parallel processing
**Share with them**: Progressive disclosure patterns

---

## Success Metrics

Track these metrics to validate the restructure:

1. **Setup Time Reduction**
   - Baseline: Time to set up new project with current structure
   - Target: 60% reduction with starter kits
   - Measure: User feedback, timing studies

2. **Token Efficiency**
   - Baseline: Average tokens per session with current structure
   - Target: 20% reduction with progressive disclosure
   - Measure: Token usage logs

3. **Discoverability**
   - Baseline: Time to find relevant template
   - Target: 50% reduction with categorization
   - Measure: User testing, analytics

4. **Quality Gate Pass Rate**
   - Baseline: Manual review catching 70% of issues
   - Target: Automated hooks catching 90% of issues
   - Measure: PR review comments

5. **Community Engagement**
   - Baseline: Current stars/forks
   - Target: 2x growth in 6 months
   - Measure: GitHub analytics

---

## Risks & Mitigation

### Risk: Breaking Existing Users
**Mitigation**: Phased migration with backward compatibility, clear changelog

### Risk: Increased Complexity
**Mitigation**: Clear getting-started path, simple defaults, progressive disclosure

### Risk: Maintenance Burden
**Mitigation**: Automated quality gates, community contributions, examples validate templates

### Risk: Divergence from Community Standards
**Mitigation**: Regular review of awesome-claude-code, participation in discussions

---

## Appendix: Key References

### Official Documentation
- [Anthropic Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code)

### Community Resources
- [awesome-claude-code (hesreallyhim)](https://github.com/hesreallyhim/awesome-claude-code)
- [centminmod/my-claude-code-setup](https://github.com/centminmod/my-claude-code-setup)
- [feiskyer/claude-code-settings](https://github.com/feiskyer/claude-code-settings)
- [Claude Code Cheatsheet](https://awesomeclaude.ai/code-cheatsheet)

### Blog Posts & Guides
- "Step-by-Step Guide: Prepare Your Codebase for Claude Code" (Medium)
- "Cooking with Claude Code: The Complete Guide" (Sid Bharath)
- "Claude Code Best Practices: Lessons Learned" (John)

---

## Next Steps

1. **Review this document** with team/stakeholders
2. **Create HTK for Phase 1** (docs reorganization)
   - Hypothesis: Categorized docs reduce discovery time 50%
   - Test: Implement structure, measure user testing
   - Success criteria: User feedback, analytics
3. **Begin implementation** following roadmap
4. **Track metrics** to validate improvements
5. **Share learnings** with community

---

*Generated: 2025-11-16*
*Session: claude/research-repo-best-practices-01MNwXWoeFrcddmgwQzgBu3Q*
*Research duration: ~45 minutes*
*Sources: 10+ community repos, official docs, 5+ blog posts*
