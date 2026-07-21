# Journey to the West - Interactive Story App

An interactive web application telling the famous Chinese folktale "Journey to the West" (西游记), designed for primary school children.

**[View Live →](https://pimplesonnose.github.io/journey-to-the-west/)**

## Features

### 🎨 Beautiful Chinese Painting Aesthetics
- Traditional Chinese ink wash painting style illustrations
- Rice paper texture background
- Vermillion accents and jade green elements
- Elegant typography with Chinese calligraphy fonts

### 🌏 Bilingual Support
- **English** (default) - Complete story narration
- **Chinese** (中文) - Full Chinese text with Pinyin pronunciation guide
- Easy toggle between languages

### 🎵 Audio Narration
- **English**: Male voice at normal speed
- **Mandarin**: Female voice slowed down by 8% for better comprehension
- Pre-recorded MP3 files for each page
- Play/pause controls
- Progress bar with time display

### 📖 Interactive Storytelling
- 10 illustrated pages of the Journey to the West story
- Page navigation with arrow buttons
- Keyboard navigation (arrow keys, spacebar, enter)
- Auto-play feature for continuous reading

### 📱 Responsive Design
- Works on desktop, tablet, and mobile devices
- Adaptive layout for different screen sizes
- Touch-friendly controls

## Story Pages

1. **The Monkey King is Born** - 美猴王出世
2. **Learning Magic Skills** - 拜师学艺
3. **The Golden Cudgel** - 如意金箍棒
4. **The Buddha's Challenge** - 如来佛祖的挑战
5. **Under the Mountain** - 五行山下
6. **A New Friend: Sandy** - 新朋友：沙悟净
7. **Pigsy Joins the Journey** - 猪八戒加入取经队伍
8. **Facing the White Bone Demon** - 三打白骨精
9. **The Fire Mountain** - 火焰山
10. **Reaching the West** - 到达西天

## Technical Details

### Audio Generation
- English audio: `en-US-GuyNeural` (male voice)
- Mandarin audio: `zh-CN-XiaoxiaoNeural` (female voice, -8% speed)
- Generated using Edge TTS

### Illustrations
- Generated using Cloudflare AI (FLUX model)
- Traditional Chinese painting style
- 1024x768 resolution

### Project Structure
```
journey-to-the-west/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Chinese painting aesthetics
├── js/
│   └── app.js          # Interactive functionality
├── images/             # Story illustrations
├── audio/              # Narration audio files
├── story.json          # Story content (bilingual)
├── generate_images.py  # Image generation script
└── generate_audio.py   # Audio generation script
```

## Usage

### Viewing the App
1. Open `index.html` in a web browser
2. Use the language toggle to switch between English and Chinese
3. Navigate pages using arrow buttons or keyboard
4. Click the play button to hear narration
5. Enable auto-play for continuous reading

### Generating Assets
```bash
# Generate illustrations
python3 generate_images.py

# Generate audio files
python3 generate_audio.py
```

## Controls

- **←/→ Arrow Keys**: Previous/Next page
- **Spacebar**: Play/Pause audio
- **Enter**: Toggle auto-play
- **Language Button**: Switch between English/Chinese

## Design Elements

- **Colors**: Rice paper (#f5f0e8), Vermillion (#c23b22), Jade Green (#00a86b)
- **Fonts**: Ma Shan Zheng (Chinese calligraphy), Noto Serif SC (body text)
- **Decorations**: Cloud patterns, bamboo elements, traditional frames

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License. The story content is based on the public domain Chinese folktale "Journey to the West".

## Credits

Made with [Pi](https://pi.dev) & [Xiaomi Mimo](https://mimo.mi.com/)