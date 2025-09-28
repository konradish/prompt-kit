from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict

import yaml

PROMPT_ROOT = Path(__file__).resolve().parent.parent / ".." / "prompts"
PROMPT_ROOT = PROMPT_ROOT.resolve()


@dataclass
class PromptDocument:
    metadata: Dict[str, Any]
    body: str
    path: Path


def load_prompt(relative_path: str | Path) -> PromptDocument:
    """Load a prompt with YAML front matter and return metadata with body."""
    path = (PROMPT_ROOT / Path(relative_path)).resolve()
    if not path.is_file():
        raise FileNotFoundError(f"Prompt not found: {path}")

    content = path.read_text(encoding="utf-8")
    if not content.startswith("---\n"):
        raise ValueError(f"Prompt {path} is missing YAML front matter header")

    parts = content.split("\n---\n", 1)
    if len(parts) != 2:
        raise ValueError(f"Prompt {path} must contain YAML front matter followed by content")

    raw_meta = parts[0].removeprefix("---\n")
    metadata = yaml.safe_load(raw_meta) or {}
    body = parts[1].lstrip("\n")
    return PromptDocument(metadata=metadata, body=body, path=path)
