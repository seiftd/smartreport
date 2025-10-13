// Simple API endpoint for Vercel
export default function handler(req, res) {
  res.status(200).json({
    message: 'SmartReport Pro API is running!',
    status: 'success',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
