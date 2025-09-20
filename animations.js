// Advanced Animations and Effects Controller

class AnimationController {
    constructor() {
        this.observers = [];
        this.animations = new Map();
        this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupHoverEnhancements();
        this.setupLoadingAnimations();
        this.setupCounterAnimations();
    }
    
    setupScrollAnimations() {
        // Enhanced intersection observer for scroll animations
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                } else if (entry.target.classList.contains('repeat-animation')) {
                    this.resetElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Elements to animate on scroll
        const animatedElements = document.querySelectorAll(`
            .case-card, 
            .service-card, 
            .testimonial, 
            .skill-item,
            .contact-form,
            .about-image,
            .hero-text > *
        `);
        
        animatedElements.forEach((element, index) => {
            element.classList.add('animate-in');
            element.style.animationDelay = `${index * 0.1}s`;
            scrollObserver.observe(element);
        });
        
        this.observers.push(scrollObserver);
    }
    
    setupParallaxEffects() {
        if (this.isReduced) return;
        
        const parallaxElements = document.querySelectorAll('.particles, .hero-background');
        
        const handleScroll = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.2);
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        // Throttled scroll handler
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    setupHoverEnhancements() {
        // Enhanced hover effects for interactive elements
        this.setupCardHovers();
        this.setupButtonHovers();
        this.setupVideoCardHovers();
    }
    
    setupCardHovers() {
        const cards = document.querySelectorAll('.case-card, .service-card');
        
        cards.forEach(card => {
            const handleMouseEnter = (e) => {
                if (this.isReduced) return;
                
                card.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
                card.style.transform = 'translateY(-12px) scale(1.02)';
                
                // Add subtle glow effect
                card.style.boxShadow = `
                    0 35px 60px -12px rgba(0, 0, 0, 0.9),
                    0 0 30px rgba(0, 194, 255, 0.15)
                `;
            };
            
            const handleMouseLeave = (e) => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            };
            
            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    }
    
    setupButtonHovers() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-case');
        
        buttons.forEach(button => {
            const handleMouseEnter = () => {
                if (this.isReduced) return;
                
                // Ripple effect
                this.createRippleEffect(button);
            };
            
            button.addEventListener('mouseenter', handleMouseEnter);
            button.addEventListener('click', (e) => {
                this.createClickRipple(button, e);
            });
        });
    }
    
    setupVideoCardHovers() {
        // Dynamic hover effects for video cards
        document.addEventListener('mouseover', (e) => {
            const videoCard = e.target.closest('.video-card, .mobile-video-card');
            if (!videoCard || this.isReduced) return;
            
            // Enhanced hover animation
            videoCard.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
            
            // Tilt effect based on mouse position
            const rect = videoCard.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const handleMouseMove = (e) => {
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;
                
                const tiltX = (mouseY / rect.height) * -5;
                const tiltY = (mouseX / rect.width) * 5;
                
                videoCard.style.transform = `
                    perspective(1000px) 
                    rotateX(${tiltX}deg) 
                    rotateY(${tiltY}deg) 
                    translateY(-8px) 
                    scale(1.02)
                `;
            };
            
            const handleMouseLeave = () => {
                videoCard.style.transform = 'translateY(0) scale(1)';
                videoCard.removeEventListener('mousemove', handleMouseMove);
                videoCard.removeEventListener('mouseleave', handleMouseLeave);
            };
            
            videoCard.addEventListener('mousemove', handleMouseMove);
            videoCard.addEventListener('mouseleave', handleMouseLeave);
        });
    }
    
    setupLoadingAnimations() {
        // Staggered loading animations for video grid
        const loadVideoGrid = (container, videos) => {
            if (!container || !videos.length) return;
            
            // Clear existing content
            container.innerHTML = '';
            
            // Create and append cards with staggered animation
            videos.forEach((video, index) => {
                const card = createEnhancedVideoCard(video, index, container.classList.contains('mobile-feed'));
                
                // Initial state
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px) scale(0.9)';
                
                container.appendChild(card);
                
                // Animate in with delay
                setTimeout(() => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
            });
        };
        
        // Override global function
        window.loadVideoGrid = () => {
            const videoGrid = document.getElementById('videoGrid');
            const mobileFeed = document.getElementById('mobileFeed');
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile && mobileFeed) {
                loadVideoGrid(mobileFeed, window.filteredVideos || window.videoData || []);
            } else if (videoGrid) {
                loadVideoGrid(videoGrid, window.filteredVideos || window.videoData || []);
            }
        };
    }
    
    setupCounterAnimations() {
        // Animated counters for metrics
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.metric-value').forEach(counter => {
            counterObserver.observe(counter);
        });
        
        this.observers.push(counterObserver);
    }
    
    animateElement(element) {
        if (this.isReduced) {
            element.classList.add('visible');
            return;
        }
        
        element.classList.add('visible');
        
        // Special animations for specific elements
        if (element.classList.contains('skill-item')) {
            this.animateSkillBar(element);
        }
        
        if (element.classList.contains('hero-text')) {
            this.animateHeroText(element);
        }
    }
    
    resetElement(element) {
        if (this.isReduced) return;
        
        element.classList.remove('visible');
        
        // Reset skill bars
        if (element.classList.contains('skill-item')) {
            const progressBar = element.querySelector('.skill-progress');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        }
    }
    
    animateSkillBar(skillItem) {
        const progressBar = skillItem.querySelector('.skill-progress');
        if (!progressBar) return;
        
        const targetWidth = progressBar.style.width || '0%';
        progressBar.style.width = '0%';
        
        setTimeout(() => {
            progressBar.style.transition = 'width 2s cubic-bezier(0.22, 1, 0.36, 1)';
            progressBar.style.width = targetWidth;
        }, 200);
    }
    
    animateHeroText(heroText) {
        const children = heroText.children;
        
        Array.from(children).forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                child.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    animateCounter(counter) {
        const text = counter.textContent;
        const hasNumber = /\d/.test(text);
        
        if (!hasNumber) return;
        
        const number = parseFloat(text.replace(/[^\d.]/g, ''));
        const suffix = text.replace(/[\d.]/g, '');
        
        if (isNaN(number)) return;
        
        let current = 0;
        const increment = number / 60; // 60 frames for 1 second at 60fps
        
        const animate = () => {
            current += increment;
            if (current < number) {
                counter.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(animate);
            } else {
                counter.textContent = text; // Restore original text
            }
        };
        
        animate();
    }
    
    createRippleEffect(button) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        ripple.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            border-radius: inherit;
        `;
        
        // Add keyframe if not exists
        if (!document.querySelector('#ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes ripple {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    createClickRipple(button, event) {
        if (this.isReduced) return;
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: clickRipple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add keyframe if not exists
        if (!document.querySelector('#click-ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'click-ripple-keyframes';
            style.textContent = `
                @keyframes clickRipple {
                    to { transform: scale(2); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Page transition effects
    createPageTransition(callback) {
        if (this.isReduced) {
            callback();
            return;
        }
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--primary-bg);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            callback();
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }, 300);
    }
    
    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.animations.clear();
    }
}

// Scroll-triggered text reveal animation
class TextRevealAnimation {
    constructor(element) {
        this.element = element;
        this.text = element.textContent;
        this.setupReveal();
    }
    
    setupReveal() {
        const words = this.text.split(' ');
        this.element.innerHTML = '';
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                transition-delay: ${index * 0.1}s;
            `;
            
            this.element.appendChild(span);
            if (index < words.length - 1) {
                this.element.appendChild(document.createTextNode(' '));
            }
        });
    }
    
    reveal() {
        const spans = this.element.querySelectorAll('span');
        spans.forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        });
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
    
    // Setup text reveal animations
    document.querySelectorAll('.hero-title, .section-title').forEach(element => {
        const textReveal = new TextRevealAnimation(element);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    textReveal.reveal();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(element);
    });
});

// Export for global access
window.AnimationController = AnimationController;
window.TextRevealAnimation = TextRevealAnimation;
