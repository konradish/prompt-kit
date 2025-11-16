# Search and Analyze Code Patterns

Search for patterns, functions, and implementations: **$ARGUMENTS**

## Execution

### 1. Search Strategy
- Validate pattern syntax for the query: `$ARGUMENTS`
- Use intelligent scope filtering (exclude node_modules, .git, dist, build)
- Search common code extensions: .js, .ts, .py, .go, .rs, .java, .cpp, .c
- Provide 3 lines of context around matches

### 2. Search & Analysis
- Execute search with appropriate tools (grep, rg, or search capabilities)
- Group matches by file and function context
- Categorize findings: definitions, usages, tests, documentation

### 3. Results Organization
```
Query: $ARGUMENTS
Matches: {count} in {file_count} files
Scope: {directories_searched}

Definitions:
{file_path}:{line} - {function/class/variable definition}

Usages:
{file_path}:{line} - {usage_context}

Tests:
{file_path}:{line} - {test_description}

Documentation:
{file_path}:{line} - {doc_reference}

Recommendations:
{actionable_suggestions}
```

## Error Handling
- **No matches**: Suggest broader scope, alternative terms, or spelling variations
- **Too many results**: Recommend filters or more specific patterns
- **Permission denied**: List inaccessible paths but continue with available results
- **Invalid pattern**: Provide corrected regex/glob syntax

## Smart Defaults
- Context lines: 3
- Max results: 50 (to avoid overwhelming output)
- Auto-exclude: node_modules, .git, dist, build, .next, __pycache__
- Include: source files, configs, documentation