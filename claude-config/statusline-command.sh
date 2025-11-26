#!/usr/bin/env bash
# StatusLine command based on Powerlevel10k configuration
# This script receives JSON input via stdin with context about the current Claude session

# Read JSON input
input=$(cat)

# Extract values from JSON
cwd=$(echo "$input" | jq -r '.workspace.current_dir')

# Get current directory name (like \W in bash)
dir_name=$(basename "$cwd")

# Get git branch if in a git repo (skip optional locks for performance)
git_branch=""
if git -C "$cwd" rev-parse --git-dir >/dev/null 2>&1; then
    git_branch=$(git -C "$cwd" -c core.fileMode=false branch --show-current 2>/dev/null)
    if [ -n "$git_branch" ]; then
        # Check if there are uncommitted changes
        if ! git -C "$cwd" -c core.fileMode=false diff-index --quiet HEAD 2>/dev/null; then
            git_status="*"
        else
            git_status=""
        fi
        git_info=" \ue0a0 $git_branch$git_status"
    fi
fi

# Get username and hostname
user=$(whoami)
host=$(hostname -s)

# Build status line with colors (using printf for ANSI codes)
# Colors will be dimmed by the terminal
printf "\033[32m%s@%s\033[0m:\033[34m%s\033[0m%s" "$user" "$host" "$dir_name" "$git_info"
