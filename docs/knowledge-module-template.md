# Knowledge Module Template

Use this structure for individual knowledge files in `.claude/guides/`, `.claude/frameworks/`, etc.

## Template

```markdown
---
category: guide|framework|environment|troubleshooting
applies_to: [deployment, testing, debugging]
token_budget: ~500
last_updated: 2025-01-15
---

# {{Module Title}}

{{One-sentence description of what this module covers}}

## When to Use This Module

Read this when:
- {{Scenario 1}}
- {{Scenario 2}}
- {{Scenario 3}}

## {{Section 1: Core Concept}}

{{Explain the main pattern, process, or solution}}

### Example
```{{language}}
{{code example or config snippet}}
```

## {{Section 2: Common Patterns}}

### Pattern A
{{Description}}

### Pattern B
{{Description}}

## {{Section 3: Gotchas & Solutions}}

**Issue**: {{Common problem}}
**Solution**: {{Fix or workaround}}

**Issue**: {{Another problem}}
**Solution**: {{Fix or workaround}}

## Related Modules

- @.claude/{{category}}/{{related-module-1}}.md
- @.claude/{{category}}/{{related-module-2}}.md

## Quick Reference

{{Cheat sheet, common commands, or decision tree}}
```

## Field Descriptions

### Frontmatter
- **category**: Module type (guide, framework, environment, troubleshooting)
- **applies_to**: Tags for discoverability (deployment, testing, api, database)
- **token_budget**: Target size (~300 for quick ref, ~500 for guides, ~800 for complex)
- **last_updated**: Date of last significant change

### Sections
- **When to Use**: Clear triggers for loading this module
- **Core Concept**: Main pattern or procedure
- **Common Patterns**: Variations or related approaches
- **Gotchas & Solutions**: Known issues and fixes
- **Related Modules**: Cross-references to other .claude/ files
- **Quick Reference**: TL;DR cheat sheet

## Examples

### Example 1: Deployment Guide

```markdown
---
category: guide
applies_to: [deployment, cloudflare]
token_budget: ~450
last_updated: 2025-01-10
---

# Deploying to Cloudflare Pages

Deploy static sites and full-stack apps to Cloudflare Pages with zero-downtime.

## When to Use This Module

Read this when:
- Deploying a new site to Cloudflare Pages
- Debugging deployment failures
- Setting up preview deployments

## Prerequisites

- Cloudflare account with Pages enabled
- Project repository on GitHub/GitLab
- Build command and output directory defined

## Deployment Process

### 1. Connect Repository
1. Log in to Cloudflare Dashboard
2. Navigate to Pages → Create Project
3. Connect your Git provider
4. Select repository

### 2. Configure Build
```yaml
Build command: npm run build
Build output: dist/
Root directory: (leave blank)
Environment variables: NODE_VERSION=18
```

### 3. Deploy
Click "Save and Deploy" — first build starts automatically.

## Common Patterns

### Preview Deployments
Every branch gets a preview URL: `{branch}.{project}.pages.dev`

### Custom Domains
Add domains in Pages → Custom Domains → Add

## Gotchas & Solutions

**Issue**: Build fails with "command not found"
**Solution**: Add build tool to devDependencies, not just dependencies

**Issue**: 404 on client-side routes
**Solution**: Add `_redirects` file with `/* /index.html 200`

## Related Modules

- @.claude/environments/production-checklist.md
- @.claude/troubleshooting/deployment-errors.md

## Quick Reference

```bash
# Force rebuild
git commit --allow-empty -m "Trigger rebuild"
git push

# Check build logs
# Cloudflare Dashboard → Pages → [Project] → Deployments
```
```

### Example 2: Framework Pattern

```markdown
---
category: framework
applies_to: [react, state-management]
token_budget: ~400
last_updated: 2025-01-12
---

# React State Management Patterns

Consistent patterns for managing state in React applications.

## When to Use This Module

Read this when:
- Adding new state to components
- Choosing between useState, useReducer, Context
- Debugging state synchronization issues

## State Selection Decision Tree

```
Is it server data? → React Query / SWR
Is it URL state? → Router params / query strings
Is it shared across 3+ components? → Context
Is it complex with multiple updates? → useReducer
Otherwise → useState
```

## Common Patterns

### Local Component State
```tsx
const [count, setCount] = useState(0);
```

### Form State
```tsx
const [formData, setFormData] = useState({
  email: '',
  password: ''
});

const handleChange = (e) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};
```

### Context for Theme/Auth
```tsx
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Gotchas & Solutions

**Issue**: Stale closure in event handlers
**Solution**: Use functional updates: `setCount(prev => prev + 1)`

**Issue**: Context causing unnecessary rerenders
**Solution**: Split contexts by update frequency

## Related Modules

- @.claude/frameworks/react-patterns.md
- @.claude/troubleshooting/performance-problems.md
```

## Tips

- **Keep modules focused**: One topic per file
- **Be specific**: Include actual code, not just concepts
- **Update token budgets**: Measure actual size after writing
- **Link related modules**: Build a knowledge graph
- **Test with Claude**: Verify Claude can apply the patterns
