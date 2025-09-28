from pathlib import Path

import pytest

from prompt_kit.loader import load_prompt, PromptDocument


def test_load_prompt_success(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    prompt_dir = tmp_path / "prompts"
    prompt_dir.mkdir()
    prompt_file = prompt_dir / "system" / "test.md"
    prompt_file.parent.mkdir(parents=True)
    prompt_file.write_text("""---\nid: test.v1\nrole: system\nowner: qa\n---\nHello""", encoding="utf-8")

    import prompt_kit.loader as loader

    monkeypatch.setattr(loader, "PROMPT_ROOT", prompt_dir)

    doc = load_prompt("system/test.md")
    assert isinstance(doc, PromptDocument)
    assert doc.metadata["id"] == "test.v1"
    assert doc.body.strip() == "Hello"


def test_load_prompt_missing_front_matter(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    prompt_dir = tmp_path / "prompts"
    prompt_dir.mkdir()
    prompt_file = prompt_dir / "system" / "test.md"
    prompt_file.parent.mkdir(parents=True)
    prompt_file.write_text("No front matter", encoding="utf-8")

    import prompt_kit.loader as loader

    monkeypatch.setattr(loader, "PROMPT_ROOT", prompt_dir)

    with pytest.raises(ValueError):
        load_prompt("system/test.md")
