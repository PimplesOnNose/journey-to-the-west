/**
 * 西游记 — Journey to the West
 * An interactive story experience
 */

class StoryApp {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 10;
        this.currentLang = 'en';
        this.storyData = null;
        this.audio = null;
        this.isPlaying = false;
        this.isAutoPlay = false;
        this.isTransitioning = false;
        
        this.elements = {
            image: document.getElementById('storyImage'),
            title: document.getElementById('storyTitle'),
            titlePinyin: document.getElementById('storyTitlePinyin'),
            contentPinyin: document.getElementById('storyContentPinyin'),
            contentPinyinContainer: document.getElementById('contentPinyinContainer'),
            text: document.getElementById('storyText'),
            currentPage: document.getElementById('currentPage'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            playBtn: document.getElementById('playBtn'),
            autoBtn: document.getElementById('autoPlayBtn'),
            progressFill: document.getElementById('progressFill'),
            illustrationLayer: document.querySelector('.illustration-layer'),
            scrollContent: document.querySelector('.scroll-content'),
            iconPlay: document.querySelector('.icon-play'),
            iconPause: document.querySelector('.icon-pause')
        };
        
        this.init();
    }
    
    async init() {
        await this.loadStory();
        this.setupAudio();
        this.bindEvents();
        this.updateView();
    }
    
    async loadStory() {
        try {
            const response = await fetch('story.json');
            this.storyData = await response.json();
        } catch (err) {
            console.error('Failed to load story:', err);
        }
    }
    
    setupAudio() {
        this.audio = new Audio();
        this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.audio.addEventListener('ended', () => this.onAudioEnd());
    }
    
    bindEvents() {
        // Navigation
        this.elements.prevBtn.addEventListener('click', () => this.prev());
        this.elements.nextBtn.addEventListener('click', () => this.next());
        
        // Language
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setLang(btn.dataset.lang));
        });
        
        // Audio
        this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        this.elements.autoBtn.addEventListener('click', () => this.toggleAuto());
        
        // Progress seek
        document.querySelector('.progress-track').addEventListener('click', (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.audio.duration;
        });
        
        // Keyboard
        document.addEventListener('keydown', (e) => this.onKeydown(e));
        
        // Touch swipe
        this.setupSwipe();
    }
    
    setupSwipe() {
        let startX = 0;
        let startY = 0;
        
        this.elements.scrollContent.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        this.elements.scrollContent.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                if (dx > 0) this.prev();
                else this.next();
            }
        }, { passive: true });
    }
    
    onKeydown(e) {
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.prev();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                this.next();
                break;
            case ' ':
                e.preventDefault();
                this.togglePlay();
                break;
        }
    }
    
    // Navigation
    
    prev() {
        if (this.currentPage > 1 && !this.isTransitioning) {
            this.goTo(this.currentPage - 1);
        }
    }
    
    next() {
        if (this.currentPage < this.totalPages && !this.isTransitioning) {
            this.goTo(this.currentPage + 1);
        }
    }
    
    goTo(page) {
        if (page === this.currentPage || this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.stopAudio();
        
        // Animate out
        this.elements.scrollContent.classList.add('transitioning');
        this.elements.illustrationLayer.classList.add('crossfading');
        
        setTimeout(() => {
            this.currentPage = page;
            this.updateView();
            
            // Animate in
            setTimeout(() => {
                this.elements.scrollContent.classList.remove('transitioning');
                this.elements.illustrationLayer.classList.remove('crossfading');
                this.isTransitioning = false;
            }, 100);
        }, 300);
    }
    
    // View updates
    
    updateView() {
        if (!this.storyData) return;
        
        const page = this.storyData.pages[this.currentPage - 1];
        
        // Update image
        this.elements.image.src = `images/page${this.currentPage}.jpg`;
        
        // Update page indicator
        this.elements.currentPage.textContent = this.currentPage;
        
        // Update navigation state
        this.elements.prevBtn.disabled = this.currentPage === 1;
        this.elements.nextBtn.disabled = this.currentPage === this.totalPages;
        
        // Update content based on language
        if (this.currentLang === 'en') {
            this.elements.title.textContent = page.title.en;
            this.elements.text.textContent = page.content.en;
            this.elements.titlePinyin.style.display = 'none';
            this.elements.contentPinyinContainer.style.display = 'none';
        } else {
            this.elements.title.textContent = page.title.zh;
            this.elements.text.textContent = page.content.zh;
            this.elements.titlePinyin.textContent = page.title.pinyin;
            this.elements.titlePinyin.style.display = 'block';
            this.elements.contentPinyin.textContent = page.content.pinyin;
            this.elements.contentPinyinContainer.style.display = 'block';
        }
        
        // Load audio
        this.loadAudio();
        
        // Scroll to top
        this.elements.scrollContent.scrollTop = 0;
    }
    
    // Language
    
    setLang(lang) {
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        this.updateView();
    }
    
    // Audio
    
    loadAudio() {
        const src = `audio/page${this.currentPage}_${this.currentLang}.mp3`;
        this.audio.src = src;
        this.audio.load();
        this.elements.progressFill.style.width = '0%';
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.stopAudio();
        } else {
            this.playAudio();
        }
    }
    
    playAudio() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayIcon();
        }).catch(console.error);
    }
    
    stopAudio() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayIcon();
        this.elements.progressFill.style.width = '0%';
    }
    
    updatePlayIcon() {
        this.elements.iconPlay.style.display = this.isPlaying ? 'none' : 'block';
        this.elements.iconPause.style.display = this.isPlaying ? 'block' : 'none';
    }
    
    toggleAuto() {
        this.isAutoPlay = !this.isAutoPlay;
        this.elements.autoBtn.classList.toggle('active', this.isAutoPlay);
    }
    
    onTimeUpdate() {
        if (!this.audio.duration) return;
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.elements.progressFill.style.width = `${percent}%`;
    }
    
    onAudioEnd() {
        this.isPlaying = false;
        this.updatePlayIcon();
        this.elements.progressFill.style.width = '0%';
        
        if (this.isAutoPlay && this.currentPage < this.totalPages) {
            setTimeout(() => {
                this.next();
                setTimeout(() => this.playAudio(), 600);
            }, 800);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new StoryApp();
});