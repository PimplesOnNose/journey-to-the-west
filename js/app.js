// Journey to the West - Interactive Story App
class StoryApp {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 10;
        this.currentLang = 'en'; // 'en' or 'zh'
        this.audio = null;
        this.isPlaying = false;
        this.isAutoPlay = false;
        this.storyData = null;
        
        this.init();
    }
    
    async init() {
        await this.loadStoryData();
        this.setupEventListeners();
        this.updatePage();
        this.setupAudio();
    }
    
    async loadStoryData() {
        try {
            const response = await fetch('story.json');
            this.storyData = await response.json();
        } catch (error) {
            console.error('Error loading story data:', error);
            // Fallback data if JSON fails to load
            this.storyData = {
                title: {
                    en: "Journey to the West",
                    zh: "西游记",
                    pinyin: "Xī Yóu Jì"
                },
                pages: []
            };
        }
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.prevPage());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextPage());
        
        // Language toggle
        document.getElementById('langEn').addEventListener('click', () => this.setLanguage('en'));
        document.getElementById('langZh').addEventListener('click', () => this.setLanguage('zh'));
        
        // Audio controls
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('autoPlayBtn').addEventListener('click', () => this.toggleAutoPlay());
        
        // Progress bar click
        document.querySelector('.progress-bar').addEventListener('click', (e) => this.seekAudio(e));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    setupAudio() {
        this.audio = new Audio();
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onAudioEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    }
    
    updatePage() {
        if (!this.storyData || !this.storyData.pages.length) return;
        
        const page = this.storyData.pages[this.currentPage - 1];
        
        // Update image
        document.getElementById('storyImage').src = `images/page${this.currentPage}.jpg`;
        document.getElementById('storyImage').alt = page.title[this.currentLang];
        
        // Update title
        document.getElementById('storyTitle').textContent = page.title[this.currentLang];
        
        // Update pinyin (only for Chinese)
        if (this.currentLang === 'zh') {
            // Show title pinyin
            document.getElementById('titlePinyinContainer').style.display = 'block';
            document.getElementById('storyTitlePinyin').textContent = page.title.pinyin;
            
            // Show content pinyin
            document.getElementById('contentPinyinContainer').style.display = 'block';
            document.getElementById('storyContentPinyin').textContent = page.content.pinyin;
        } else {
            document.getElementById('titlePinyinContainer').style.display = 'none';
            document.getElementById('contentPinyinContainer').style.display = 'none';
        }
        
        // Update text
        document.getElementById('storyText').textContent = page.content[this.currentLang];
        
        // Update page indicator
        document.getElementById('currentPage').textContent = this.currentPage;
        
        // Update navigation buttons
        document.getElementById('prevBtn').style.opacity = this.currentPage === 1 ? '0.5' : '1';
        document.getElementById('nextBtn').style.opacity = this.currentPage === this.totalPages ? '0.5' : '1';
        
        // Load audio for current page
        this.loadAudio();
        
        // Animate content
        this.animateContent();
    }
    
    animateContent() {
        const content = document.querySelector('.story-content');
        content.style.animation = 'none';
        content.offsetHeight; // Trigger reflow
        content.style.animation = 'fadeIn 0.6s ease-out';
    }
    
    loadAudio() {
        if (!this.audio) return;
        
        const audioFile = `audio/page${this.currentPage}_${this.currentLang}.mp3`;
        this.audio.src = audioFile;
        this.audio.load();
        
        // Reset progress
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('currentTime').textContent = '0:00';
        document.getElementById('totalTime').textContent = '0:00';
    }
    
    setLanguage(lang) {
        this.currentLang = lang;
        
        // Update language buttons
        document.getElementById('langEn').classList.toggle('active', lang === 'en');
        document.getElementById('langZh').classList.toggle('active', lang === 'zh');
        
        // Update page with new language
        this.updatePage();
        
        // Stop audio if playing
        if (this.isPlaying) {
            this.stopAudio();
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.stopAudio();
        } else {
            this.playAudio();
        }
    }
    
    playAudio() {
        if (!this.audio) return;
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }
    
    stopAudio() {
        if (!this.audio) return;
        
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayButton();
    }
    
    updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        if (this.isPlaying) {
            playBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            `;
        } else {
            playBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }
    }
    
    toggleAutoPlay() {
        this.isAutoPlay = !this.isAutoPlay;
        const autoPlayBtn = document.getElementById('autoPlayBtn');
        autoPlayBtn.classList.toggle('active', this.isAutoPlay);
    }
    
    onAudioEnd() {
        this.isPlaying = false;
        this.updatePlayButton();
        
        // Auto play next page if enabled
        if (this.isAutoPlay && this.currentPage < this.totalPages) {
            setTimeout(() => {
                this.nextPage();
                setTimeout(() => this.playAudio(), 500);
            }, 1000);
        }
    }
    
    updateProgress() {
        if (!this.audio) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('currentTime').textContent = this.formatTime(this.audio.currentTime);
    }
    
    updateDuration() {
        if (!this.audio) return;
        
        document.getElementById('totalTime').textContent = this.formatTime(this.audio.duration);
    }
    
    seekAudio(e) {
        if (!this.audio) return;
        
        const progressBar = e.currentTarget;
        const clickPosition = e.offsetX / progressBar.offsetWidth;
        this.audio.currentTime = clickPosition * this.audio.duration;
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePage();
        }
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePage();
        }
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                this.nextPage();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.prevPage();
                break;
            case ' ':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'Enter':
                e.preventDefault();
                this.toggleAutoPlay();
                break;
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StoryApp();
});