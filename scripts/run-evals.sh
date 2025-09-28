#!/usr/bin/env bash
set -euo pipefail

if ! command -v promptfoo >/dev/null 2>&1; then
  echo "promptfoo is not installed. Install it with 'npm install -g promptfoo' or pin it in your toolchain." >&2
  exit 1
fi

promptfoo eval prompts/evals/promptfoo.yaml "$@"
