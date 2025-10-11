// SmartReport Pro - Main Application JavaScript
class SmartReportApp {
    constructor() {
        this.currentUser = null;
        this.reports = [];
        this.templates = [];
        this.charts = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.initializeCharts();
        this.setupFileUpload();
    }

    setupEventListeners() {
        // Navigation
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Modal controls
        this.setupModalControls();
        
        // Auth buttons
        this.setupAuthButtons();
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const href = anchor.getAttribute('href');
                // Skip if href is just "#"
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && navMenu.classList.contains('active')) {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                }
            }
        });
    }

    setupModalControls() {
        // Login modal
        const loginBtn = document.getElementById('login-btn');
        const loginModal = document.getElementById('login-modal');
        const loginClose = document.getElementById('login-close');
        const switchToSignup = document.getElementById('switch-to-signup');

        if (loginBtn && loginModal) {
            loginBtn.addEventListener('click', () => {
                this.showModal('login-modal');
            });
        }

        if (loginClose) {
            loginClose.addEventListener('click', () => {
                this.hideModal('login-modal');
            });
        }

        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('login-modal');
                this.showModal('signup-modal');
            });
        }

        // Signup modal
        const signupBtn = document.getElementById('signup-btn');
        const signupModal = document.getElementById('signup-modal');
        const signupClose = document.getElementById('signup-close');
        const switchToLogin = document.getElementById('switch-to-login');

        if (signupBtn && signupModal) {
            signupBtn.addEventListener('click', () => {
                this.showModal('signup-modal');
            });
        }

        if (signupClose) {
            signupClose.addEventListener('click', () => {
                this.hideModal('signup-modal');
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('signup-modal');
                this.showModal('login-modal');
            });
        }

        // Hero CTA buttons
        const heroSignup = document.getElementById('hero-signup');
        const ctaSignup = document.getElementById('cta-signup');
        const demoBtn = document.getElementById('demo-btn');

        if (heroSignup) {
            heroSignup.addEventListener('click', () => {
                this.showModal('signup-modal');
            });
        }

        if (ctaSignup) {
            ctaSignup.addEventListener('click', () => {
                this.showModal('signup-modal');
            });
        }

        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                this.showDemo();
            });
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.hideModal(activeModal.id);
                }
            }
        });
    }

    setupAuthButtons() {
        // These will be handled by auth.js
        console.log('Auth buttons setup delegated to auth.js');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    showDemo() {
        this.showToast('Demo coming soon! Check out our features below.', 'info');
    }

    loadUserData() {
        // Load user data from localStorage
        const userData = localStorage.getItem('smartreport_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUIForLoggedInUser();
        }

        // Load reports data
        const reportsData = localStorage.getItem('smartreport_reports');
        if (reportsData) {
            this.reports = JSON.parse(reportsData);
        }
    }

    updateUIForLoggedInUser() {
        if (this.currentUser) {
            // Update navigation to show dashboard link
            const navAuth = document.querySelector('.nav-auth');
            if (navAuth) {
                navAuth.innerHTML = `
                    <a href="dashboard.html" class="nav-link">Dashboard</a>
                    <div class="user-menu">
                        <div class="user-avatar">${this.currentUser.name.charAt(0).toUpperCase()}</div>
                        <div class="user-info">
                            <div class="user-name">${this.currentUser.name}</div>
                            <div class="user-email">${this.currentUser.email}</div>
                        </div>
                    </div>
                `;
            }
        }
    }

    initializeCharts() {
        // Charts will be initialized in dashboard
        console.log('Charts initialized');
    }

    setupFileUpload() {
        // FilePond will be initialized in the dashboard
        console.log('File upload setup delegated to dashboard');
    }

    showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-header">
                <div class="toast-title">${this.getToastTitle(type)}</div>
                <button class="toast-close">&times;</button>
            </div>
            <div class="toast-message">${message}</div>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);

        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    getToastTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };
        return titles[type] || 'Notification';
    }

    // Utility methods
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smartReportApp = new SmartReportApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartReportApp;
}
