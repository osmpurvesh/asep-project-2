// Enhanced JavaScript with modern features and animations
class TripnicApp {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.matches = [];
        this.conversations = {};
        this.itineraries = [];
        this.currentChatUser = null;
        
        this.init();
    }

    init() {
        this.initializeLoadingScreen();
        this.initializeParticles();
        this.initializeAnimations();
        this.initializeNavigation();
        this.initializeAuth();
        this.initializeSampleData();
        this.bindEvents();
        
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
        
        // Initialize Swiper for testimonials
        this.initializeSwiper();
    }

    initializeLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            }, 2000);
        });
    }

    initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: '#ffffff' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5, random: false },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#ffffff',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 6,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    }
                },
                retina_detect: true
            });
        }
    }

    initializeAnimations() {
        // GSAP animations for enhanced interactions
        if (typeof gsap !== 'undefined') {
            // Navbar scroll effect
            gsap.registerPlugin(ScrollTrigger);
            
            ScrollTrigger.create({
                start: 'top -80',
                end: 99999,
                toggleClass: { className: 'scrolled', targets: '.navbar' }
            });

            // Feature cards stagger animation
            gsap.fromTo('.feature-card', 
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: '.features-grid',
                        start: 'top 80%'
                    }
                }
            );

            // Floating cards animation
            gsap.to('.travel-card', {
                y: -20,
                duration: 2,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: -1,
                stagger: 0.5
            });
        }
    }

    initializeNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu toggle animation
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.addEventListener('click', () => {
                navbarToggler.classList.toggle('active');
            });
        }
    }

    initializeSwiper() {
        if (typeof Swiper !== 'undefined') {
            new Swiper('.testimonials-swiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                }
            });
        }
    }

    initializeAuth() {
        // Enhanced form validation and submission
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Real-time form validation
        this.setupFormValidation();
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Please enter a valid email address';
                }
                break;
            case 'password':
                if (value.length < 6) {
                    isValid = false;
                    message = 'Password must be at least 6 characters';
                }
                break;
            default:
                if (field.required && !value) {
                    isValid = false;
                    message = 'This field is required';
                }
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        const feedback = field.parentNode.querySelector('.invalid-feedback') || 
                        this.createFeedbackElement(field.parentNode);
        
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            feedback.style.display = 'none';
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            feedback.textContent = message;
            feedback.style.display = 'block';
        }
    }

    createFeedbackElement(parent) {
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.style.fontSize = '0.875rem';
        feedback.style.color = '#dc3545';
        feedback.style.marginTop = '0.25rem';
        parent.appendChild(feedback);
        return feedback;
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.style.display = 'none';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Validate form
        const emailValid = this.validateField(document.getElementById('loginEmail'));
        const passwordValid = this.validateField(document.getElementById('loginPassword'));
        
        if (!emailValid || !passwordValid) {
            return;
        }

        const btn = e.target.querySelector('button[type="submit"]');
        this.setButtonLoading(btn, true);

        try {
            // Simulate API call
            await this.delay(1500);
            
            // For demo purposes - in real app, this would be server-side authentication
            const user = this.users.find(u => u.email === email);
            
            if (user) {
                this.currentUser = user;
                this.showNotification('Welcome back! Login successful.', 'success');
                this.hideAuthModal();
                this.updateNavigation();
                
                // Redirect to preferences if first time
                if (!user.hasCompletedPreferences) {
                    setTimeout(() => {
                        window.location.href = 'preference.html';
                    }, 1000);
                }
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            this.showNotification('Invalid email or password. Please try again.', 'error');
        } finally {
            this.setButtonLoading(btn, false);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('signupFirstName').value;
        const lastName = document.getElementById('signupLastName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const termsAccepted = document.getElementById('termsCheck').checked;

        // Validate all fields
        const fields = [
            document.getElementById('signupFirstName'),
            document.getElementById('signupLastName'),
            document.getElementById('signupEmail'),
            document.getElementById('signupPassword'),
            document.getElementById('signupConfirmPassword')
        ];

        const allValid = fields.every(field => this.validateField(field));

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match!', 'error');
            return;
        }

        if (!termsAccepted) {
            this.showNotification('Please accept the Terms of Service and Privacy Policy', 'error');
            return;
        }

        if (!allValid) {
            return;
        }

        const btn = e.target.querySelector('button[type="submit"]');
        this.setButtonLoading(btn, true);

        try {
            // Simulate API call
            await this.delay(2000);
            
            // Check if email already exists
            if (this.users.some(u => u.email === email)) {
                throw new Error('Email already registered');
            }

            // Create new user
            const newUser = {
                id: 'user_' + Date.now(),
                name: `${firstName} ${lastName}`,
                email: email,
                firstName: firstName,
                lastName: lastName,
                interests: [],
                budget: 'moderate',
                travelStyle: 'explorer',
                age: null,
                location: null,
                avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=667eea&color=fff`,
                hasCompletedPreferences: false,
                createdAt: new Date().toISOString()
            };

            this.users.push(newUser);
            this.currentUser = newUser;
            
            this.showNotification('Account created successfully! Welcome to Tripnic.', 'success');
            this.hideAuthModal();
            this.updateNavigation();
            
            // Redirect to preferences
            setTimeout(() => {
                window.location.href = 'preference.html';
            }, 1500);
            
        } catch (error) {
            this.showNotification(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            this.setButtonLoading(btn, false);
        }
    }

    setButtonLoading(btn, loading) {
        const text = btn.querySelector('.login-text, .signup-text');
        const spinner = btn.querySelector('.loading');
        
        if (loading) {
            if (text) text.classList.add('hidden');
            if (spinner) spinner.classList.remove('hidden');
            btn.disabled = true;
        } else {
            if (text) text.classList.remove('hidden');
            if (spinner) spinner.classList.add('hidden');
            btn.disabled = false;
        }
    }

    showAuthModal(type) {
        const modal = new bootstrap.Modal(document.getElementById('authModal'));
        const title = document.getElementById('authModalTitle');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (type === 'login') {
            title.textContent = 'Welcome Back';
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            title.textContent = 'Join Tripnic';
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
        
        modal.show();
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal._element.querySelector('input:not([type="hidden"])');
            if (firstInput) firstInput.focus();
        }, 300);
    }

    hideAuthModal() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
        if (modal) modal.hide();
    }

    updateNavigation() {
        const loginNav = document.getElementById('loginNav');
        const signupNav = document.getElementById('signupNav');
        const userNav = document.getElementById('userNav');
        
        if (this.currentUser) {
            loginNav?.classList.add('hidden');
            signupNav?.classList.add('hidden');
            userNav?.classList.remove('hidden');
            
            const userName = document.getElementById('userName');
            if (userName) {
                userName.textContent = this.currentUser.firstName || this.currentUser.name;
            }
        } else {
            loginNav?.classList.remove('hidden');
            signupNav?.classList.remove('hidden');
            userNav?.classList.add('hidden');
        }
    }

    logout() {
        this.currentUser = null;
        this.showNotification('You have been logged out successfully.', 'success');
        this.updateNavigation();
        
        // Redirect to home if on dashboard
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = 'index.html';
        }
    }

    showDashboard() {
        if (!this.currentUser) {
            this.showAuthModal('login');
            return;
        }
        
        window.location.href = 'dashboard.html';
    }

    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer') || 
                         this.createNotificationContainer();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas ${icon} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
        
        // Add slide out animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideOut {
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        if (!document.head.querySelector('style[data-notifications]')) {
            style.setAttribute('data-notifications', 'true');
            document.head.appendChild(style);
        }
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    initializeSampleData() {
        this.users = [
            {
                id: 'user1',
                name: 'Sarah Johnson',
                email: 'sarah@example.com',
                firstName: 'Sarah',
                lastName: 'Johnson',
                age: 28,
                interests: ['beach', 'adventure', 'culture'],
                budget: 'moderate',
                travelStyle: 'explorer',
                location: 'Mumbai',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d5f1?w=150&h=150&fit=crop&crop=face',
                hasCompletedPreferences: true
            },
            {
                id: 'user2',
                name: 'Mike Chen',
                email: 'mike@example.com',
                firstName: 'Mike',
                lastName: 'Chen',
                age: 32,
                interests: ['mountains', 'adventure', 'wildlife'],
                budget: 'moderate',
                travelStyle: 'backpacker',
                location: 'Delhi',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                hasCompletedPreferences: true
            },
            {
                id: 'user3',
                name: 'Emma Davis',
                email: 'emma@example.com',
                firstName: 'Emma',
                lastName: 'Davis',
                age: 26,
                interests: ['city', 'culture', 'beach'],
                budget: 'luxury',
                travelStyle: 'luxury',
                location: 'Bangalore',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                hasCompletedPreferences: true
            }
        ];
    }

    bindEvents() {
        // Global event listeners
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal.show');
                if (modal) {
                    bootstrap.Modal.getInstance(modal)?.hide();
                }
            }
        });

        // Form enhancements
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="email"]')) {
                this.validateEmailRealtime(e.target);
            }
        });
    }

    handleScroll() {
        const scrolled = window.scrollY > 100;
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled);
        }
    }

    validateEmailRealtime(input) {
        const email = input.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (email.length > 0) {
            input.classList.toggle('is-valid', isValid);
            input.classList.toggle('is-invalid', !isValid);
        } else {
            input.classList.remove('is-valid', 'is-invalid');
        }
    }

    // Utility functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// Global functions for backward compatibility
let tripnicApp;

function showAuthModal(type) {
    tripnicApp.showAuthModal(type);
}

function logout() {
    tripnicApp.logout();
}

function showDashboard() {
    tripnicApp.showDashboard();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    tripnicApp = new TripnicApp();
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});