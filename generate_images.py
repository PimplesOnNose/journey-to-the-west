#!/usr/bin/env python3
"""Generate Chinese painting style illustrations for Journey to the West."""
import os
import sys
import json
import base64
import requests
from pathlib import Path

# Load credentials
env_path = Path.home() / ".pi" / "agent" / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ[key.strip()] = val.strip().strip('"')
else:
    print("Error: ~/.pi/agent/.env not found", file=sys.stderr)
    sys.exit(1)

ACCOUNT_ID = os.environ["CLOUDFLARE_ID"]
API_KEY = os.environ["CLOUDFLARE_API_KEY"]
API_URL = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell"

# Chinese painting style prompt template
STYLE_TEMPLATE = "Traditional Chinese ink wash painting, elegant brushstrokes, soft colors, detailed illustration for children's book, {scene}, masterpiece quality, beautiful composition, ancient Chinese art style"

# Scene descriptions for each page
SCENES = {
    1: "a magical stone cracking open on a flower and fruit mountain, a cute little monkey jumping out, surrounded by other monkeys, lush vegetation, misty mountains in background",
    2: "a wise old master teaching a young monkey martial arts and magic skills, mountain temple setting, cherry blossoms falling, magical sparkles in the air",
    3: "a powerful monkey king holding a glowing golden staff that can grow and shrink, standing on a mountain peak, clouds swirling around, divine light emanating from the staff",
    4: "a giant Buddha hand reaching down from the heavens, a small monkey standing defiantly on the palm, celestial clouds, golden light rays",
    5: "a huge mountain with a monkey peeking out from underneath, sad expression, 500 years passing shown by seasons changing around the mountain",
    6: "a kind Buddhist monk with a gentle smile meeting a strong river giant carrying luggage, Monkey King standing beside them, peaceful river landscape",
    7: "a friendly pig-faced character in monk robes joining the travel group, carrying a rake weapon, laughing expression, mountain path setting",
    8: "Monkey King fighting a white bone demon who transforms into different people, dynamic action scene, magical energy, three transformation sequences",
    9: "a mountain covered in magical flames, Monkey King using a giant fan to blow out the fire, intense orange and red colors, heroic pose",
    10: "the whole group reaching a golden temple in the West, receiving holy scriptures, radiant golden light, celebratory atmosphere, flowers falling from sky"
}

def generate_image(prompt, output_path, width=1024, height=768):
    """Generate an image using Cloudflare AI."""
    payload = {
        "prompt": prompt,
        "width": width,
        "height": height,
        "num_steps": 4,
        "guidance": 7.5
    }
    
    try:
        resp = requests.post(
            API_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=60
        )
        resp.raise_for_status()
        data = resp.json()
        
        if "result" in data and "image" in data["result"]:
            img_bytes = base64.b64decode(data["result"]["image"])
            with open(output_path, "wb") as f:
                f.write(img_bytes)
            print(f"✅ Generated {output_path} ({len(img_bytes)} bytes)")
            return True
        else:
            print(f"❌ Unexpected response for {output_path}: {data}", file=sys.stderr)
            return False
    except Exception as e:
        print(f"❌ Error generating {output_path}: {e}", file=sys.stderr)
        return False

def main():
    """Generate all illustrations."""
    images_dir = Path("images")
    images_dir.mkdir(exist_ok=True)
    
    print("🎨 Generating Chinese painting style illustrations...")
    print(f"📁 Output directory: {images_dir.absolute()}")
    print()
    
    success_count = 0
    for page_num, scene in SCENES.items():
        prompt = STYLE_TEMPLATE.format(scene=scene)
        output_path = images_dir / f"page{page_num}.jpg"
        
        if output_path.exists():
            print(f"⏭️  Skipping page {page_num} (already exists)")
            success_count += 1
            continue
        
        print(f"🖌️  Generating page {page_num}...")
        if generate_image(prompt, output_path):
            success_count += 1
    
    print()
    print(f"🎉 Generated {success_count}/{len(SCENES)} illustrations")
    return success_count == len(SCENES)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)