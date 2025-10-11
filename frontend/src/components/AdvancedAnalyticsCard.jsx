import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Filter, Eye, Users, FileText, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const AdvancedAnalyticsCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  
  const analyticsData = {
    '7d': { 
      reports: 12, 
      downloads: 45, 
      users: 8, 
      views: 156,
      growth: { reports: 15, downloads: 8, users: 12, views: 22 }
    },
    '30d': { 
      reports: 48, 
      downloads: 180, 
      users: 15, 
      views: 520,
      growth: { reports: 25, downloads: 18, users: 20, views: 35 }
    },
    '90d': { 
      reports: 156, 
      downloads: 520, 
      users: 23, 
      views: 1450,
      growth: { reports: 35, downloads: 28, users: 30, views: 45 }
    }
  };

  const currentData = analyticsData[selectedPeriod];

  const topReports = [
    { name: 'Q4 Sales Performance Report', downloads: 45, views: 89, rating: 4.8 },
    { name: 'Marketing Campaign Analysis', downloads: 32, views: 67, rating: 4.6 },
    { name: 'Financial Summary Dashboard', downloads: 28, views: 54, rating: 4.9 },
    { name: 'Customer Analytics Report', downloads: 24, views: 43, rating: 4.7 },
    { name: 'Operations Efficiency Report', downloads: 19, views: 38, rating: 4.5 }
  ];

  const teamActivity = [
    { user: 'John Doe', action: 'Created new report', time: '2 hours ago', type: 'create' },
    { user: 'Jane Smith', action: 'Downloaded Q4 Sales Report', time: '4 hours ago', type: 'download' },
    { user: 'Bob Johnson', action: 'Shared Marketing Analysis', time: '1 day ago', type: 'share' },
    { user: 'Alice Brown', action: 'Updated Financial Dashboard', time: '2 days ago', type: 'update' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create': return <FileText className="w-4 h-4 text-green-500" />;
      case 'download': return <Download className="w-4 h-4 text-blue-500" />;
      case 'share': return <Users className="w-4 h-4 text-purple-500" />;
      case 'update': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getGrowthIcon = (growth) => {
    return growth > 0 ? <ArrowUp className="w-4 h-4 text-green-500" /> : <ArrowDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Advanced Analytics
        </CardTitle>
        <CardDescription>
          Detailed insights and performance metrics for your reports and team activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Period Selection */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {['7d', '30d', '90d'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{currentData.reports}</div>
              <div className="text-sm text-gray-600">Reports Generated</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {getGrowthIcon(currentData.growth.reports)}
                <span className="text-xs text-green-600">+{currentData.growth.reports}%</span>
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{currentData.downloads}</div>
              <div className="text-sm text-gray-600">Downloads</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {getGrowthIcon(currentData.growth.downloads)}
                <span className="text-xs text-green-600">+{currentData.growth.downloads}%</span>
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{currentData.users}</div>
              <div className="text-sm text-gray-600">Active Users</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {getGrowthIcon(currentData.growth.users)}
                <span className="text-xs text-green-600">+{currentData.growth.users}%</span>
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{currentData.views}</div>
              <div className="text-sm text-gray-600">Total Views</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {getGrowthIcon(currentData.growth.views)}
                <span className="text-xs text-green-600">+{currentData.growth.views}%</span>
              </div>
            </div>
          </div>

          {/* Top Performing Reports */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Top Performing Reports
            </h4>
            <div className="space-y-2">
              {topReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-gray-500">
                        {report.downloads} downloads • {report.views} views
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {report.rating}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Activity Feed */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recent Team Activity
            </h4>
            <div className="space-y-3">
              {teamActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.user}</div>
                    <div className="text-sm text-gray-600">{activity.action}</div>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Performance Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-green-600">✓ Peak Usage Time</div>
                <div className="text-gray-600">Most reports are generated between 9-11 AM</div>
              </div>
              <div>
                <div className="font-medium text-blue-600">📈 Growth Trend</div>
                <div className="text-gray-600">Report generation increased by 35% this month</div>
              </div>
              <div>
                <div className="font-medium text-purple-600">👥 Team Engagement</div>
                <div className="text-gray-600">All team members are actively using the platform</div>
              </div>
              <div>
                <div className="font-medium text-orange-600">⚡ Optimization</div>
                <div className="text-gray-600">Consider upgrading to Pro plan for faster processing</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalyticsCard;
