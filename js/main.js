// Main JavaScript for Portfolio Site

// Global variables
let isDeviceOpen = false;
let currentVideoData = {};
let videos = [];
let filteredVideos = [];
let isMobile = window.innerWidth <= 768;

// Sample video data (updated with new YouTube IDs)
window.videoData = [
    {
        id: '32V0GzI7I2o',
        title: 'Premium Brand Campaign',
        description: 'A visual narrative that transformed brand perception in the premium market.',
        category: 'case-studies',
        thumbnail: 'https://img.youtube.com/vi/32V0GzI7I2o/maxresdefault.jpg',
        duration: '2:30',
        featured: true
    },
    {
        id: '9zOpEKGi1fA',
        title: 'Motion Graphics Reel',
        description: 'Compilation of the best works in motion design and animation.',
        category: 'shorts',
        thumbnail: 'https://img.youtube.com/vi/9zOpEKGi1fA/maxresdefault.jpg',
        duration: '1:45',
        featured: true
    },
    {
        id: '8Jd-bwOBiXo',
        title: 'TV Commercial - Product',
        description: 'Direction and editing of TV commercial focused on conversion.',
        category: 'ads',
        thumbnail: 'https://img.youtube.com/vi/8Jd-bwOBiXo/maxresdefault.jpg',
        duration: '0:30',
        featured: false
    },
    {
        id: '_knXPHAiMuE',
        title: 'Short Documentary',
        description: 'Mini documentary on innovation and creativity in the digital market.',
        category: 'case-studies',
        thumbnail: 'https://img.youtube.com/vi/_knXPHAiMuE/maxresdefault.jpg',
        duration: '5:20',
        featured: true
    },
    {
        id: 'oAGIIzr0A3g',
        title: 'Social Media Content',
        description: 'Dynamic content created for social media with high performance.',
        category: 'shorts',
        thumbnail: 'https://img.youtube.com/vi/oAGIIzr0A3g/maxresdefault.jpg',
        duration: '0:15',
        featured: false
    }
];

// Initialize the site
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    cycleTestimonials(); // Start cycling testimonials
});

function cycleTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    let current = 0;
    
    setInterval(() => {
        testimonials.forEach(t => t.classList.remove('active'));
        testimonials[current].classList.add('active');
        current = (current + 1) % testimonials.length;
    }, 5000); // Cycle every 5 seconds
}

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
        if (desktopDevice) desktopDevice.style.display = 'none';
        if (mobileDevice) mobileDevice.style.display = 'block';
    } else {
        if (desktopDevice) desktopDevice.style.display = 'block';
        if (mobileDevice) mobileDevice.style.display = 'none';
    }
}

function setupEventListeners() {
    // Window resize handler
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Device interaction
    const deviceContainer = document.getElementById('deviceContainer');
    if (deviceContainer) {
        deviceContainer.addEventListener('click', handleDeviceClick);
    }
    
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
    if (deviceHint) {
        deviceHint.style.opacity = '0';
        deviceHint.style.transform = 'translateX(-50%) translateY(20px)';
    }
    
    // Load video content after animation
    setTimeout(() => {
        loadVideoGrid();
    }, 1000);
    
    // Show screen content
    const screenContent = document.getElementById(isMobile ? 'screenContentMobile' : 'screenContent');
    if (screenContent) {
        setTimeout(() => {
            screenContent.style.opacity = '1';
        }, 1200);
    }
}

function loadVideoGrid() {
    const container = document.querySelector(isMobile ? '.mobile-feed' : '.video-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    filteredVideos.forEach((video, index) => {
        const card = createEnhancedVideoCard(video, index, isMobile);
        container.appendChild(card);
    });
}

function handleFilterChange(e) {
    const button = e.target;
    const filter = button.dataset.filter;
    
    // Update active button
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter videos
    if (filter === 'all') {
        filteredVideos = videos;
    } else {
        filteredVideos = videos.filter(v => v.category === filter);
    }
    
    // Reload grid
    loadVideoGrid();
}

function openVideoPlayer(video) {
    currentVideoData = video;
    
    const playerOverlay = document.getElementById('videoPlayerOverlay');
    const videoFrame = document.getElementById('videoFrame');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const videoCTA = document.getElementById('videoCTA');
    
    if (!playerOverlay) return;
    
    // Update content
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
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        submitBtn.textContent = 'Message Sent!';
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
window.openDeviceAndScroll = openDeviceAndScroll;
window.scrollToContact = scrollToContact;
