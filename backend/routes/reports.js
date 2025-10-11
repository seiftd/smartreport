const express = require('express');
const router = express.Router();

// Mock reports data for now
let reports = [
  {
    id: 1,
    title: 'Q4 Sales Report',
    description: 'Quarterly sales performance analysis',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'John Doe',
    downloads: 15,
    templateId: 'sales-template-1',
    data: [
      { name: 'John Doe', sales: 15000, region: 'North' },
      { name: 'Jane Smith', sales: 22000, region: 'South' },
      { name: 'Bob Johnson', sales: 18000, region: 'East' }
    ],
    visualizations: ['bar', 'pie'],
    customization: {
      layout: 'standard',
      colors: { primary: '#3B82F6', secondary: '#8B5CF6' }
    }
  },
  {
    id: 2,
    title: 'Marketing Analytics',
    description: 'Marketing campaign performance metrics',
    status: 'processing',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'Jane Smith',
    downloads: 8,
    templateId: 'marketing-template-1',
    data: [
      { campaign: 'Summer Sale', clicks: 1250, conversions: 45 },
      { campaign: 'Black Friday', clicks: 2100, conversions: 78 }
    ],
    visualizations: ['line', 'trend'],
    customization: {
      layout: 'modern',
      colors: { primary: '#10B981', secondary: '#F59E0B' }
    }
  }
];

// GET /api/reports - Get all reports for user
router.get('/', (req, res) => {
  try {
    const userId = req.user?.id || 'user123';
    // In a real app, filter by user ID
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// GET /api/reports/:id - Get specific report
router.get('/:id', (req, res) => {
  try {
    const reportId = parseInt(req.params.id);
    const report = reports.find(r => r.id === reportId);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// POST /api/reports - Create new report
router.post('/', (req, res) => {
  try {
    const { title, description, templateId, tags, dueDate, data, visualizations, customization } = req.body;
    const userId = req.user?.id || 'user123';
    
    const newReport = {
      id: reports.length + 1,
      title,
      description: description || '',
      status: 'completed',
      createdAt: new Date().toISOString(),
      author: 'Current User', // In real app, get from user data
      downloads: 0,
      templateId,
      tags: tags || [],
      dueDate,
      data: data || [],
      visualizations: visualizations || [],
      customization: customization || {}
    };
    
    reports.push(newReport);
    
    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report: newReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// POST /api/reports/generate - Generate report with processing
router.post('/generate', async (req, res) => {
  try {
    const { title, description, templateId, tags, dueDate, data, visualizations, customization } = req.body;
    const userId = req.user?.id || 'user123';
    
    // Simulate report generation processing
    console.log('Generating report:', title);
    console.log('Data points:', data?.length || 0);
    console.log('Visualizations:', visualizations);
    
    // Create the report
    const newReport = {
      id: reports.length + 1,
      title,
      description: description || '',
      status: 'completed',
      createdAt: new Date().toISOString(),
      author: 'Current User',
      downloads: 0,
      templateId,
      tags: tags || [],
      dueDate,
      data: data || [],
      visualizations: visualizations || [],
      customization: customization || {},
      generatedAt: new Date().toISOString(),
      fileUrl: `/api/reports/${reports.length + 1}/download`,
      summary: {
        totalDataPoints: data?.length || 0,
        visualizationsCount: visualizations?.length || 0,
        processingTime: '2.3s'
      }
    };
    
    reports.push(newReport);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.status(201).json({
      success: true,
      message: 'Report generated successfully',
      report: newReport,
      downloadUrl: newReport.fileUrl
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// PUT /api/reports/:id - Update report
router.put('/:id', (req, res) => {
  try {
    const reportId = parseInt(req.params.id);
    const { title, description, data, visualizations, customization } = req.body;
    
    const reportIndex = reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    // Update report
    reports[reportIndex] = {
      ...reports[reportIndex],
      title: title || reports[reportIndex].title,
      description: description || reports[reportIndex].description,
      data: data || reports[reportIndex].data,
      visualizations: visualizations || reports[reportIndex].visualizations,
      customization: customization || reports[reportIndex].customization,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Report updated successfully',
      report: reports[reportIndex]
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// DELETE /api/reports/:id - Delete report
router.delete('/:id', (req, res) => {
  try {
    const reportId = parseInt(req.params.id);
    const reportIndex = reports.findIndex(r => r.id === reportId);
    
    if (reportIndex === -1) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    reports.splice(reportIndex, 1);
    
    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// GET /api/reports/:id/download - Download report file
router.get('/:id/download', (req, res) => {
  try {
    const reportId = parseInt(req.params.id);
    const report = reports.find(r => r.id === reportId);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    // In a real app, you would generate and return the actual PDF/Excel file
    // For now, return a mock response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.title}.pdf"`);
    
    // Mock PDF content (in real app, generate actual PDF)
    const mockPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(${report.title}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF`;
    
    res.send(mockPdfContent);
  } catch (error) {
    console.error('Error downloading report:', error);
    res.status(500).json({ error: 'Failed to download report' });
  }
});

module.exports = router;
