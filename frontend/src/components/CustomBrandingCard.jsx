import React, { useState } from 'react';
import { Palette, Upload, Save, Eye, Download, Trash2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const CustomBrandingCard = () => {
  const [branding, setBranding] = useState({
    logo: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    fontFamily: 'Inter',
    companyName: 'Your Company',
    tagline: 'Professional Reports'
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fontOptions = [
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Montserrat', value: 'Montserrat' }
  ];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBranding(prev => ({ ...prev, logo: e.target.result }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = () => {
    // Save branding to backend
    console.log('Saving branding:', branding);
    // Show success message
    alert('Branding saved successfully!');
  };

  const handleResetBranding = () => {
    setBranding({
      logo: null,
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      accentColor: '#F59E0B',
      fontFamily: 'Inter',
      companyName: 'Your Company',
      tagline: 'Professional Reports'
    });
  };

  const PreviewReport = () => (
    <div className="bg-white border rounded-lg p-6 shadow-lg" style={{ fontFamily: branding.fontFamily }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {branding.logo ? (
            <img src={branding.logo} alt="Logo" className="w-12 h-12 object-contain" />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              Logo
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold" style={{ color: branding.primaryColor }}>
              {branding.companyName}
            </h1>
            <p className="text-sm text-gray-600">{branding.tagline}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: branding.primaryColor }}>
          Q4 Sales Performance Report
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: branding.secondaryColor + '20' }}>
            <div className="text-2xl font-bold" style={{ color: branding.secondaryColor }}>$125K</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: branding.accentColor + '20' }}>
            <div className="text-2xl font-bold" style={{ color: branding.accentColor }}>45</div>
            <div className="text-sm text-gray-600">New Customers</div>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ backgroundColor: branding.primaryColor + '20' }}>
            <div className="text-2xl font-bold" style={{ color: branding.primaryColor }}>23%</div>
            <div className="text-sm text-gray-600">Growth Rate</div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="text-xs text-gray-500">
          Powered by SmartReport Pro • {branding.companyName}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Custom Branding
        </CardTitle>
        <CardDescription>
          Customize your reports with your brand identity. Create professional, branded reports that represent your company.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input
                type="text"
                value={branding.companyName}
                onChange={(e) => setBranding(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tagline</label>
              <input
                type="text"
                value={branding.tagline}
                onChange={(e) => setBranding(prev => ({ ...prev, tagline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Professional Reports"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Company Logo</label>
            <div className="flex items-center gap-4">
              {branding.logo ? (
                <div className="relative">
                  <img src={branding.logo} alt="Logo" className="w-20 h-20 object-contain border rounded" />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                    onClick={() => setBranding(prev => ({ ...prev, logo: null }))}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => document.getElementById('logo-upload').click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload Logo'}
                </Button>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>
          
          {/* Color Scheme */}
          <div>
            <h4 className="font-semibold mb-3">Color Scheme</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-10 border rounded"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-12 h-10 border rounded"
                  />
                  <input
                    type="text"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) => setBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-12 h-10 border rounded"
                  />
                  <input
                    type="text"
                    value={branding.accentColor}
                    onChange={(e) => setBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Font Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Font Family</label>
            <select
              value={branding.fontFamily}
              onChange={(e) => setBranding(prev => ({ ...prev, fontFamily: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: branding.fontFamily }}
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preview Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Preview</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
            {showPreview && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <PreviewReport />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSaveBranding} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Branding
            </Button>
            <Button 
              variant="outline" 
              onClick={handleResetBranding}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Theme
            </Button>
          </div>

          {/* Branding Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800">💡 Branding Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use high-resolution logos (at least 200x200px)</li>
              <li>• Choose colors that match your brand guidelines</li>
              <li>• Test your branding with different report types</li>
              <li>• Keep fonts readable and professional</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomBrandingCard;
