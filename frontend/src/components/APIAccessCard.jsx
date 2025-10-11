import React, { useState } from 'react';
import { Code, Key, Copy, Eye, EyeOff, RefreshCw, Download, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const APIAccessCard = () => {
  const [apiKey, setApiKey] = useState('sk_live_51H8xK2...');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/reports',
      description: 'Get all reports',
      example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.smartreportpro.com/reports'
    },
    {
      method: 'POST',
      endpoint: '/api/reports',
      description: 'Create a new report',
      example: 'curl -X POST -H "Authorization: Bearer YOUR_API_KEY" -d \'{"title":"My Report"}\' https://api.smartreportpro.com/reports'
    },
    {
      method: 'GET',
      endpoint: '/api/reports/{id}',
      description: 'Get specific report',
      example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.smartreportpro.com/reports/123'
    },
    {
      method: 'PUT',
      endpoint: '/api/reports/{id}',
      description: 'Update report',
      example: 'curl -X PUT -H "Authorization: Bearer YOUR_API_KEY" -d \'{"title":"Updated Report"}\' https://api.smartreportpro.com/reports/123'
    },
    {
      method: 'DELETE',
      endpoint: '/api/reports/{id}',
      description: 'Delete report',
      example: 'curl -X DELETE -H "Authorization: Bearer YOUR_API_KEY" https://api.smartreportpro.com/reports/123'
    }
  ];

  const usageStats = {
    requestsToday: 1247,
    requestsThisMonth: 15680,
    rateLimit: 1000,
    rateLimitWindow: '1 hour',
    remainingRequests: 753
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateNewKey = () => {
    setIsGenerating(true);
    // Simulate API key generation
    setTimeout(() => {
      const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setApiKey(newKey);
      setIsGenerating(false);
    }, 2000);
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          API Access
        </CardTitle>
        <CardDescription>
          Integrate SmartReport Pro with your applications using our REST API. Build custom workflows and automate report generation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* API Key Management */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Key className="w-4 h-4" />
              API Key Management
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Your API Key</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="flex items-center gap-1"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showApiKey ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyApiKey}
                    className="flex items-center gap-1"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleGenerateNewKey}
                    disabled={isGenerating}
                    className="flex items-center gap-1"
                  >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {isGenerating ? 'Generating...' : 'Generate New'}
                  </Button>
                </div>
              </div>
              <div className="bg-white p-3 rounded border font-mono text-sm">
                {showApiKey ? apiKey : '••••••••••••••••••••••••••••••••••••••••'}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Keep your API key secure. Don't share it publicly or commit it to version control.
              </p>
            </div>
          </div>

          {/* Usage Statistics */}
          <div>
            <h4 className="font-semibold mb-3">Usage Statistics</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{usageStats.requestsToday.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Requests Today</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{usageStats.requestsThisMonth.toLocaleString()}</div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{usageStats.rateLimit.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Rate Limit</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{usageStats.remainingRequests.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Rate Limit Warning</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                You've used 75% of your hourly rate limit. Consider upgrading your plan for higher limits.
              </p>
            </div>
          </div>

          {/* API Endpoints */}
          <div>
            <h4 className="font-semibold mb-3">Available Endpoints</h4>
            <div className="space-y-3">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getMethodColor(endpoint.method)}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {endpoint.endpoint}
                    </code>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                    {endpoint.example}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Links */}
          <div>
            <h4 className="font-semibold mb-3">Documentation & Resources</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  API Documentation
                </h5>
                <p className="text-sm text-gray-600 mb-3">
                  Complete API reference with examples and best practices.
                </p>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Docs
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  SDK & Libraries
                </h5>
                <p className="text-sm text-gray-600 mb-3">
                  Download SDKs for popular programming languages.
                </p>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download SDK
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800">🚀 Quick Start Guide</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. Include your API key in the Authorization header</p>
              <p>2. Make requests to our REST endpoints</p>
              <p>3. Handle responses and errors appropriately</p>
              <p>4. Monitor your usage to stay within rate limits</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIAccessCard;
