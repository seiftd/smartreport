// Dashboard Module for SmartReport Pro
class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.reports = [];
        this.templates = [];
        this.uploadedData = null;
        this.apiBaseUrl = 'https://smartreport-pro-backend.vercel.app/api';
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadReports();
        this.loadTemplates();
        this.updateDashboard();
        this.setupFileUpload();
    }

    loadUserData() {
        const userData = localStorage.getItem('smartreport_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUserInfo();
        } else {
            // Redirect to login if no user data
            window.location.href = 'index.html';
        }
    }

    updateUserInfo() {
        if (this.currentUser) {
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            const userEmail = document.getElementById('user-email');

            if (userAvatar) userAvatar.textContent = this.currentUser.name.charAt(0).toUpperCase();
            if (userName) userName.textContent = this.currentUser.name;
            if (userEmail) userEmail.textContent = this.currentUser.email;
        }
    }

    setupEventListeners() {
        // Modal controls
        this.setupModalControls();
        
        // Action buttons
        this.setupActionButtons();
        
        // Chart type buttons
        this.setupChartTypeButtons();
    }

    setupModalControls() {
        // Import modal
        const importBtn = document.getElementById('import-data-btn');
        const importModal = document.getElementById('import-modal');
        const importClose = document.getElementById('import-close');

        if (importBtn) {
            importBtn.addEventListener('click', () => this.showImportModal());
        }

        if (importClose) {
            importClose.addEventListener('click', () => this.hideModal('import-modal'));
        }

        // Template modal
        const templateBtn = document.getElementById('create-report-btn');
        const templateModal = document.getElementById('template-modal');
        const templateClose = document.getElementById('template-close');

        if (templateBtn) {
            templateBtn.addEventListener('click', () => this.showTemplateModal());
        }

        if (templateClose) {
            templateClose.addEventListener('click', () => this.hideModal('template-modal'));
        }

        // Builder modal
        const builderModal = document.getElementById('builder-modal');
        const builderClose = document.getElementById('builder-close');

        if (builderClose) {
            builderClose.addEventListener('click', () => this.hideModal('builder-modal'));
        }

        // Export modal
        const exportModal = document.getElementById('export-modal');
        const exportClose = document.getElementById('export-close');

        if (exportClose) {
            exportClose.addEventListener('click', () => this.hideModal('export-modal'));
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });
    }

    setupActionButtons() {
        // Quick action cards
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('onclick');
                if (action) {
                    eval(action);
                }
            });
        });
    }

    setupChartTypeButtons() {
        const chartTypeBtns = document.querySelectorAll('.chart-type-btn');
        chartTypeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chartType = e.currentTarget.dataset.type;
                this.addVisualization(chartType);
            });
        });
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');

        if (uploadArea && fileInput) {
            // Click to upload
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    async handleFileUpload(files) {
        if (files.length === 0) return;

        const file = files[0];
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!allowedTypes.includes(file.type)) {
            this.showToast('Please upload a CSV or Excel file', 'error');
            return;
        }

        this.showUploadProgress();

        try {
            const data = await this.parseFile(file);
            this.uploadedData = data;
            this.hideUploadProgress();
            this.showToast('File uploaded successfully!', 'success');
            this.hideModal('import-modal');
            this.showBuilderModal();
        } catch (error) {
            this.hideUploadProgress();
            this.showToast('Error parsing file. Please try again.', 'error');
        }
    }

    async parseFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    if (file.type === 'text/csv') {
                        const csvData = this.parseCSV(e.target.result);
                        resolve(csvData);
                    } else {
                        const workbook = XLSX.read(e.target.result, { type: 'binary' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        resolve(jsonData);
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            
            if (file.type === 'text/csv') {
                reader.readAsText(file);
            } else {
                reader.readAsBinaryString(file);
            }
        });
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim());
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                data.push(row);
            }
        }

        return data;
    }

    showUploadProgress() {
        const progress = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progress) {
            progress.style.display = 'block';
        }

        // Simulate progress
        let width = 0;
        const interval = setInterval(() => {
            width += 10;
            if (progressFill) progressFill.style.width = width + '%';
            if (progressText) progressText.textContent = `Uploading... ${width}%`;
            
            if (width >= 100) {
                clearInterval(interval);
            }
        }, 100);
    }

    hideUploadProgress() {
        const progress = document.getElementById('upload-progress');
        if (progress) {
            progress.style.display = 'none';
        }
    }

    loadReports() {
        const reportsData = localStorage.getItem('smartreport_reports');
        if (reportsData) {
            this.reports = JSON.parse(reportsData);
        } else {
            // Create sample reports for demo
            this.reports = this.createSampleReports();
            this.saveReports();
        }
    }

    createSampleReports() {
        return [
            {
                id: '1',
                title: 'Monthly Sales Report',
                type: 'Business',
                status: 'completed',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '2',
                title: 'Q4 Marketing Analysis',
                type: 'Marketing',
                status: 'processing',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '3',
                title: 'Financial Summary',
                type: 'Financial',
                status: 'draft',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
    }

    loadTemplates() {
        this.templates = [
            {
                id: '1',
                name: 'Business Report',
                description: 'Professional business analysis template',
                category: 'Business',
                preview: 'business-preview.png'
            },
            {
                id: '2',
                name: 'Marketing Report',
                description: 'Marketing performance and analytics',
                category: 'Marketing',
                preview: 'marketing-preview.png'
            },
            {
                id: '3',
                name: 'Financial Report',
                description: 'Financial data visualization',
                category: 'Financial',
                preview: 'financial-preview.png'
            },
            {
                id: '4',
                name: 'Sales Report',
                description: 'Sales performance tracking',
                category: 'Sales',
                preview: 'sales-preview.png'
            },
            {
                id: '5',
                name: 'Analytics Report',
                description: 'Data analytics and insights',
                category: 'Analytics',
                preview: 'analytics-preview.png'
            }
        ];
    }

    updateDashboard() {
        this.updateMetrics();
        this.renderReports();
        this.renderTemplates();
    }

    updateMetrics() {
        const totalReports = this.reports.length;
        const reportsThisMonth = this.reports.filter(r => {
            const reportDate = new Date(r.createdAt);
            const now = new Date();
            return reportDate.getMonth() === now.getMonth() && 
                   reportDate.getFullYear() === now.getFullYear();
        }).length;

        const storageUsed = totalReports * 2.5; // Simulate storage usage
        const planStatus = this.currentUser?.plan || 'Free';

        document.getElementById('total-reports').textContent = totalReports;
        document.getElementById('reports-this-month').textContent = reportsThisMonth;
        document.getElementById('storage-used').textContent = storageUsed.toFixed(1) + ' MB';
        document.getElementById('plan-status').textContent = planStatus;
    }

    renderReports() {
        const reportsGrid = document.getElementById('reports-grid');
        if (!reportsGrid) return;

        if (this.reports.length === 0) {
            reportsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h3 class="empty-title">No Reports Yet</h3>
                    <p class="empty-description">
                        Create your first report to get started with SmartReport Pro.
                    </p>
                    <button class="btn btn-primary" onclick="showTemplateModal()">
                        Create Report
                    </button>
                </div>
            `;
            return;
        }

        reportsGrid.innerHTML = this.reports.map(report => `
            <div class="report-card" onclick="dashboardManager.openReport('${report.id}')">
                <div class="report-card-header">
                    <div>
                        <h3 class="report-title">${report.title}</h3>
                        <span class="report-type">${report.type}</span>
                    </div>
                    <div class="report-actions">
                        <button class="action-btn" onclick="event.stopPropagation(); dashboardManager.editReport('${report.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn" onclick="event.stopPropagation(); dashboardManager.deleteReport('${report.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="report-preview">
                    <i class="fas fa-chart-bar"></i>
                </div>
                <div class="report-meta">
                    <div class="report-date">
                        <i class="fas fa-calendar"></i>
                        ${this.formatDate(report.updatedAt)}
                    </div>
                    <div class="report-status">
                        <span class="status-badge status-${report.status}">
                            ${report.status}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderTemplates() {
        const templateGrid = document.getElementById('template-grid');
        if (!templateGrid) return;

        templateGrid.innerHTML = this.templates.map(template => `
            <div class="template-card" onclick="dashboardManager.selectTemplate('${template.id}')">
                <div class="template-preview">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="template-name">${template.name}</div>
                <div class="template-description">${template.description}</div>
            </div>
        `).join('');
    }

    // Modal methods
    showImportModal() {
        this.showModal('import-modal');
    }

    showTemplateModal() {
        this.showModal('template-modal');
    }

    showBuilderModal() {
        this.showModal('builder-modal');
    }

    showExportModal() {
        this.showModal('export-modal');
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

    // Report actions
    openReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (report) {
            this.showToast(`Opening ${report.title}...`, 'info');
            // In a real app, this would navigate to the report viewer
        }
    }

    editReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (report) {
            this.showToast(`Editing ${report.title}...`, 'info');
            this.showBuilderModal();
        }
    }

    deleteReport(reportId) {
        if (confirm('Are you sure you want to delete this report?')) {
            this.reports = this.reports.filter(r => r.id !== reportId);
            this.saveReports();
            this.updateDashboard();
            this.showToast('Report deleted successfully', 'success');
        }
    }

    selectTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (template) {
            this.showToast(`Selected ${template.name} template`, 'success');
            this.hideModal('template-modal');
            this.showBuilderModal();
        }
    }

    addVisualization(chartType) {
        if (!this.uploadedData) {
            this.showToast('Please upload data first', 'warning');
            return;
        }

        this.showToast(`Adding ${chartType} visualization...`, 'info');
        // In a real app, this would add the visualization to the report builder
    }

    // Export methods
    exportToPDF() {
        this.showToast('Exporting to PDF...', 'info');
        this.hideModal('export-modal');
        // In a real app, this would generate and download the PDF
    }

    exportToExcel() {
        this.showToast('Exporting to Excel...', 'info');
        this.hideModal('export-modal');
        // In a real app, this would generate and download the Excel file
    }

    shareReport() {
        this.showToast('Generating shareable link...', 'info');
        this.hideModal('export-modal');
        // In a real app, this would generate a shareable link
    }

    // Utility methods
    saveReports() {
        localStorage.setItem('smartreport_reports', JSON.stringify(this.reports));
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showToast(message, type = 'info') {
        if (window.smartReportApp) {
            window.smartReportApp.showToast(message, type);
        }
    }
}

// Global functions for onclick handlers
function showImportModal() {
    if (window.dashboardManager) {
        window.dashboardManager.showImportModal();
    }
}

function showTemplateModal() {
    if (window.dashboardManager) {
        window.dashboardManager.showTemplateModal();
    }
}

function showBuilderModal() {
    if (window.dashboardManager) {
        window.dashboardManager.showBuilderModal();
    }
}

function showExportModal() {
    if (window.dashboardManager) {
        window.dashboardManager.showExportModal();
    }
}

function exportToPDF() {
    if (window.dashboardManager) {
        window.dashboardManager.exportToPDF();
    }
}

function exportToExcel() {
    if (window.dashboardManager) {
        window.dashboardManager.exportToExcel();
    }
}

function shareReport() {
    if (window.dashboardManager) {
        window.dashboardManager.shareReport();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
}
