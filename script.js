/* =================================
   MODERN PORTFOLIO JAVASCRIPT
   Interactive features and animations
   ================================= */

// Splash Screen Management Class
// Handles the loading screen animation and visibility
class SplashScreen {
    constructor() {
        this.splashElement = document.getElementById('splash-screen');
        this.isVisible = true;
        this.init();
    }

    // Initialize splash screen functionality
    init() {
        // Hide splash screen after page loads completely
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 3000);
        });

        // Show splash screen when user returns to tab
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !this.isVisible) {
                this.show();
                setTimeout(() => this.hide(), 1500);
            }
        });
    }

    // Show splash screen with fade in effect
    show() {
        this.splashElement.classList.remove('fade-out');
        this.isVisible = true;
    }

    // Hide splash screen with fade out effect
    hide() {
        this.splashElement.classList.add('fade-out');
        this.isVisible = false;
    }
}

// Mouse Smoke Effect Class
// Creates trailing particle effects that follow mouse movement
class SmokeEffect {
    constructor() {
        this.container = document.getElementById('smoke-container');
        this.particles = []; // Array to store active particles
        this.maxParticles = 80; // Maximum number of particles on screen
        this.mousePos = { x: 0, y: 0 }; // Current mouse position
        this.lastMousePos = { x: 0, y: 0 }; // Previous mouse position
        this.init();
    }

    // Initialize mouse tracking and particle creation
    init() {
        // Track mouse movement and create particles based on speed
        document.addEventListener('mousemove', (e) => {
            this.lastMousePos = { ...this.mousePos };
            this.mousePos = { x: e.clientX, y: e.clientY };
            
            // Calculate mouse movement distance
            const distance = Math.sqrt(
                Math.pow(this.mousePos.x - this.lastMousePos.x, 2) + 
                Math.pow(this.mousePos.y - this.lastMousePos.y, 2)
            );
            
            // Create particles only when mouse is moving fast enough
            if (distance > 5) {
                this.createParticle(e.clientX, e.clientY);
            }
        });

        // Clean up old particles periodically for performance
        setInterval(() => this.cleanup(), 100);
    }

    // Create a new smoke particle at specified coordinates
    createParticle(x, y) {
        // Remove oldest particle if we've reached the limit
        if (this.particles.length >= this.maxParticles) {
            this.removeOldestParticle();
        }

        // Create new particle element
        const particle = document.createElement('div');
        particle.className = 'smoke-particle';
        
        // Add more random offset for realistic smoke spread
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        
        // Position particle with offset
        particle.style.left = (x + offsetX) + 'px';
        particle.style.top = (y + offsetY) + 'px';
        
        // Smaller, more varied particle sizes
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.opacity = Math.random() * 0.9 + 0.1;

        // Much faster animation - 1.5s instead of 3-5s
        const duration = Math.random() * 800 + 1000; // 1-1.8 seconds
        particle.style.animationDuration = duration + 'ms';

        // Add particle to DOM and tracking array
        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            timestamp: Date.now()
        });

        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.particles = this.particles.filter(p => p.element !== particle);
            }
        }, duration);
    }

    // Remove the oldest particle to maintain performance
    removeOldestParticle() {
        if (this.particles.length > 0) {
            const oldest = this.particles.shift();
            if (oldest.element.parentNode) {
                oldest.element.parentNode.removeChild(oldest.element);
            }
        }
    }

    // Clean up expired particles
    cleanup() {
        const now = Date.now();
        this.particles = this.particles.filter(particle => {
            // Remove particles after 2 seconds instead of 5
            if (now - particle.timestamp > 2000) {
                if (particle.element.parentNode) {
                    particle.element.parentNode.removeChild(particle.element);
                }
                return false;
            }
            return true;
        });
    }
}

// Navigation and Smooth Scrolling
class Navigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.underline = document.querySelector('.nav-underline');
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Enhanced Intersection Observer for active section detection
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
                    this.updateActiveLink(entry.target.id);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.9)';
                this.navbar.style.backdropFilter = 'blur(20px)';
            } else {
                this.navbar.style.background = 'rgba(255, 255, 255, 0.1)';
                this.navbar.style.backdropFilter = 'blur(10px)';
            }
        });

        // Initialize underline position
        this.updateUnderline();
    }

    updateActiveLink(sectionId) {
        // Remove active class from all links
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current link
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            this.updateUnderline();
        }
    }

    updateUnderline() {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink && this.underline) {
            const linkRect = activeLink.getBoundingClientRect();
            const navRect = activeLink.closest('.nav-menu').getBoundingClientRect();
            
            this.underline.style.left = (linkRect.left - navRect.left) + 'px';
            this.underline.style.width = linkRect.width + 'px';
            this.underline.classList.add('active');
        }
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.glass-card, .project-card, .contact-item, .skill-item');
        this.parallaxElements = document.querySelectorAll('.floating-element, .shape, .orb');
        this.init();
    }

    init() {
        // Intersection Observer for reveal animations
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.classList.add('revealed');
                    }, index * 100);
                }
            });
        }, observerOptions);

        // Set initial state and observe elements
        this.animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px) scale(0.9)';
            element.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(element);
        });

        // Parallax scroll effects
        window.addEventListener('scroll', () => {
            this.handleParallaxScroll();
            this.handleScrollToTop();
        });

        // Ensure all sections maintain proper styling
        const maintainStyling = () => {
            const sections = document.querySelectorAll('.section');
            const glassCards = document.querySelectorAll('.glass-card');
            const gradientTexts = document.querySelectorAll('.gradient-text, .hero-title, .section-title');
            
            sections.forEach(section => {
                section.style.opacity = '1';
                section.style.transform = 'scale(1)';
            });
            
            glassCards.forEach(card => {
                card.style.opacity = '1';
            });
            
            gradientTexts.forEach(text => {
                text.style.opacity = '1';
            });
        };

        // Run immediately and on scroll
        maintainStyling();
        window.addEventListener('scroll', maintainStyling);
    }

    handleParallaxScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        this.parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.2;
            const yPos = rate * speed;
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        // DELETE THIS ENTIRE SECTION - around line 300+
        /*
        // Scale and fade effects for sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const progress = Math.max(0, Math.min(1, 
                    (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
                ));
                
                const scale = 0.8 + (progress * 0.2);
                const opacity = Math.max(0.3, progress);
                
                section.style.transform = `scale(${scale})`;
                section.style.opacity = opacity;
            }
        });
        */
    }

    handleScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
}

// Form Handling
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.inputs = document.querySelectorAll('.form-input');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            // Real-time validation
            this.inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearErrors(input));
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'subject':
                if (value.length < 5) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 5 characters long';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearErrors(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearErrors(field);
        
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            animation: fadeInUp 0.3s ease-out;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearErrors(field) {
        field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        field.style.boxShadow = 'none';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    handleSubmit() {
        let isFormValid = true;
        
        // Validate all fields
        this.inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showMessage('Please fix the errors above.', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Simulate form submission with loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.className = `form-message ${type}`;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.4s ease-out;
            backdrop-filter: blur(10px);
            ${type === 'success' 
                ? 'background: linear-gradient(135deg, #10b981, #059669); border: 1px solid rgba(16, 185, 129, 0.3);' 
                : 'background: linear-gradient(135deg, #ef4444, #dc2626); border: 1px solid rgba(239, 68, 68, 0.3);'
            }
        `;

        document.body.appendChild(messageEl);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.4s ease-out';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 400);
        }, 5000);
    }
}

// Project Tech Stack Accordion
class ProjectAccordion {
    constructor() {
        this.techButtons = document.querySelectorAll('.tech-stack-btn');
        this.techDetails = document.querySelectorAll('.tech-details');
        this.init();
    }

    init() {
        // Set first project as open by default
        if (this.techDetails.length > 0) {
            this.techDetails[0].classList.add('active');
        }

        this.techButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.toggleAccordion(index);
            });
        });
    }

    toggleAccordion(index) {
        const targetDetail = this.techDetails[index];
        const isActive = targetDetail.classList.contains('active');

        // Close all accordions
        this.techDetails.forEach(detail => {
            detail.classList.remove('active');
        });

        // Open clicked accordion if it wasn't active
        if (!isActive) {
            targetDetail.classList.add('active');
        }

        // Update button states
        this.techButtons.forEach((btn, i) => {
            if (i === index && !isActive) {
                btn.style.background = 'var(--gradient-secondary)';
            } else {
                btn.style.background = 'var(--gradient-tertiary)';
            }
        });
    }
}

// CV Download Functionality
class CVDownload {
    constructor() {
        this.downloadButtons = document.querySelectorAll('.download-cv, .btn-secondary');
        this.init();
    }

    init() {
        this.downloadButtons.forEach(button => {
            if (button.textContent.includes('Download CV') || button.textContent.includes('CV')) {
                button.addEventListener('click', () => this.downloadCV());
            }
        });
    }

    downloadCV() {
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = './assets/pdf/Akshay Resume AI.pdf'; // Path to your CV PDF
        link.download = 'Akshay Resume AI.pdf';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success message
        this.showDownloadMessage();
    }

    showDownloadMessage() {
        const messageEl = document.createElement('div');
        messageEl.textContent = 'CV download started! Check your downloads folder.';
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            border: 1px solid rgba(139, 92, 246, 0.3);
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.4s ease-out;
            backdrop-filter: blur(10px);
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.4s ease-out';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 400);
        }, 3000);
    }
}

// Scroll to Top Functionality
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollToTop');
        this.init();
    }

    init() {
        if (this.button) {
            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Optimize scroll events with throttling
        this.optimizeScrollEvents();
        
        // Preload critical resources
        this.preloadResources();

        // Monitor performance
        this.monitorPerformance();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[src*="placeholder"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Image is already loaded via placeholder service
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            img.onload = () => {
                img.style.opacity = '1';
            };
            imageObserver.observe(img);
        });
    }

    optimizeScrollEvents() {
        let ticking = false;
        let lastScrollY = 0;

        const updateScrollEffects = () => {
            const scrollY = window.scrollY;
            const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
            
            // Update scroll-based effects here
            document.body.setAttribute('data-scroll-direction', scrollDirection);
            lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }, { passive: true });
    }

    preloadResources() {
        // Preload critical fonts and resources
        const preloadLinks = [
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
            { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com' }
        ];

        preloadLinks.forEach(link => {
            const linkEl = document.createElement('link');
            Object.assign(linkEl, link);
            document.head.appendChild(linkEl);
        });
    }

    monitorPerformance() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with actual web vitals library
            console.log('Performance monitoring initialized');
        }

        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                const memoryInfo = performance.memory;
                if (memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9) {
                    console.warn('High memory usage detected');
                }
            }, 30000);
        }
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SplashScreen();
    new SmokeEffect();
    new Navigation();
    new ScrollAnimations();
    new ProjectAccordion();
    new ContactForm();
    new CVDownload();
    new ScrollToTop();
    new PerformanceOptimizer();

    // Add additional CSS animations for messages
    const messageStyles = document.createElement('style');
    messageStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        @keyframes fadeInUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(messageStyles);

    // Add smooth reveal animation for page load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle page visibility changes for enhanced UX
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.classList.add('paused');
    } else {
        // Resume animations when tab becomes visible
        document.body.classList.remove('paused');
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key to close any open modals or accordions
    if (e.key === 'Escape') {
        const activeAccordions = document.querySelectorAll('.tech-details.active');
        activeAccordions.forEach(accordion => {
            accordion.classList.remove('active');
        });
    }
    
    // Arrow keys for navigation
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const sections = document.querySelectorAll('.section');
        const currentSection = Array.from(sections).find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });
        
        if (currentSection) {
            const currentIndex = Array.from(sections).indexOf(currentSection);
            let targetIndex;
            
            if (e.key === 'ArrowUp' && currentIndex > 0) {
                targetIndex = currentIndex - 1;
            } else if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                targetIndex = currentIndex + 1;
            }
            
            if (targetIndex !== undefined) {
                sections[targetIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }
});
