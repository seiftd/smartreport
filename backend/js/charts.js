// Chart Management Module for SmartReport Pro
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.defaultColors = [
            '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
            '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#8b5cf6'
        ];
        this.init();
    }

    init() {
        // Initialize any default charts if needed
    }

    createChart(canvasId, type, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas with id '${canvasId}' not found`);
            return null;
        }

        // Destroy existing chart if it exists
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }

        const defaultOptions = this.getDefaultOptions(type);
        const mergedOptions = this.mergeOptions(defaultOptions, options);

        const chart = new Chart(canvas, {
            type: type,
            data: data,
            options: mergedOptions
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    getDefaultOptions(type) {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        };

        switch (type) {
            case 'line':
                return {
                    ...baseOptions,
                    elements: {
                        line: {
                            tension: 0.4
                        },
                        point: {
                            radius: 4,
                            hoverRadius: 6
                        }
                    }
                };
            case 'bar':
                return {
                    ...baseOptions,
                    elements: {
                        bar: {
                            borderRadius: 4
                        }
                    }
                };
            case 'pie':
            case 'doughnut':
                return {
                    ...baseOptions,
                    scales: {},
                    plugins: {
                        ...baseOptions.plugins,
                        legend: {
                            ...baseOptions.plugins.legend,
                            position: 'right'
                        }
                    }
                };
            default:
                return baseOptions;
        }
    }

    mergeOptions(defaultOptions, customOptions) {
        return {
            ...defaultOptions,
            ...customOptions,
            plugins: {
                ...defaultOptions.plugins,
                ...customOptions.plugins
            },
            scales: {
                ...defaultOptions.scales,
                ...customOptions.scales
            }
        };
    }

    // Predefined chart types
    createLineChart(canvasId, labels, datasets, options = {}) {
        const data = {
            labels: labels,
            datasets: datasets.map((dataset, index) => ({
                ...dataset,
                borderColor: dataset.borderColor || this.defaultColors[index % this.defaultColors.length],
                backgroundColor: dataset.backgroundColor || this.hexToRgba(this.defaultColors[index % this.defaultColors.length], 0.1),
                borderWidth: dataset.borderWidth || 3,
                fill: dataset.fill !== undefined ? dataset.fill : true,
                tension: dataset.tension || 0.4
            }))
        };

        return this.createChart(canvasId, 'line', data, options);
    }

    createBarChart(canvasId, labels, datasets, options = {}) {
        const data = {
            labels: labels,
            datasets: datasets.map((dataset, index) => ({
                ...dataset,
                backgroundColor: dataset.backgroundColor || this.defaultColors[index % this.defaultColors.length],
                borderColor: dataset.borderColor || this.defaultColors[index % this.defaultColors.length],
                borderWidth: dataset.borderWidth || 1
            }))
        };

        return this.createChart(canvasId, 'bar', data, options);
    }

    createPieChart(canvasId, labels, data, options = {}) {
        const chartData = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: this.defaultColors.slice(0, data.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        };

        return this.createChart(canvasId, 'pie', chartData, options);
    }

    createDoughnutChart(canvasId, labels, data, options = {}) {
        const chartData = {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: this.defaultColors.slice(0, data.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        };

        return this.createChart(canvasId, 'doughnut', chartData, options);
    }

    // Data processing methods
    processDataForChart(rawData, chartType, xField, yField) {
        if (!rawData || rawData.length === 0) {
            return { labels: [], datasets: [] };
        }

        switch (chartType) {
            case 'line':
            case 'bar':
                return this.processTimeSeriesData(rawData, xField, yField);
            case 'pie':
            case 'doughnut':
                return this.processCategoricalData(rawData, xField, yField);
            default:
                return { labels: [], datasets: [] };
        }
    }

    processTimeSeriesData(data, xField, yField) {
        const labels = [...new Set(data.map(item => item[xField]))].sort();
        const datasets = [{
            label: yField,
            data: labels.map(label => {
                const item = data.find(d => d[xField] === label);
                return item ? parseFloat(item[yField]) || 0 : 0;
            })
        }];

        return { labels, datasets };
    }

    processCategoricalData(data, categoryField, valueField) {
        const categoryTotals = {};
        
        data.forEach(item => {
            const category = item[categoryField];
            const value = parseFloat(item[valueField]) || 0;
            categoryTotals[category] = (categoryTotals[category] || 0) + value;
        });

        const labels = Object.keys(categoryTotals);
        const values = Object.values(categoryTotals);

        return { labels, values };
    }

    // Chart update methods
    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data = newData;
            chart.update();
        }
    }

    addDataPoint(canvasId, label, data) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data.labels.push(label);
            chart.data.datasets.forEach((dataset, index) => {
                dataset.data.push(data[index] || 0);
            });
            chart.update();
        }
    }

    removeDataPoint(canvasId, index) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data.labels.splice(index, 1);
            chart.data.datasets.forEach(dataset => {
                dataset.data.splice(index, 1);
            });
            chart.update();
        }
    }

    // Chart export methods
    exportChartAsImage(canvasId, format = 'png') {
        const chart = this.charts.get(canvasId);
        if (chart) {
            return chart.toBase64Image(format);
        }
        return null;
    }

    exportChartAsPDF(canvasId, filename = 'chart.pdf') {
        const imageData = this.exportChartAsImage(canvasId);
        if (imageData) {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            const img = new Image();
            img.onload = () => {
                const canvas = document.getElementById(canvasId);
                const aspectRatio = canvas.width / canvas.height;
                const pdfWidth = 180;
                const pdfHeight = pdfWidth / aspectRatio;
                
                pdf.addImage(imageData, 'PNG', 15, 15, pdfWidth, pdfHeight);
                pdf.save(filename);
            };
            img.src = imageData;
        }
    }

    // Utility methods
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    generateRandomData(length, min = 0, max = 100) {
        return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    }

    // Chart destruction
    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
        }
    }

    destroyAllCharts() {
        this.charts.forEach((chart, canvasId) => {
            chart.destroy();
        });
        this.charts.clear();
    }

    // Chart validation
    validateChartData(data) {
        if (!data || !data.labels || !data.datasets) {
            return false;
        }

        if (data.labels.length === 0 || data.datasets.length === 0) {
            return false;
        }

        return data.datasets.every(dataset => 
            dataset.data && dataset.data.length === data.labels.length
        );
    }

    // Responsive chart handling
    makeChartResponsive(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            const resizeObserver = new ResizeObserver(entries => {
                chart.resize();
            });
            
            const canvas = document.getElementById(canvasId);
            if (canvas) {
                resizeObserver.observe(canvas);
            }
        }
    }
}

// Initialize chart manager
const chartManager = new ChartManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartManager;
}
