// Custom Video Player Controller

class VideoPlayerController {
    constructor() {
        this.isOpen = false;
        this.currentVideo = null;
        this.playerElement = null;
        this.overlayElement = null;
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupKeyboardControls();
    }
    
    setupElements() {
        this.overlayElement = document.getElementById('videoPlayerOverlay');
        this.playerElement = document.getElementById('videoFrame');
        this.closeButton = document.getElementById('closePlayer');
        this.titleElement = document.getElementById('videoTitle');
        this.descriptionElement = document.getElementById('videoDescription');
        this.ctaButton = document.getElementById('videoCTA');
    }
    
    setupEventListeners() {
        // Close button
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }
        
        // Overlay click to close (but not on content)
        if (this.overlayElement) {
            this.overlayElement.addEventListener('click', (e) => {
                if (e.target === this.overlayElement) {
                    this.close();
                }
            });
        }
        
        // CTA button
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', () => {
                this.handleCTAClick();
            });
        }
        
        // Prevent video interaction when closed
        document.addEventListener('click', (e) => {
            if (e.target.closest('.video-card') || e.target.closest('.mobile-video-card')) {
                e.preventDefault();
                const videoData = this.getVideoDataFromElement(e.target);
                if (videoData) {
                    this.open(videoData);
                }
            }
        });
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case ' ':
                case 'k':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'f':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'm':
                    e.preventDefault();
                    this.toggleMute();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.seek(-10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.seek(10);
                    break;
            }
        });
    }
    
    open(videoData) {
        if (this.isOpen) {
            this.close();
            setTimeout(() => this.open(videoData), 300);
            return;
        }
        
        this.currentVideo = videoData;
        this.isOpen = true;
        
        // Set video content
        this.updatePlayerContent();
        
        // Show overlay with animation
        if (this.overlayElement) {
            this.overlayElement.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Load video with autoplay
        this.loadVideo();
        
        // Analytics tracking
        this.trackVideoOpen(videoData);
        
        // Add loading state
        this.showLoadingState();
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        // Hide overlay
        if (this.overlayElement) {
            this.overlayElement.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Stop and clear video
        setTimeout(() => {
            this.clearVideo();
        }, 300);
        
        // Analytics tracking
        this.trackVideoClose();
        
        this.currentVideo = null;
    }
    
    updatePlayerContent() {
        if (!this.currentVideo) return;
        
        // Update title
        if (this.titleElement) {
            this.titleElement.textContent = this.currentVideo.title;
        }
        
        // Update description
        if (this.descriptionElement) {
            this.descriptionElement.textContent = this.currentVideo.description;
        }
        
        // Update CTA button
        if (this.ctaButton) {
            this.ctaButton.textContent = this.getCTAText(this.currentVideo.category);
        }
    }
    
    loadVideo() {
        if (!this.playerElement || !this.currentVideo) return;
        
        const videoUrl = this.buildVideoURL(this.currentVideo.id);
        
        // Set iframe source
        this.playerElement.src = videoUrl;
        
        // Handle iframe load
        this.playerElement.addEventListener('load', () => {
            this.hideLoadingState();
        }, { once: true });
        
        // Fallback to hide loading after timeout
        setTimeout(() => {
            this.hideLoadingState();
        }, 5000);
    }
    
    clearVideo() {
        if (this.playerElement) {
            this.playerElement.src = '';
        }
    }
    
    buildVideoURL(videoId) {
        const baseUrl = 'https://www.youtube.com/embed/';
        const params = new URLSearchParams({
            autoplay: '1',
            rel: '0',
            modestbranding: '1',
            fs: '1',
            cc_load_policy: '1',
            iv_load_policy: '3',
            playsinline: '1'
        });
        
        return `${baseUrl}${videoId}?${params.toString()}`;
    }
    
    getCTAText(category) {
        const ctaTexts = {
            'case-studies': 'Ver Case Completo',
            'ads': 'Solicitar Orçamento',
            'shorts': 'Mais Projetos',
            'default': 'Ver Projeto'
        };
        
        return ctaTexts[category] || ctaTexts.default;
    }
    
    getVideoDataFromElement(element) {
        const videoCard = element.closest('.video-card') || element.closest('.mobile-video-card');
        if (!videoCard) return null;
        
        // Find video data from the global videos array
        const titleElement = videoCard.querySelector('.video-title');
        if (!titleElement) return null;
        
        const title = titleElement.textContent;
        return window.videoData?.find(video => video.title === title) || null;
    }
    
    showLoadingState() {
        if (!this.overlayElement) return;
        
        // Create loading indicator if it doesn't exist
        let loadingIndicator = this.overlayElement.querySelector('.video-loading');
        
        if (!loadingIndicator) {
            loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'video-loading';
            loadingIndicator.innerHTML = `
                <div class="video-loading-spinner"></div>
                <div class="video-loading-text">Carregando vídeo...</div>
            `;
            
            const playerContainer = this.overlayElement.querySelector('.player-container');
            if (playerContainer) {
                playerContainer.appendChild(loadingIndicator);
            }
        }
        
        loadingIndicator.style.display = 'flex';
    }
    
    hideLoadingState() {
        const loadingIndicator = this.overlayElement?.querySelector('.video-loading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
    
    handleCTAClick() {
        if (!this.currentVideo) return;
        
        // Track CTA click
        this.trackCTAClick(this.currentVideo);
        
        // Handle different CTA actions based on video category
        switch(this.currentVideo.category) {
            case 'case-studies':
                this.openCaseStudy(this.currentVideo);
                break;
            case 'ads':
                this.scrollToContact();
                break;
            default:
                this.openProjectDetails(this.currentVideo);
                break;
        }
    }
    
    openCaseStudy(video) {
        // In a real implementation, this would open a detailed case study page
        console.log('Opening case study for:', video.title);
        
        // For now, scroll to contact or show more info
        this.scrollToContact();
    }
    
    openProjectDetails(video) {
        // Show more project details or portfolio section
        console.log('Opening project details for:', video.title);
        
        // Close player and scroll to relevant section
        this.close();
        setTimeout(() => {
            this.scrollToSection('cases');
        }, 300);
    }
    
    scrollToContact() {
        this.close();
        setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 300);
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Video control methods (for future custom player implementation)
    togglePlayPause() {
        // This would require YouTube API or postMessage to iframe
        console.log('Toggle play/pause');
    }
    
    toggleFullscreen() {
        if (this.playerElement) {
            if (this.playerElement.requestFullscreen) {
                this.playerElement.requestFullscreen();
            }
        }
    }
    
    toggleMute() {
        // This would require YouTube API
        console.log('Toggle mute');
    }
    
    seek(seconds) {
        // This would require YouTube API
        console.log('Seek', seconds, 'seconds');
    }
    
    // Analytics methods
    trackVideoOpen(video) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_open', {
                'video_title': video.title,
                'video_id': video.id,
                'video_category': video.category
            });
        }
        
        // Custom analytics
        if (window.analytics) {
            window.analytics.track('Video Opened', {
                title: video.title,
                id: video.id,
                category: video.category
            });
        }
    }
    
    trackVideoClose() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_close');
        }
        
        if (window.analytics) {
            window.analytics.track('Video Closed');
        }
    }
    
    trackCTAClick(video) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                'video_title': video.title,
                'cta_type': this.getCTAText(video.category)
            });
        }
        
        if (window.analytics) {
            window.analytics.track('CTA Clicked', {
                video_title: video.title,
                cta_type: this.getCTAText(video.category)
            });
        }
    }
    
    // Public methods
    isPlayerOpen() {
        return this.isOpen;
    }
    
    getCurrentVideo() {
        return this.currentVideo;
    }
    
    // Quality selector (for future implementation)
    setupQualitySelector() {
        // This would require YouTube API for quality control
        console.log('Quality selector setup');
    }
    
    // Captions toggle (for future implementation)
    setupCaptionsToggle() {
        // This would require YouTube API for caption control
        console.log('Captions toggle setup');
    }
}

// Enhanced video card creation with proper data binding
function createEnhancedVideoCard(video, index, isMobile = false) {
    const card = document.createElement('div');
    card.className = isMobile ? 'mobile-video-card' : 'video-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Store video data on element for easy retrieval
    card.dataset.videoId = video.id;
    card.dataset.videoData = JSON.stringify(video);
    
    const thumbnailHtml = `
        <div class="video-thumbnail-container">
            <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" loading="lazy">
        </div>
    `;
    
    const overlayHtml = `
        <div class="video-overlay">
            <div class="play-icon">
                <i class="fas fa-play"></i>
            </div>
        </div>
    `;
    
    const infoHtml = `
        <div class="video-info">
            <h4 class="video-title">${video.title}</h4>
            <div class="video-meta">
                <span class="video-duration">${video.duration}</span>
                <span class="video-tag">${getCategoryLabel(video.category)}</span>
            </div>
        </div>
    `;
    
    card.innerHTML = thumbnailHtml + overlayHtml + infoHtml;
    
    // Add click handler
    card.addEventListener('click', () => {
        if (window.videoPlayerController) {
            window.videoPlayerController.open(video);
        }
    });
    
    return card;
}

// Utility function for category labels
function getCategoryLabel(category) {
    const labels = {
        'all': 'Todos',
        'case-studies': 'Case',
        'ads': 'Publicidade', 
        'shorts': 'Short',
        'music': 'Música',
        'reels': 'Reel'
    };
    return labels[category] || category;
}

// Initialize player controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.videoPlayerController = new VideoPlayerController();
});

// Export for global access
window.VideoPlayerController = VideoPlayerController;
window.createEnhancedVideoCard = createEnhancedVideoCard;
