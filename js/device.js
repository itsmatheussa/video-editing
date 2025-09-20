// Device Animation and Interaction Controller

class DeviceController {
    constructor() {
        this.isAnimating = false;
        this.deviceState = 'closed'; // closed, opening, open
        this.animationQueue = [];
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }
    
    init() {
        this.setupDeviceElements();
        this.setupEventListeners();
        this.setupAnimationObservers();
    }
    
    setupDeviceElements() {
        this.deviceContainer = document.getElementById('deviceContainer');
        this.desktopDevice = document.getElementById('desktopDevice');
        this.mobileDevice = document.getElementById('mobileDevice');
        this.laptopScreen = document.getElementById('laptopScreen');
        this.phoneScreen = document.getElementById('phoneScreen');
        this.screenContent = document.getElementById('screenContent');
        this.deviceHint = document.getElementById('deviceHint');
        
        // Initial state setup
        this.updateDeviceVisibility();
    }
    
    setupEventListeners() {
        // Device click handler
        if (this.deviceContainer) {
            this.deviceContainer.addEventListener('click', (e) => {
                if (this.deviceState === 'closed') {
                    this.openDevice();
                }
            });
        }
        
        // Resize handler
        window.addEventListener('resize', this.debounce(() => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                this.updateDeviceVisibility();
                if (this.deviceState === 'open') {
                    this.refreshContent();
                }
            }
        }, 250));
        
        // Mouse move for subtle interactions
        if (this.deviceContainer) {
            this.deviceContainer.addEventListener('mousemove', (e) => {
                this.handleMouseMove(e);
            });
            
            this.deviceContainer.addEventListener('mouseleave', () => {
                this.resetDeviceTransform();
            });
        }
    }
    
    setupAnimationObservers() {
        // Intersection observer for device entrance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.deviceState === 'closed') {
                    this.animateDeviceEntrance();
                }
            });
        }, {
            threshold: 0.3
        });
        
        if (this.deviceContainer) {
            observer.observe(this.deviceContainer);
        }
    }
    
    updateDeviceVisibility() {
        if (this.isMobile) {
            if (this.desktopDevice) this.desktopDevice.style.display = 'none';
            if (this.mobileDevice) this.mobileDevice.style.display = 'block';
        } else {
            if (this.desktopDevice) this.desktopDevice.style.display = 'block';
            if (this.mobileDevice) this.mobileDevice.style.display = 'none';
        }
    }
    
    animateDeviceEntrance() {
        const device = this.getCurrentDevice();
        if (!device) return;
        
        // Add entrance animation
        device.style.opacity = '0';
        device.style.transform = 'translateY(50px) scale(0.9)';
        
        // Animate in
        setTimeout(() => {
            device.style.transition = 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
            device.style.opacity = '1';
            device.style.transform = 'translateY(0) scale(1)';
        }, 200);
        
        // Show hint after device is visible
        setTimeout(() => {
            this.showDeviceHint();
        }, 1500);
    }
    
    showDeviceHint() {
        if (this.deviceHint && this.deviceState === 'closed') {
            this.deviceHint.style.opacity = '1';
            this.deviceHint.style.transform = 'translateX(-50%) translateY(0)';
        }
    }
    
    openDevice() {
        if (this.isAnimating || this.deviceState !== 'closed') return;
        
        this.isAnimating = true;
        this.deviceState = 'opening';
        
        const device = this.getCurrentDevice();
        if (!device) return;
        
        // Hide hint immediately
        this.hideDeviceHint();
        
        // Start opening animation
        if (this.isMobile) {
            this.openMobileDevice();
        } else {
            this.openDesktopDevice();
        }
    }
    
    openDesktopDevice() {
        const device = this.desktopDevice;
        const laptopScreenFrame = device.querySelector('.laptop-screen-frame');
        
        // Add opening class for CSS animations
        device.classList.add('opening');
        
        // Laptop opening sequence
        if (laptopScreenFrame) {
            // Screen opening animation
            laptopScreenFrame.style.transformOrigin = 'bottom center';
            laptopScreenFrame.style.transition = 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
            
            setTimeout(() => {
                laptopScreenFrame.style.transform = 'rotateX(-15deg)';
            }, 100);
        }
        
        // Screen boot sequence
        setTimeout(() => {
            this.bootScreen();
        }, 800);
        
        // Complete opening
        setTimeout(() => {
            this.completeOpening();
        }, 2500);
    }
    
    openMobileDevice() {
        const device = this.mobileDevice;
        
        // Add opening class
        device.classList.add('mobile-opening');
        
        // Phone slide and expand animation
        const phoneFrame = device.querySelector('.phone-frame');
        if (phoneFrame) {
            phoneFrame.style.transition = 'all 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
            phoneFrame.style.transform = 'translateY(0) scale(1)';
            phoneFrame.style.opacity = '1';
        }
        
        // Screen activation
        setTimeout(() => {
            this.bootScreen();
        }, 600);
        
        // Complete opening
        setTimeout(() => {
            this.completeOpening();
        }, 2000);
    }
    
    bootScreen() {
        const screenContent = this.screenContent;
        if (!screenContent) return;
        
        // Screen boot animation
        screenContent.style.opacity = '0';
        screenContent.style.filter = 'brightness(0)';
        screenContent.style.transition = 'all 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
        
        // Simulate screen turning on
        setTimeout(() => {
            screenContent.style.opacity = '0.3';
            screenContent.style.filter = 'brightness(0.2)';
        }, 200);
        
        setTimeout(() => {
            screenContent.style.opacity = '0.7';
            screenContent.style.filter = 'brightness(0.6)';
        }, 500);
        
        setTimeout(() => {
            screenContent.style.opacity = '1';
            screenContent.style.filter = 'brightness(1)';
        }, 800);
        
        // Load content after screen is on
        setTimeout(() => {
            if (typeof window.loadVideoGrid === 'function') {
                window.loadVideoGrid();
            }
        }, 1000);
    }
    
    completeOpening() {
        this.isAnimating = false;
        this.deviceState = 'open';
        
        // Add glow effect
        const device = this.getCurrentDevice();
        if (device) {
            device.classList.add('device-open');
        }
        
        // Trigger content loading if not already done
        if (typeof window.loadVideoGrid === 'function') {
            window.loadVideoGrid();
        }
    }
    
    hideDeviceHint() {
        if (this.deviceHint) {
            this.deviceHint.style.transition = 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
            this.deviceHint.style.opacity = '0';
            this.deviceHint.style.transform = 'translateX(-50%) translateY(20px)';
        }
    }
    
    handleMouseMove(e) {
        if (this.isAnimating || this.deviceState === 'open') return;
        
        const device = this.getCurrentDevice();
        if (!device) return;
        
        const rect = this.deviceContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Subtle tilt effect
        const tiltX = (mouseY / rect.height) * -10;
        const tiltY = (mouseX / rect.width) * 10;
        
        device.style.transition = 'transform 0.3s ease-out';
        device.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
        
        // Add subtle glow based on mouse position
        const glowIntensity = Math.min(Math.abs(mouseX) + Math.abs(mouseY), 100) / 100;
        device.style.filter = `drop-shadow(0 0 ${20 * glowIntensity}px rgba(0, 194, 255, ${0.3 * glowIntensity}))`;
    }
    
    resetDeviceTransform() {
        if (this.isAnimating || this.deviceState === 'open') return;
        
        const device = this.getCurrentDevice();
        if (!device) return;
        
        device.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.6s ease-out';
        device.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        device.style.filter = 'none';
    }
    
    getCurrentDevice() {
        return this.isMobile ? this.mobileDevice : this.desktopDevice;
    }
    
    refreshContent() {
        if (this.deviceState === 'open' && typeof window.loadVideoGrid === 'function') {
            setTimeout(() => {
                window.loadVideoGrid();
            }, 300);
        }
    }
    
    // Utility method
    debounce(func, wait) {
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
    
    // Public methods
    closeDevice() {
        if (this.deviceState !== 'open') return;
        
        this.deviceState = 'closed';
        const device = this.getCurrentDevice();
        
        if (device) {
            device.classList.remove('opening', 'mobile-opening', 'device-open');
            
            // Reset transforms
            if (this.isMobile) {
                const phoneFrame = device.querySelector('.phone-frame');
                if (phoneFrame) {
                    phoneFrame.style.transform = 'translateY(-100px) scale(0.8)';
                    phoneFrame.style.opacity = '0';
                }
            } else {
                const laptopScreenFrame = device.querySelector('.laptop-screen-frame');
                if (laptopScreenFrame) {
                    laptopScreenFrame.style.transform = 'rotateX(0deg)';
                }
            }
            
            // Hide screen content
            if (this.screenContent) {
                this.screenContent.style.opacity = '0';
            }
            
            // Show hint again
            setTimeout(() => {
                this.showDeviceHint();
            }, 1000);
        }
    }
    
    getDeviceState() {
        return this.deviceState;
    }
}

// Initialize device controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.deviceController = new DeviceController();
});

// Export for global access
window.DeviceController = DeviceController;