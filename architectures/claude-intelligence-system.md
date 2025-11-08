# Claude Code Intelligence System - Iterative Refinement Project

## Project Vision
Build a scalable knowledge system for Claude Code that maintains token efficiency while providing comprehensive context. Two parallel approaches: modular knowledge files and intelligent context selection.

## Problem Statement
- **Current**: CLAUDE.md files grow unwieldy with accumulated knowledge
- **Challenge**: Balance comprehensive guidance with token efficiency
- **Goal**: Selective, just-in-time knowledge injection for Claude Code

## Approach 1: Modular Knowledge Architecture

### Structure
```
project-root/
├── CLAUDE.md                     # Main entry point (lightweight)
├── .claude/
│   ├── guides/
│   │   ├── deploying-cloudflare.md
│   │   ├── docker-compose.md
│   │   ├── git-workflow.md
│   │   ├── testing-patterns.md
│   │   └── debugging-strategies.md
│   ├── frameworks/
│   │   ├── nextjs-patterns.md
│   │   ├── fastapi-patterns.md
│   │   └── react-patterns.md
│   ├── environments/
│   │   ├── local-development.md
│   │   ├── staging-deployment.md
│   │   └── production-checklist.md
│   └── troubleshooting/
│       ├── common-errors.md
│       ├── dependency-issues.md
│       └── performance-problems.md
```

### Smart CLAUDE.md Template
```markdown
# Project Context: {{project_name}}

## Quick Reference
- **Type**: {{project_type}}
- **Stack**: {{tech_stack}}
- **Current Phase**: {{project_phase}}

## Available Knowledge Modules
When working on specific tasks, read relevant guides:

### Deployment & Infrastructure
- @.claude/guides/deploying-cloudflare.md - Cloudflare Pages/Workers deployment
- @.claude/guides/docker-compose.md - Container orchestration patterns
- @.claude/environments/production-checklist.md - Pre-deployment verification

### Development Workflows
- @.claude/guides/git-workflow.md - Branch strategies and commit patterns
- @.claude/guides/testing-patterns.md - Unit, integration, e2e testing
- @.claude/frameworks/{{primary_framework}}-patterns.md - Framework-specific best practices

### Troubleshooting
- @.claude/troubleshooting/common-errors.md - Frequent issues and solutions
- @.claude/guides/debugging-strategies.md - Systematic debugging approaches

## Context Selection Guide
**Before starting a task, tell me what you're trying to accomplish so I can suggest which guides to read first.**

Examples:
- "I'm deploying to Cloudflare" → Read @.claude/guides/deploying-cloudflare.md
- "Setting up new environment" → Read @.claude/guides/docker-compose.md + @.claude/environments/local-development.md
- "Debugging API errors" → Read @.claude/troubleshooting/common-errors.md + @.claude/guides/debugging-strategies.md
```

## Approach 2: Intelligent Context Selection System

### Architecture Overview
```
Knowledge Curator (LLM System)
├── Knowledge Base (Vector Store)
│   ├── All .claude/*.md files
│   ├── Project documentation
│   ├── Framework guides
│   └── Historical solutions
├── Context Selector (RAG System)
│   ├── Query understanding
│   ├── Relevance scoring
│   └── Token budget optimization
└── Prompt Generator
    ├── Selective content inclusion
    ├── Dynamic template rendering
    └── Claude Code prompt assembly
```

### Implementation Components

#### Knowledge Curator Service
```python
# claude-context-curator/
├── src/
│   ├── knowledge_base/
│   │   ├── vectorstore.py      # Embed all knowledge files
│   │   ├── updater.py          # Sync changes from .claude/
│   │   └── indexer.py          # Semantic indexing
│   ├── selector/
│   │   ├── query_analyzer.py   # Understand user intent
│   │   ├── relevance_scorer.py # Score knowledge relevance
│   │   └── budget_optimizer.py # Fit within token limits
│   ├── generator/
│   │   ├── prompt_builder.py   # Assemble final prompt
│   │   ├── template_engine.py  # Dynamic content rendering
│   │   └── claude_interface.py # Claude Code integration
│   └── api/
│       ├── curator_server.py   # HTTP API for context requests
│       └── claude_wrapper.py   # Proxy to Claude Code
```

#### Usage Workflow
```bash
# Instead of calling Claude Code directly:
claude-code "deploy to cloudflare"

# Use intelligent wrapper:
claude-curator "deploy to cloudflare"
# → Analyzes intent
# → Selects: cloudflare.md, deployment-checklist.md, env-vars.md
# → Generates focused CLAUDE.md (500 tokens vs 3000)
# → Calls Claude Code with optimized context
```

### Agent-Oriented Operating Pattern

1. **Primary architect agent** receives the user intent (e.g., "update org-hierarchy model for billing + ops") then frames the task for downstream assistants.
2. It **delegates** to specialized sub-agents (ArchitectCoach, IntegrationEngineer, DataModelReviewer) whose prompts and tool scopes mirror their responsibilities.
3. Each sub-agent loads only the Skills it needs—`skills/org-hierarchy/SKILL.md`, `skills/provider-ingestion/SKILL.md`, etc.—so plans stay token-lean while anchored to canonical templates/scripts.
4. Deterministic slash commands (e.g., `/pr`, `/fix-lint`, `/doc-sync`) close the loop once seam-level checks pass, preserving a human-auditable exit ramp.
5. Observability hooks (tests, logs, UI snippets) feed back into the curator so future delegations carry richer, lower-noise context.

## Implementation Phases

### Phase 1: Modular Knowledge Setup (1-2 weeks)
**Objective**: Restructure existing knowledge into modular files

#### Week 1: Knowledge Extraction
- [ ] Audit existing CLAUDE.md files across projects
- [ ] Identify recurring patterns and themes
- [ ] Create knowledge taxonomy (guides, frameworks, environments, troubleshooting)
- [ ] Extract reusable content into modular files

#### Week 2: Template System
- [ ] Create smart CLAUDE.md template with @import suggestions
- [ ] Build knowledge file templates for consistency
- [ ] Test modular approach on 2-3 existing projects
- [ ] Document content organization principles

**Deliverables**:
- Modular .claude/ directory structure
- Template system for new projects
- Migration guide for existing projects
- Knowledge organization documentation

### Phase 2: Intelligent Context Selection (2-3 weeks)
**Objective**: Build automated context curation system

#### Week 1: Knowledge Base
- [ ] Set up vector database (ChromaDB/Pinecone)
- [ ] Implement knowledge file embedding and indexing
- [ ] Create automatic sync from .claude/ directories
- [ ] Build semantic search capabilities

#### Week 2: Context Selection Engine
- [ ] Implement query intent analysis
- [ ] Build relevance scoring system
- [ ] Create token budget optimization
- [ ] Test retrieval accuracy with sample queries

#### Week 3: Integration & Testing
- [ ] Build Claude Code wrapper/proxy
- [ ] Create API service for context requests
- [ ] Implement dynamic prompt generation
- [ ] End-to-end testing with real projects

**Deliverables**:
- Working context curator service
- Claude Code integration wrapper
- Performance benchmarks (token savings)
- Usage documentation and examples

### Phase 3: Optimization & Learning (Ongoing)
**Objective**: Iterative improvement through usage data

- [ ] Track context selection accuracy
- [ ] Measure token savings vs effectiveness
- [ ] Implement feedback loops for improvement
- [ ] Build learning patterns from successful selections

## Success Metrics

### Modular Approach (Phase 1)
- **Knowledge Organization**: 80% of common patterns captured in modules
- **Reusability**: Same modules used across 3+ projects
- **Maintenance**: 50% reduction in CLAUDE.md duplication
- **Usability**: Clear selection guidance for common tasks

### Intelligent Selection (Phase 2)
- **Token Efficiency**: 60-80% reduction in context tokens
- **Relevance**: 90% of selected content actually useful
- **Speed**: Context selection under 2 seconds
- **Cost**: Total API costs under $20/month for heavy usage

### Combined System (Phase 3)
- **Developer Experience**: Faster Claude Code sessions
- **Knowledge Growth**: Self-improving context selection
- **Scalability**: System handles 10+ concurrent projects
- **Learning**: Patterns learned from successful selections

## Current Status: Project Initialization

### Immediate Next Steps (This Week)
1. **Knowledge Audit**: Review existing CLAUDE.md files in maker projects
2. **Pattern Extraction**: Identify 5-7 most common knowledge categories
3. **Prototype Structure**: Create .claude/ directory structure for one project
4. **Template Design**: Build first smart CLAUDE.md template

### Tools & Technologies
- **Vector Database**: ChromaDB (local) or Pinecone (cloud)
- **LLM API**: OpenAI GPT-4 or Anthropic Claude for context curation
- **Embedding Model**: OpenAI text-embedding-3-small
- **Framework**: FastAPI for curator service
- **Storage**: Local file system + vector store

## Research & References
- Claude Code Memory Documentation: @Projects/Technical Solutions/Claude Code Memory Patterns
- Multi-Level Memory Framework: @Projects/Maker Space/2025-05-07_Memory_Centric_Organization.md
- Environment Intelligence Repo: https://github.com/konradish/claude-environment-intelligence

## Integration with Existing Systems
- **PARA Method**: Knowledge files follow Areas/Resources organization
- **MCP Memory**: Context selections stored as learning data
- **Multi-Level Memory**: Context patterns feed into macro-memory analysis
- **Environment Intelligence**: Generated knowledge from project scanning

---

## Decision Log

### 2025-05-27: Project Initiation
- **Decision**: Pursue both approaches in parallel
- **Rationale**: Modular approach provides immediate value, intelligent selection is long-term optimization
- **Trade-offs**: More initial work, but better testing of both strategies

### Next Decision Points
- **Week 2**: Evaluate modular approach effectiveness
- **Week 4**: Decide on intelligent selection implementation complexity
- **Week 6**: Choose primary approach or hybrid strategy
