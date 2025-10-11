// Authentication Module for SmartReport Pro
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.apiBaseUrl = 'https://smartreport-pro-backend.vercel.app/api';
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupAuthForms();
        this.checkAuthStatus();
    }

    loadUserData() {
        const userData = localStorage.getItem('smartreport_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    setupAuthForms() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        this.showLoading('Logging in...');

        try {
            // Use Firebase authentication
            const result = await window.firebaseAuth.signInWithGoogle();
            const { user, idToken } = result;

            // Send to backend for verification and user creation
            const response = await fetch(`${this.apiBaseUrl}/auth/firebase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idToken })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            this.currentUser = data.user;
            localStorage.setItem('smartreport_user', JSON.stringify(data.user));
            localStorage.setItem('smartreport_token', data.token);
            
            this.hideLoading();
            this.showSuccess('Login successful! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            this.hideLoading();
            this.showError('Login failed: ' + error.message);
        }
    }

    async handleSignup() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const company = document.getElementById('signup-company').value;

        if (!name || !email || !password) {
            this.showError('Please fill in all required fields');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long');
            return;
        }

        this.showLoading('Creating account...');

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            const user = {
                id: this.generateId(),
                name: name,
                email: email,
                company: company,
                plan: 'free',
                reportsUsed: 0,
                reportsLimit: 3,
                createdAt: new Date().toISOString()
            };

            this.currentUser = user;
            localStorage.setItem('smartreport_user', JSON.stringify(user));
            
            this.hideLoading();
            this.showSuccess('Account created successfully! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            this.hideLoading();
            this.showError('Signup failed. Please try again.');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('smartreport_user');
        localStorage.removeItem('smartreport_reports');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }

    checkAuthStatus() {
        if (this.currentUser) {
            this.updateUIForLoggedInUser();
        }
    }

    updateUIForLoggedInUser() {
        // Update navigation
        const navAuth = document.querySelector('.nav-auth');
        if (navAuth && this.currentUser) {
            navAuth.innerHTML = `
                <a href="dashboard.html" class="nav-link">Dashboard</a>
                <div class="user-menu" onclick="authManager.showUserMenu()">
                    <div class="user-avatar">${this.currentUser.name.charAt(0).toUpperCase()}</div>
                    <div class="user-info">
                        <div class="user-name">${this.currentUser.name}</div>
                        <div class="user-email">${this.currentUser.email}</div>
                    </div>
                </div>
            `;
        }
    }

    showUserMenu() {
        // Create dropdown menu
        const existingMenu = document.querySelector('.user-dropdown');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-item" onclick="authManager.showProfile()">
                <i class="fas fa-user"></i> Profile
            </div>
            <div class="dropdown-item" onclick="authManager.showSettings()">
                <i class="fas fa-cog"></i> Settings
            </div>
            <div class="dropdown-item" onclick="authManager.logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </div>
        `;

        document.body.appendChild(dropdown);

        // Position dropdown
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            const rect = userMenu.getBoundingClientRect();
            dropdown.style.position = 'fixed';
            dropdown.style.top = (rect.bottom + 5) + 'px';
            dropdown.style.right = '20px';
            dropdown.style.zIndex = '1000';
        }

        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && !userMenu.contains(e.target)) {
                    dropdown.remove();
                }
            });
        }, 100);
    }

    showProfile() {
        this.showToast('Profile page coming soon!', 'info');
        document.querySelector('.user-dropdown')?.remove();
    }

    showSettings() {
        this.showToast('Settings page coming soon!', 'info');
        document.querySelector('.user-dropdown')?.remove();
    }

    // Utility methods
    async simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showLoading(message) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    }

    hideLoading() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    showSuccess(message) {
        if (window.smartReportApp) {
            window.smartReportApp.showToast(message, 'success');
        }
    }

    showError(message) {
        if (window.smartReportApp) {
            window.smartReportApp.showToast(message, 'error');
        }
    }

    showToast(message, type) {
        if (window.smartReportApp) {
            window.smartReportApp.showToast(message, type);
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
