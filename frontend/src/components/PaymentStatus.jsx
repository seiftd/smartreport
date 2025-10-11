import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const PaymentStatus = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaymentRequests();
  }, []);

  const fetchPaymentRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://smartreport-pro-backendone.vercel.app/api/payment-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPaymentRequests(result.paymentRequests);
      } else {
        throw new Error(result.message || 'Failed to fetch payment requests');
      }
    } catch (error) {
      console.error('Error fetching payment requests:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'binance':
        return '💳';
      case 'usdt':
        return '₮';
      case 'visa':
        return '💳';
      default:
        return '💳';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Loading payment requests...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paymentRequests.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Payment Requests</CardTitle>
          <CardDescription>Your payment request history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Requests</h3>
            <p className="text-gray-600">You haven't submitted any payment requests yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Requests</CardTitle>
        <CardDescription>Track your payment request status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getPaymentMethodIcon(request.paymentMethod)}</div>
                  <div>
                    <div className="font-semibold">{request.plan} Plan</div>
                    <div className="text-sm text-gray-600">
                      ${request.amount} • {getTimeAgo(request.submittedAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Transaction ID:</span>
                  <div className="text-gray-600 font-mono">{request.transactionId}</div>
                </div>
                <div>
                  <span className="font-medium">Submitted:</span>
                  <div className="text-gray-600">{formatDate(request.submittedAt)}</div>
                </div>
                {request.approvedAt && (
                  <div>
                    <span className="font-medium">Processed:</span>
                    <div className="text-gray-600">{formatDate(request.approvedAt)}</div>
                  </div>
                )}
              </div>

              {request.status === 'rejected' && request.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-800">Rejection Reason:</div>
                      <div className="text-red-700 text-sm">{request.rejectionReason}</div>
                    </div>
                  </div>
                </div>
              )}

              {request.status === 'approved' && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800">Payment Approved!</div>
                      <div className="text-green-700 text-sm">
                        Your {request.plan} plan is now active. You can access all features in your dashboard.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {request.status === 'pending' && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-800">Under Review</div>
                      <div className="text-yellow-700 text-sm">
                        Your payment is being reviewed. You'll receive an email notification once processed.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {request.proofUrl && (
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(request.proofUrl, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Proof
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = request.proofUrl;
                      link.download = `payment-proof-${request.id}`;
                      link.click();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
