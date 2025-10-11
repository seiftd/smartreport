const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const jsPDF = require('jspdf');

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

// Parse Excel file
const parseExcel = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    throw new Error('Failed to parse Excel file: ' + error.message);
  }
};

// Parse JSON file
const parseJSON = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('Failed to parse JSON file: ' + error.message);
  }
};

// Parse uploaded data file
const parseDataFile = async (filePath, fileType) => {
  try {
    let data;
    
    switch (fileType) {
      case 'text/csv':
      case 'application/csv':
        data = await parseCSV(filePath);
        break;
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        data = parseExcel(filePath);
        break;
      case 'application/json':
        data = parseJSON(filePath);
        break;
      default:
        throw new Error('Unsupported file type');
    }
    
    return data;
  } catch (error) {
    throw new Error('Failed to parse data file: ' + error.message);
  }
};

// Generate PDF report
const generatePDFReport = (data, options = {}) => {
  const {
    title = 'Data Report',
    template = 'standard',
    includeCharts = true,
    branding = {}
  } = options;

  // Create new PDF document
  const doc = new jsPDF();
  
  // Set up branding
  const primaryColor = branding.primaryColor || '#3B82F6';
  const secondaryColor = branding.secondaryColor || '#10B981';
  
  // Add header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, 20);
  
  // Add company branding if provided
  if (branding.companyName) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(branding.companyName, 20, 25);
  }
  
  // Add generation date
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 25);
  
  // Add content
  let yPosition = 50;
  
  // Summary section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Records: ${data.length}`, 20, yPosition);
  yPosition += 15;
  
  // Data table
  if (data.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Overview', 20, yPosition);
    yPosition += 10;
    
    // Get column headers
    const headers = Object.keys(data[0]);
    const maxColumns = Math.min(headers.length, 5); // Limit to 5 columns for readability
    
    // Table headers
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition - 5, 170, 8, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    for (let i = 0; i < maxColumns; i++) {
      const xPos = 22 + (i * 34);
      doc.text(headers[i].substring(0, 15), xPos, yPosition);
    }
    yPosition += 10;
    
    // Table rows (limit to 20 rows for readability)
    doc.setFont('helvetica', 'normal');
    const maxRows = Math.min(data.length, 20);
    
    for (let i = 0; i < maxRows; i++) {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      
      const row = data[i];
      for (let j = 0; j < maxColumns; j++) {
        const xPos = 22 + (j * 34);
        const value = String(row[headers[j]] || '').substring(0, 15);
        doc.text(value, xPos, yPosition);
      }
      yPosition += 6;
    }
    
    if (data.length > 20) {
      yPosition += 5;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`... and ${data.length - 20} more records`, 20, yPosition);
    }
  }
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, 20, 290);
    doc.text('SmartReport Pro', 150, 290);
  }
  
  return doc;
};

// Generate report from uploaded data
const generateReport = async (filePath, fileType, options = {}) => {
  try {
    // Parse the data file
    const data = await parseDataFile(filePath, fileType);
    
    if (!data || data.length === 0) {
      throw new Error('No data found in the uploaded file');
    }
    
    // Generate PDF
    const pdf = generatePDFReport(data, options);
    
    // Save PDF to reports directory
    const reportId = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const reportFilename = `report-${reportId}.pdf`;
    const reportPath = path.join(reportsDir, reportFilename);
    
    pdf.save(reportPath);
    
    // Return report metadata
    return {
      id: reportId,
      filename: reportFilename,
      path: reportPath,
      url: `/reports/${reportFilename}`,
      dataCount: data.length,
      generatedAt: new Date(),
      fileSize: fs.statSync(reportPath).size
    };
    
  } catch (error) {
    throw new Error('Failed to generate report: ' + error.message);
  }
};

// Get report file
const getReportFile = (filename) => {
  const reportPath = path.join(reportsDir, filename);
  
  if (!fs.existsSync(reportPath)) {
    throw new Error('Report file not found');
  }
  
  return reportPath;
};

// Clean up report file
const cleanupReport = (filename) => {
  try {
    const reportPath = path.join(reportsDir, filename);
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
      console.log('Report cleaned up:', filename);
    }
  } catch (error) {
    console.error('Error cleaning up report:', error);
  }
};

module.exports = {
  parseDataFile,
  generateReport,
  getReportFile,
  cleanupReport
};
