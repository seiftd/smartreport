const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json',
    'text/plain'
  ];
  
  const allowedExtensions = ['.csv', '.xlsx', '.xls', '.json', '.txt'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV, Excel, and JSON files are allowed.'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware for single file upload
const uploadSingle = upload.single('file');

// Middleware for multiple file uploads
const uploadMultiple = upload.array('files', 5);

// Parse uploaded file and return metadata
const parseFileMetadata = (file) => {
  const stats = fs.statSync(file.path);
  
  return {
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    size: stats.size,
    mimetype: file.mimetype,
    uploadedAt: new Date()
  };
};

// Clean up uploaded file
const cleanupFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('File cleaned up:', filePath);
    }
  } catch (error) {
    console.error('Error cleaning up file:', error);
  }
};

// Get file URL for frontend
const getFileUrl = (filename) => {
  return `/uploads/${filename}`;
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  parseFileMetadata,
  cleanupFile,
  getFileUrl
};
