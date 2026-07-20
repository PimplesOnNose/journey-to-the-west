#!/usr/bin/env python3
"""Generate audio files for Journey to the West using Edge TTS."""
import os
import sys
import json
import asyncio
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("Installing edge-tts...")
    os.system("pip install edge-tts")
    import edge_tts

# Voice settings
ENGLISH_VOICE = "en-US-GuyNeural"  # Male voice
MANDARIN_VOICE = "zh-CN-XiaoxiaoNeural"  # Female voice

# Speed settings (Edge TTS uses percentage: +0% is normal, -8% is slower)
ENGLISH_SPEED = "+0%"
MANDARIN_SPEED = "-8%"

async def generate_audio(text, voice, speed, output_path):
    """Generate audio file using Edge TTS."""
    try:
        communicate = edge_tts.Communicate(text, voice, rate=speed)
        await communicate.save(output_path)
        print(f"✅ Generated {output_path}")
        return True
    except Exception as e:
        print(f"❌ Error generating {output_path}: {e}", file=sys.stderr)
        return False

async def main():
    """Generate all audio files."""
    # Load story data
    with open("story.json", "r", encoding="utf-8") as f:
        story = json.load(f)
    
    audio_dir = Path("audio")
    audio_dir.mkdir(exist_ok=True)
    
    print("🎵 Generating audio files...")
    print(f"📁 Output directory: {audio_dir.absolute()}")
    print()
    
    success_count = 0
    total_files = len(story["pages"]) * 2  # English + Mandarin for each page
    
    for page in story["pages"]:
        page_num = page["id"]
        title = page["title"]
        content = page["content"]
        
        # Generate English audio
        en_text = f"{title['en']}. {content['en']}"
        en_output = audio_dir / f"page{page_num}_en.mp3"
        
        if not en_output.exists():
            print(f"🗣️  Generating English audio for page {page_num}...")
            if await generate_audio(en_text, ENGLISH_VOICE, ENGLISH_SPEED, en_output):
                success_count += 1
        else:
            print(f"⏭️  Skipping English page {page_num} (already exists)")
            success_count += 1
        
        # Generate Mandarin audio
        zh_text = f"{title['zh']}。{content['zh']}"
        zh_output = audio_dir / f"page{page_num}_zh.mp3"
        
        if not zh_output.exists():
            print(f"🗣️  Generating Mandarin audio for page {page_num}...")
            if await generate_audio(zh_text, MANDARIN_VOICE, MANDARIN_SPEED, zh_output):
                success_count += 1
        else:
            print(f"⏭️  Skipping Mandarin page {page_num} (already exists)")
            success_count += 1
    
    print()
    print(f"🎉 Generated {success_count}/{total_files} audio files")
    return success_count == total_files

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)