import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Edit, Trash2, Calendar, Tag, User, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const ViewReportModal = ({ isOpen, onClose, reportId, onEdit, onDelete }) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && reportId) {
      fetchReport();
    }
  }, [isOpen, reportId]);

  const fetchReport = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://smartreport-pro-backendone.vercel.app/api/reports/${reportId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://smartreport-pro-backendone.vercel.app/api/reports/${reportId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title || 'report'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl font-semibold">Report Details</CardTitle>
                <CardDescription>
                  View and manage your report
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              ) : report ? (
                <div className="space-y-6">
                  {/* Report Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{report.title}</h2>
                      {report.description && (
                        <p className="text-gray-600 mb-4">{report.description}</p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Created by {report.createdBy || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        {report.status && (
                          <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                            {report.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </Button>
                      <Button
                        onClick={() => onEdit(report.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        onClick={() => onDelete(report.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>

                  {/* Tags */}
                  {report.tags && report.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {report.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
                            <span>{tag}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Report Content Preview */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Content Preview</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      {report.content ? (
                        <div className="prose max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: report.content }} />
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No content preview available</p>
                          <p className="text-sm">Download the report to view full content</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Report Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Report Information</h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">ID:</dt>
                          <dd className="font-mono text-gray-900">{report.id}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Type:</dt>
                          <dd className="text-gray-900">{report.type || 'Standard'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Format:</dt>
                          <dd className="text-gray-900">{report.format || 'PDF'}</dd>
                        </div>
                        {report.fileSize && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Size:</dt>
                            <dd className="text-gray-900">{report.fileSize}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Timeline</h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Created:</dt>
                          <dd className="text-gray-900">{new Date(report.createdAt).toLocaleString()}</dd>
                        </div>
                        {report.updatedAt && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Updated:</dt>
                            <dd className="text-gray-900">{new Date(report.updatedAt).toLocaleString()}</dd>
                          </div>
                        )}
                        {report.dueDate && (
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Due Date:</dt>
                            <dd className="text-gray-900">{new Date(report.dueDate).toLocaleDateString()}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No report data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewReportModal;
