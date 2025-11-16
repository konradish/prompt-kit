#!/bin/bash
set -e

# Setup script to symlink ~/.claude to this repo's claude-config directory
# This allows you to version control your Claude Code configuration

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_CONFIG_DIR="$REPO_DIR/claude-config"
CLAUDE_HOME="$HOME/.claude"

echo "===================================="
echo "Claude Code Configuration Setup"
echo "===================================="
echo ""
echo "This script will:"
echo "1. Backup your existing ~/.claude directory (if it exists)"
echo "2. Create a symlink from ~/.claude to $CLAUDE_CONFIG_DIR"
echo "3. Move runtime files from backup to the new location"
echo ""

# Check if ~/.claude exists and is not already a symlink
if [ -L "$CLAUDE_HOME" ]; then
    echo "✓ ~/.claude is already a symlink to $(readlink "$CLAUDE_HOME")"
    echo ""
    read -p "Do you want to re-run setup? This will remove the current symlink. (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    rm "$CLAUDE_HOME"
elif [ -d "$CLAUDE_HOME" ]; then
    BACKUP_DIR="${CLAUDE_HOME}.backup.$(date +%Y%m%d-%H%M%S)"
    echo "Backing up existing ~/.claude to $BACKUP_DIR"
    mv "$CLAUDE_HOME" "$BACKUP_DIR"
    echo "✓ Backup created: $BACKUP_DIR"

    # Move runtime files from backup to claude-config
    echo ""
    echo "Migrating runtime files to $CLAUDE_CONFIG_DIR..."

    # List of runtime directories/files to migrate
    RUNTIME_ITEMS=(
        "debug"
        "file-history"
        "history.jsonl"
        "projects"
        "session-env"
        "shell-snapshots"
        "todos"
        "statsig"
        "local"
        "config"
        ".credentials.json"
        "settings.json"
        "settings.local.json"
        "plugins"
        "prompt-packs"
    )

    for item in "${RUNTIME_ITEMS[@]}"; do
        if [ -e "$BACKUP_DIR/$item" ]; then
            echo "  Moving $item..."
            mv "$BACKUP_DIR/$item" "$CLAUDE_CONFIG_DIR/" 2>/dev/null || true
        fi
    done
    echo "✓ Runtime files migrated"
else
    echo "No existing ~/.claude directory found"
fi

# Ensure runtime directories exist in claude-config
echo ""
echo "Ensuring runtime directories exist..."
mkdir -p "$CLAUDE_CONFIG_DIR/debug"
mkdir -p "$CLAUDE_CONFIG_DIR/file-history"
mkdir -p "$CLAUDE_CONFIG_DIR/projects"
mkdir -p "$CLAUDE_CONFIG_DIR/session-env"
mkdir -p "$CLAUDE_CONFIG_DIR/shell-snapshots"
mkdir -p "$CLAUDE_CONFIG_DIR/todos"
mkdir -p "$CLAUDE_CONFIG_DIR/statsig"
mkdir -p "$CLAUDE_CONFIG_DIR/local"
mkdir -p "$CLAUDE_CONFIG_DIR/config"
echo "✓ Runtime directories ready"

# Create settings.json from template if it doesn't exist
if [ ! -f "$CLAUDE_CONFIG_DIR/settings.json" ] && [ -f "$CLAUDE_CONFIG_DIR/settings.json.template" ]; then
    echo ""
    echo "Creating settings.json from template..."
    cp "$CLAUDE_CONFIG_DIR/settings.json.template" "$CLAUDE_CONFIG_DIR/settings.json"
    echo "✓ settings.json created"
fi

# Create the symlink
echo ""
echo "Creating symlink: ~/.claude -> $CLAUDE_CONFIG_DIR"
# Remove the directory if it exists (it shouldn't, but just in case)
if [ -d "$CLAUDE_HOME" ] && [ ! -L "$CLAUDE_HOME" ]; then
    rmdir "$CLAUDE_HOME" 2>/dev/null || rm -rf "$CLAUDE_HOME"
fi
ln -sf "$CLAUDE_CONFIG_DIR" "$CLAUDE_HOME"
echo "✓ Symlink created"

echo ""
echo "===================================="
echo "Setup complete!"
echo "===================================="
echo ""
echo "Your ~/.claude is now a symlink to:"
echo "  $CLAUDE_CONFIG_DIR"
echo ""
echo "All files (including runtime data) are now in this repo's claude-config/ directory."
echo ""
echo "To make changes:"
echo "  1. Edit files in claude-config/ (or via ~/.claude)"
echo "  2. Version-controlled files (CLAUDE.md, commands/, hooks/) can be committed"
echo "  3. Runtime files (history, todos, etc.) are gitignored"
echo ""
echo "To revert:"
echo "  rm ~/.claude && mv $BACKUP_DIR ~/.claude"
