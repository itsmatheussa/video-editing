// Main JavaScript for Portfolio Site

// Global variables
let isDeviceOpen = false;
let currentVideoData = {};
let videos = [];
let filteredVideos = [];
let isMobile = window.innerWidth <= 768;

// Sample video data (replace with your actual YouTube video data)
window.videoData = [
    {
        id: 'dQw4w9WgXcQ',
        title: 'Campanha Premium Brand',
        description: 'Uma narrativa visual que transformou a percepção da marca no mercado premium.',
        category: 'case-studies',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        duration: '2:30',
        featured: true
    },
    {
        id: 'oHg5SJYRHA0',
        title: 'Motion Graphics Reel',
        description: 'Compilado dos melhores trabalhos em motion design e animação.',
        category: 'shorts',
        thumbnail: 'https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg',
        duration: '1:45',
        featured: true
    },
    {
        id: 'ScMzIvxBSi4',
        title: 'Comercial TV - Produto',
        description: 'Direção e edição de comercial para televisão com foco em conversão.',
        category: 'ads',
        thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
        duration: '0:30',
        featured: false
    },
    {
        id: 'astISOttCQ0',
        title: 'Documentary Short',
        description: 'Mini documentário sobre inovação e criatividade no mercado digital.',
        category: 'case-studies',
        thumbnail: 'https://img.youtube.com/vi/astISOttCQ0/maxresdefault.jpg',
        duration: '5:20',
        featured: true
    },
    {
        id: '3JZ_D3ELwOQ',
        title: 'Social Media Content',
        description: 'Conteúdo dinâmico criado para redes sociais com alta performance.',
        category: 'shorts',
        thumbnail: 'https://img.youtube.com/vi/3JZ_D3ELwOQ/maxresdefault.jpg',
        duration: '0:15',
        featured: false
    },
    {
        id: 'kJQP7kiw5Fk',
        title: 'Brand Storytelling',
        description: 'Narrativa emocional que conecta marca e consumidor através do vídeo.',
        category: 'ads',
        thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
        duration: '3:15',
        featured: true
    }
];

// Initialize the site
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if mobile
    checkMobileDevice();
    
    // Initialize video data
    videos = window.videoData;
    filteredVideos = videos;
    window.filteredVideos = filteredVideos;
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup intersection observer for animations
    setupScrollAnimations();
    
    // Hide loading screen
    setTimeout(() => {
        hideLoadingScreen();
    }, 1500);
    
    // Setup form handling
    setupFormHandling();
}

function checkMobileDevice() {
    isMobile = window.innerWidth <= 768;
    
    // Update device visibility based on screen size
    const desktopDevice = document.getElementById('desktopDevice');
    const mobileDevice = document.getElementById('mobileDevice');
    
    if (isMobile) {
        desktopDevice.style.display = 'none';
        mobileDevice.style.display = 'block';
    } else {
        desktopDevice.style.display = 'block';
        mobileDevice.style.display = 'none';
    }
}

function setupEventListeners() {
    // Window resize handler
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Device interaction
    const deviceContainer = document.getElementById('deviceContainer');
    deviceContainer.addEventListener('click', handleDeviceClick);
    
    // Video filter buttons
    const filterButtons = document.querySelectorAll('.nav-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
    
    // Close video player
    const closePlayer = document.getElementById('closePlayer');
    if (closePlayer) {
        closePlayer.addEventListener('click', closeVideoPlayer);
    }
    
    // Escape key to close player
    document.addEventListener('keydown', handleKeyDown);
    
    // Smooth scroll for navigation
    setupSmoothScroll();
}

function handleResize() {
    const wasMobile = isMobile;
    checkMobileDevice();
    
    // If device type changed, reload content
    if (wasMobile !== isMobile) {
        if (isDeviceOpen) {
            loadVideoGrid();
        }
    }
}

function handleDeviceClick() {
    if (!isDeviceOpen) {
        openDevice();
    }
}

function openDevice() {
    if (isDeviceOpen) return;
    
    isDeviceOpen = true;
    const device = document.querySelector('.device');
    const deviceHint = document.getElementById('deviceHint');
    
    // Add opening animation class
    if (isMobile) {
        device.classList.add('mobile-opening');
    } else {
        device.classList.add('opening');
    }
    
    // Hide hint
    deviceHint.style.opacity = '0';
    deviceHint.style.transform = 'translateX(-50%) translateY(20px)';
    
    // Load video content after animation
    setTimeout(() => {
        loadVideoGrid();
    }, 1000);
    
    // Show screen content
    const screenContent = document.getElementById('screenContent');
    if (screenContent) {
        setTimeout(() => {
            screenContent.style.opacity = '1';
        }, 1200);
    }
}

function loadVideoGrid() {
    const videoGrid = document.getElementById('videoGrid');
    const mobileFeed = document.getElementById('mobileFeed');
    
    if (isMobile && mobileFeed) {
        loadMobileVideoFeed();
    } else if (videoGrid) {
        loadDesktopVideoGrid();
    }
}

function loadDesktopVideoGrid() {
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid) return;
    
    videoGrid.innerHTML = '';
    
    filteredVideos.forEach((video, index) => {
        const videoCard = createVideoCard(video, index);
        videoGrid.appendChild(videoCard);
    });
}

function loadMobileVideoFeed() {
    const mobileFeed = document.getElementById('mobileFeed');
    if (!mobileFeed) return;
    
    mobileFeed.innerHTML = '';
    
    filteredVideos.forEach((video, index) => {
        const mobileCard = createMobileVideoCard(video, index);
        mobileFeed.appendChild(mobileCard);
    });
}

function createVideoCard(video, index) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="video-thumbnail-container">
            <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
        </div>
        <div class="video-overlay">
            <div class="play-icon">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="video-info">
            <h4 class="video-title">${video.title}</h4>
            <div class="video-meta">
                <span class="video-duration">${video.duration}</span>
                <span class="video-tag">${getCategoryLabel(video.category)}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => openVideoPlayer(video));
    
    return card;
}

function createMobileVideoCard(video, index) {
    const card = document.createElement('div');
    card.className = 'mobile-video-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
        <div class="video-overlay">
            <div class="play-icon">
                <i class="fas fa-play"></i>
            </div>
            <div class="mobile-video-info">
                <h4 class="video-title">${video.title}</h4>
                <div class="video-meta">
                    <span class="video-duration">${video.duration}</span>
                    <span class="video-tag">${getCategoryLabel(video.category)}</span>
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => openVideoPlayer(video));
    
    return card;
}

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

function handleFilterChange(event) {
    const filterValue = event.target.dataset.filter;
    
    // Update active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter videos
    if (filterValue === 'all') {
        filteredVideos = videos;
    } else {
        filteredVideos = videos.filter(video => video.category === filterValue);
    }
    
    // Update global reference
    window.filteredVideos = filteredVideos;
    
    // Reload grid with animation
    const videoGrid = document.getElementById('videoGrid');
    const mobileFeed = document.getElementById('mobileFeed');
    
    if (videoGrid || mobileFeed) {
        // Fade out
        const container = isMobile ? mobileFeed : videoGrid;
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                loadVideoGrid();
                // Fade in
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 300);
        }
    }
}

function openVideoPlayer(video) {
    currentVideoData = video;
    const playerOverlay = document.getElementById('videoPlayerOverlay');
    const videoFrame = document.getElementById('videoFrame');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    
    if (!playerOverlay || !videoFrame) return;
    
    // Set video content
    videoFrame.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
    videoTitle.textContent = video.title;
    videoDescription.textContent = video.description;
    
    // Show player with animation
    playerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Analytics event (if you have analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'video_play', {
            'video_title': video.title,
            'video_id': video.id
        });
    }
}

function closeVideoPlayer() {
    const playerOverlay = document.getElementById('videoPlayerOverlay');
    const videoFrame = document.getElementById('videoFrame');
    
    if (!playerOverlay) return;
    
    // Hide player
    playerOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Stop video
    if (videoFrame) {
        videoFrame.src = '';
    }
    
    currentVideoData = {};
}

function handleKeyDown(event) {
    if (event.key === 'Escape') {
        closeVideoPlayer();
    }
}

function setupSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function setupScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.case-card, .service-card, .testimonial, .skill-item').forEach(el => {
        el.classList.add('animate-in');
        observer.observe(el);
    });
    
    // Animate skill bars when visible
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 200);
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.skill-item').forEach(el => {
        skillObserver.observe(el);
    });
}

function setupFormHandling() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        submitBtn.textContent = 'Mensagem Enviada!';
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
        
        // Analytics event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'form_name': 'contact_form'
            });
        }
    }, 2000);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart);
        }, 0);
    });
}

// Global functions for HTML onclick events
window.openDevice = openDevice;
window.scrollToContact = scrollToContact;
