#!/usr/bin/env python
"""Simple validator to ensure prompt files include the required metadata."""

from __future__ import annotations

import sys
from pathlib import Path

import yaml

REQUIRED_FIELDS = {"id", "role", "owner"}
SKIP_TOP_LEVEL = {"fixtures", "evals", "templates"}


def iter_prompt_files(root: Path):
    for file in root.rglob("*.md"):
        rel = file.relative_to(root)
        if rel.name.lower() == "readme.md":
            continue
        if rel.parts[0] in SKIP_TOP_LEVEL:
            continue
        yield file


def validate_prompt(path: Path) -> list[str]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        errors.append("missing front matter header")
        return [f"{path}: {msg}" for msg in errors]

    try:
        front_matter, _ = text.split("\n---\n", 1)
    except ValueError:
        errors.append("front matter must be followed by '---' delimiter")
        return [f"{path}: {msg}" for msg in errors]

    metadata = yaml.safe_load(front_matter.lstrip("-\n")) or {}
    missing = REQUIRED_FIELDS - metadata.keys()
    if missing:
        errors.append(f"missing required fields: {', '.join(sorted(missing))}")
    if "id" in metadata and ".v" not in metadata["id"]:
        errors.append("id should contain a semantic version suffix like '.v1'")

    return [f"{path}: {msg}" for msg in errors]


def main() -> int:
    prompt_root = Path("prompts")
    prompt_files = list(iter_prompt_files(prompt_root))
    errors: list[str] = []
    for file in prompt_files:
        errors.extend(validate_prompt(file))

    if errors:
        for error in errors:
            print(error)
        return 1
    print(f"Validated {len(prompt_files)} prompt files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
