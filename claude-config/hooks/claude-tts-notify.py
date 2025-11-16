#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["elevenlabs", "pygame"]
# ///
"""
ElevenLabs TTS notification hook for Claude Code.

Plays audio notifications when Claude Code completes tasks or needs attention.
Uses ElevenLabs API for high-quality voice and pygame for direct audio playback.
"""

import sys
import json
import os
import io


def play_audio_bytes(audio_bytes: bytes) -> bool:
    """Play audio bytes directly using pygame mixer."""
    try:
        import pygame

        pygame.mixer.init()
        audio_stream = io.BytesIO(audio_bytes)
        pygame.mixer.music.load(audio_stream)
        pygame.mixer.music.play()

        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)

        pygame.mixer.quit()
        return True
    except Exception as e:
        print(f"Error playing audio: {e}", file=sys.stderr)
        return False


def generate_tts(text: str, api_key: str) -> bytes:
    """Generate TTS audio using ElevenLabs."""
    from elevenlabs import VoiceSettings, ElevenLabs

    client = ElevenLabs(api_key=api_key)

    voice_settings = VoiceSettings(
        stability=0.6,
        similarity_boost=0.8,
        style=0.0,
        use_speaker_boost=True,
    )

    # Generate speech
    audio_generator = client.text_to_speech.convert(
        voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel voice
        text=text,
        model_id="eleven_turbo_v2_5",
        voice_settings=voice_settings,
    )

    # Collect audio chunks
    audio_bytes = b""
    for chunk in audio_generator:
        audio_bytes += chunk

    return audio_bytes


def main():
    """Main hook entry point."""
    # Read hook input from stdin
    try:
        hook_input = json.loads(sys.stdin.read())
    except Exception as e:
        print(f"Error reading hook input: {e}", file=sys.stderr)
        return 1

    # Get API key from environment
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        print("ELEVENLABS_API_KEY not set", file=sys.stderr)
        return 1

    # Determine message based on event type
    event_name = hook_input.get("hook_event_name", "")

    if event_name == "Stop":
        message = "Task complete."
    elif event_name == "SubagentStop":
        message = "Subagent finished."
    elif event_name == "Notification":
        notification_type = hook_input.get("notification_type", "")
        if notification_type == "permission_prompt":
            message = "Permission required."
        else:
            message = "Claude needs attention."
    else:
        message = "Claude Code notification."

    # Generate and play TTS
    try:
        audio_bytes = generate_tts(message, api_key)
        play_audio_bytes(audio_bytes)
        return 0
    except Exception as e:
        print(f"TTS error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
