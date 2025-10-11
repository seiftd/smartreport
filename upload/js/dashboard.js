// Dashboard Manager for SmartReport Pro
class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.apiBaseUrl = 'https://smartreport-pro-backendone.vercel.app/api';
        this.reports = [];
        this.currentStep = 1;
        this.selectedTemplate = null;
        this.uploadedFile = null;
        this.init();
    }

    init() {
        console.log('🚀 DashboardManager init started');
        this.loadUserData();
        this.setupEventListeners();
        this.loadDashboardData();
        this.initializeCharts();
        this.initDarkMode();
        console.log('✅ DashboardManager init completed');
    }

    loadUserData() {
        const userData = localStorage.getItem('smartreport_user');
        const token = localStorage.getItem('smartreport_token');
        
        if (!userData || !token) {
            // Redirect to login if no user data
            window.location.href = 'index.html';
            return;
        }

        this.currentUser = JSON.parse(userData);
        this.updateUserInterface();
    }

    updateUserInterface() {
        if (this.currentUser) {
            // Update user info in navigation safely
            this.updateElement('user-name', this.currentUser.name || 'User');
            this.updateElement('user-email', this.currentUser.email || 'user@example.com');
            this.updateElement('user-avatar', (this.currentUser.name || 'U').charAt(0).toUpperCase());
            this.updateElement('user-greeting', this.currentUser.name || 'User');
        }
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('nav-toggle')?.addEventListener('click', this.toggleMobileMenu.bind(this));
        
        // Dark mode toggle
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDarkMode();
            });
        }
        
        // Dashboard actions
        document.getElementById('create-report-btn')?.addEventListener('click', this.showCreateReportModal.bind(this));
        document.getElementById('import-data-btn')?.addEventListener('click', this.showImportData.bind(this));
        document.getElementById('create-first-report-btn')?.addEventListener('click', this.showCreateReportModal.bind(this));
        
        // Quick actions
        document.getElementById('upload-data-btn')?.addEventListener('click', this.showImportData.bind(this));
        document.getElementById('use-template-btn')?.addEventListener('click', this.showCreateReportModal.bind(this));
        document.getElementById('create-chart-btn')?.addEventListener('click', this.showCreateReportModal.bind(this));
        document.getElementById('export-data-btn')?.addEventListener('click', this.exportData.bind(this));
        
        // Plan upgrade
        document.getElementById('upgrade-plan-btn')?.addEventListener('click', this.showUpgradeModal.bind(this));
        document.getElementById('manage-plan-btn')?.addEventListener('click', this.showUpgradeModal.bind(this));
        
        // Create report modal
        document.getElementById('create-report-close')?.addEventListener('click', this.hideCreateReportModal.bind(this));
        document.getElementById('next-step-btn')?.addEventListener('click', this.nextStep.bind(this));
        document.getElementById('prev-step-btn')?.addEventListener('click', this.prevStep.bind(this));
        document.getElementById('generate-report-btn')?.addEventListener('click', this.generateReport.bind(this));
        
        // Template selection
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', this.selectTemplate.bind(this));
        });
        
        // File upload
        document.getElementById('browse-files-btn')?.addEventListener('click', () => {
            document.getElementById('data-file-input').click();
        });
        
        document.getElementById('data-file-input')?.addEventListener('change', this.handleFileUpload.bind(this));
        
        // Upgrade modal
        document.getElementById('upgrade-close')?.addEventListener('click', this.hideUpgradeModal.bind(this));
        document.getElementById('upgrade-to-pro')?.addEventListener('click', this.upgradeToPro.bind(this));
        document.getElementById('upgrade-to-business')?.addEventListener('click', this.upgradeToBusiness.bind(this));
        
        // Close modals when clicking outside
        document.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    async loadDashboardData() {
        try {
            console.log('📊 Loading dashboard data...');
            // Load user stats
            await this.loadUserStats();
            
            // Load recent reports
            await this.loadRecentReports();
            
            // Check if upgrade banner should be shown
            this.checkUpgradeBanner();
            console.log('✅ Dashboard data loaded successfully');
            
        } catch (error) {
            console.error('❌ Failed to load dashboard data:', error);
        }
    }

    async loadUserStats() {
        try {
            const token = localStorage.getItem('smartreport_token');
            const response = await fetch(`${this.apiBaseUrl}/user/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const stats = await response.json();
                this.updateStatsDisplay(stats);
            } else {
                // Use mock data if API fails
                this.updateStatsDisplay({
                    totalReports: 0,
                    reportsThisMonth: 0,
                    timeSaved: 0,
                    currentPlan: 'free',
                    reportsUsed: 0,
                    reportsLimit: 3
                });
            }
        } catch (error) {
            console.error('Failed to load user stats:', error);
            // Use mock data
            this.updateStatsDisplay({
                totalReports: 0,
                reportsThisMonth: 0,
                timeSaved: 0,
                currentPlan: 'free',
                reportsUsed: 0,
                reportsLimit: 3
            });
        }
    }

    updateStatsDisplay(stats) {
        // Update dashboard metrics safely
        this.updateElement('total-reports', stats.totalReports || 0);
        this.updateElement('reports-this-month', stats.reportsThisMonth || 0);
        this.updateElement('time-saved', `${stats.timeSaved || 0}h`);
        this.updateElement('current-plan', stats.currentPlan || 'Free');
        
        // Update plan details
        this.updateElement('plan-name', this.getPlanName(stats.currentPlan));
        this.updateElement('plan-description', this.getPlanDescription(stats.currentPlan));
        
        // Update usage
        const usagePercent = ((stats.reportsUsed || 0) / (stats.reportsLimit || 3)) * 100;
        const usageFill = document.getElementById('usage-fill');
        if (usageFill) {
            usageFill.style.width = `${usagePercent}%`;
        }
        this.updateElement('usage-current', stats.reportsUsed || 0);
        this.updateElement('usage-limit', stats.reportsLimit || 3);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    getPlanName(plan) {
        const planNames = {
            'free': 'Free Plan',
            'pro': 'Pro Plan',
            'business': 'Business Plan'
        };
        return planNames[plan] || 'Free Plan';
    }

    getPlanDescription(plan) {
        const planDescriptions = {
            'free': '3 reports per month',
            'pro': 'Unlimited reports',
            'business': 'Everything in Pro + Team features'
        };
        return planDescriptions[plan] || '3 reports per month';
    }

    checkUpgradeBanner() {
        const userData = this.currentUser;
        if (userData && userData.plan === 'free') {
            const reportsUsed = userData.reportsUsed || 0;
            const reportsLimit = userData.reportsLimit || 3;
            
            if (reportsUsed >= reportsLimit * 0.8) { // Show when 80% used
                const upgradeBanner = document.getElementById('upgrade-banner');
                if (upgradeBanner) {
                    upgradeBanner.style.display = 'block';
                }
                this.updateElement('reports-used', reportsUsed);
                this.updateElement('reports-limit', reportsLimit);
            }
        }
    }

    async loadRecentReports() {
        try {
            const token = localStorage.getItem('smartreport_token');
            const response = await fetch(`${this.apiBaseUrl}/reports`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const reports = await response.json();
                this.reports = reports;
                this.displayRecentReports(reports);
            } else {
                this.displayRecentReports([]);
            }
        } catch (error) {
            console.error('Failed to load reports:', error);
            this.displayRecentReports([]);
        }
    }

    displayRecentReports(reports) {
        const reportsList = document.getElementById('reports-list');
        
        if (reports.length === 0) {
            reportsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <p>No reports yet. Create your first report!</p>
                    <button class="btn btn-primary" id="create-first-report-btn">Create Report</button>
                </div>
            `;
            
            // Re-attach event listener
            document.getElementById('create-first-report-btn')?.addEventListener('click', this.showCreateReportModal.bind(this));
        } else {
            reportsList.innerHTML = reports.slice(0, 5).map(report => `
                <div class="report-item">
                    <div class="report-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="report-info">
                        <h5>${report.title}</h5>
                        <p>Created ${new Date(report.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="report-actions">
                        <button class="btn btn-sm btn-outline" onclick="dashboardManager.viewReport('${report.id}')">View</button>
                        <button class="btn btn-sm btn-outline" onclick="dashboardManager.downloadReport('${report.id}')">Download</button>
                    </div>
                </div>
            `).join('');
        }
    }

    initializeCharts() {
        // Initialize usage chart
        const ctx = document.getElementById('usage-chart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Reports Generated',
                        data: [2, 3, 1, 4, 2, 5],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // Modal Management
    showCreateReportModal() {
        document.getElementById('create-report-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
        this.resetCreateReportForm();
    }

    hideCreateReportModal() {
        document.getElementById('create-report-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    showUpgradeModal() {
        document.getElementById('upgrade-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideUpgradeModal() {
        document.getElementById('upgrade-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    // Create Report Steps
    resetCreateReportForm() {
        this.currentStep = 1;
        this.selectedTemplate = null;
        this.uploadedFile = null;
        this.updateStepDisplay();
    }

    updateStepDisplay() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
            step.classList.toggle('completed', index + 1 < this.currentStep);
        });

        // Update step panels
        document.querySelectorAll('.step-panel').forEach((panel, index) => {
            panel.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Update buttons
        const prevBtn = document.getElementById('prev-step-btn');
        const nextBtn = document.getElementById('next-step-btn');
        const generateBtn = document.getElementById('generate-report-btn');

        prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        nextBtn.style.display = this.currentStep < 4 ? 'block' : 'none';
        generateBtn.style.display = this.currentStep === 4 ? 'block' : 'none';
    }

    nextStep() {
        if (this.currentStep < 4) {
            this.currentStep++;
            this.updateStepDisplay();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    selectTemplate(event) {
        const templateCard = event.currentTarget;
        const template = templateCard.dataset.template;
        
        // Remove previous selection
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select current template
        templateCard.classList.add('selected');
        this.selectedTemplate = template;
        
        // Check if template requires Pro plan
        const badge = templateCard.querySelector('.template-badge');
        if (badge && badge.textContent === 'Pro' && this.currentUser.plan === 'free') {
            this.showUpgradeModal();
            return;
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.uploadedFile = file;
            this.updateUploadArea(file);
        }
    }

    updateUploadArea(file) {
        const uploadArea = document.getElementById('upload-area');
        uploadArea.innerHTML = `
            <div class="upload-success">
                <i class="fas fa-check-circle"></i>
                <h5>File Uploaded Successfully</h5>
                <p>${file.name} (${(file.size / 1024).toFixed(1)} KB)</p>
                <button class="btn btn-outline btn-sm" onclick="dashboardManager.removeFile()">Remove</button>
            </div>
        `;
    }

    removeFile() {
        this.uploadedFile = null;
        document.getElementById('data-file-input').value = '';
        document.getElementById('upload-area').innerHTML = `
            <div class="upload-content">
                <i class="fas fa-cloud-upload-alt"></i>
                <h5>Drag & drop your file here</h5>
                <p>or <button class="btn btn-link" id="browse-files-btn">browse files</button></p>
                <p class="upload-formats">Supports: CSV, Excel, JSON</p>
            </div>
        `;
        
        // Re-attach event listener
        document.getElementById('browse-files-btn')?.addEventListener('click', () => {
            document.getElementById('data-file-input').click();
        });
    }

    async generateReport() {
        if (!this.selectedTemplate || !this.uploadedFile) {
            alert('Please select a template and upload a file.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('template', this.selectedTemplate);
            formData.append('file', this.uploadedFile);
            formData.append('title', document.getElementById('report-title').value);
            formData.append('description', document.getElementById('report-description').value);

            const token = localStorage.getItem('smartreport_token');
            const response = await fetch(`${this.apiBaseUrl}/reports/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                this.hideCreateReportModal();
                this.showSuccessMessage('Report generated successfully!');
                this.loadDashboardData(); // Refresh dashboard
            } else {
                const error = await response.json();
                alert('Failed to generate report: ' + error.message);
            }
        } catch (error) {
            console.error('Failed to generate report:', error);
            alert('Failed to generate report. Please try again.');
        }
    }

    // Plan Upgrade
    async upgradeToPro() {
        try {
            const token = localStorage.getItem('smartreport_token');
            const response = await fetch(`${this.apiBaseUrl}/subscription/upgrade`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ plan: 'pro' })
            });

            if (response.ok) {
                this.hideUpgradeModal();
                this.showSuccessMessage('Plan upgraded to Pro!');
                this.loadDashboardData();
            } else {
                const error = await response.json();
                alert('Failed to upgrade plan: ' + error.message);
            }
        } catch (error) {
            console.error('Failed to upgrade plan:', error);
            alert('Failed to upgrade plan. Please try again.');
        }
    }

    async upgradeToBusiness() {
        try {
            const token = localStorage.getItem('smartreport_token');
            const response = await fetch(`${this.apiBaseUrl}/subscription/upgrade`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ plan: 'business' })
            });

            if (response.ok) {
                this.hideUpgradeModal();
                this.showSuccessMessage('Plan upgraded to Business!');
                this.loadDashboardData();
            } else {
                const error = await response.json();
                alert('Failed to upgrade plan: ' + error.message);
            }
        } catch (error) {
            console.error('Failed to upgrade plan:', error);
            alert('Failed to upgrade plan. Please try again.');
        }
    }

    // User Menu
    showUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
            
            // Close dropdown when clicking outside
            if (!isVisible) {
                setTimeout(() => {
                    document.addEventListener('click', this.hideUserMenu.bind(this), { once: true });
                }, 100);
            }
        }
    }

    showProfile() {
        this.hideUserMenu();
        alert('Profile page coming soon!');
    }

    showSettings() {
        this.hideUserMenu();
        alert('Settings page coming soon!');
    }

    showBilling() {
        this.hideUserMenu();
        this.showUpgradeModal();
    }

    hideUserMenu() {
        document.getElementById('user-dropdown').style.display = 'none';
    }

    logout() {
        localStorage.removeItem('smartreport_user');
        localStorage.removeItem('smartreport_token');
        window.location.href = 'index.html';
    }

    // Utility Methods
    showImportData() {
        alert('Import data functionality coming soon!');
    }

    exportData() {
        alert('Export data functionality coming soon!');
    }

    viewReport(reportId) {
        alert(`View report ${reportId} - coming soon!`);
    }

    downloadReport(reportId) {
        alert(`Download report ${reportId} - coming soon!`);
    }

    showSuccessMessage(message) {
        // Create and show success toast
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        navMenu.classList.toggle('active');
    }

    handleOutsideClick(event) {
        // Close user dropdown if clicking outside
        const userMenu = document.querySelector('.user-menu');
        const dropdown = document.getElementById('user-dropdown');
        
        if (!userMenu.contains(event.target) && !dropdown.contains(event.target)) {
            this.hideUserMenu();
        }
    }

    toggleDarkMode() {
        const body = document.body;
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const icon = darkModeToggle.querySelector('i');
        
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('darkMode', 'false');
            icon.className = 'fas fa-moon';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('darkMode', 'true');
            icon.className = 'fas fa-sun';
        }
    }

    initDarkMode() {
        const darkMode = localStorage.getItem('darkMode');
        const body = document.body;
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const icon = darkModeToggle?.querySelector('i');
        
        if (darkMode === 'true') {
            body.setAttribute('data-theme', 'dark');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            body.removeAttribute('data-theme');
            if (icon) icon.className = 'fas fa-moon';
        }
    }

    switchAccount() {
        alert('Switch Account - Feature coming soon!');
    }

    toggleDarkMode() {
        const body = document.body;
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const icon = darkModeToggle.querySelector('i');
        
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('darkMode', 'false');
            icon.className = 'fas fa-moon';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('darkMode', 'true');
            icon.className = 'fas fa-sun';
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardManager = new DashboardManager();
});