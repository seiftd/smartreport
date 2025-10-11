import React, { useState } from 'react';
import { CreditCard, Upload, CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const ManualPaymentForm = ({ selectedPlan, onPaymentSubmit, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const paymentMethods = {
    binance: {
      id: '713636914',
      name: 'Binance Pay',
      instructions: 'Send payment to Binance Pay ID: 713636914',
      icon: '💳'
    },
    usdt: {
      address: 'TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX',
      name: 'USDT (TRC20)',
      instructions: 'Send USDT to TRC20 address: TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX',
      icon: '₮'
    },
    visa: {
      card: '4006930002826976',
      name: 'Visa Card',
      instructions: 'Send payment to Visa card: 4006930002826976',
      icon: '💳'
    }
  };

  const planPricing = {
    'Pro': { price: 29, currency: 'USD' },
    'For Growing Businesses': { price: 99, currency: 'USD' },
    'Enterprise': { price: 299, currency: 'USD' }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      setProofFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentMethod || !transactionId) {
      setError('Please select payment method and enter transaction ID');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('plan', selectedPlan);
      formData.append('amount', planPricing[selectedPlan].price);
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionId', transactionId);
      
      if (proofFile) {
        formData.append('proof', proofFile);
      }

      // Submit payment request
      const token = localStorage.getItem('token');
      const response = await fetch('https://smartreport-pro-backendone.vercel.app/api/payment-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        onPaymentSubmit(result);
      } else {
        throw new Error(result.message || 'Failed to submit payment request');
      }

    } catch (error) {
      console.error('Payment submission error:', error);
      setError(error.message || 'Failed to submit payment request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPaymentMethod = paymentMethods[paymentMethod];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Manual Payment - {selectedPlan} Plan
        </CardTitle>
        <CardDescription>
          Complete your payment using one of the supported methods below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{selectedPlan} Plan</span>
              <Badge variant="outline">Manual Payment</Badge>
            </div>
            <div className="text-2xl font-bold">
              ${planPricing[selectedPlan].price}
              <span className="text-sm font-normal text-gray-500">/month</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Payment will be reviewed within 2 hours
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h4 className="font-semibold mb-3">Select Payment Method</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(paymentMethods).map(([key, method]) => (
                <div
                  key={key}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod(key)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{method.icon}</div>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-500">
                        {key === 'binance' && method.id}
                        {key === 'usdt' && method.address.substring(0, 20) + '...'}
                        {key === 'visa' && method.card}
                      </div>
                    </div>
                    {paymentMethod === key && (
                      <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          {selectedPaymentMethod && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Payment Instructions
              </h4>
              <p className="text-sm text-blue-800 mb-2">{selectedPaymentMethod.instructions}</p>
              <div className="text-sm font-medium text-blue-900">
                {paymentMethod === 'binance' && `Binance Pay ID: ${selectedPaymentMethod.id}`}
                {paymentMethod === 'usdt' && `USDT Address: ${selectedPaymentMethod.address}`}
                {paymentMethod === 'visa' && `Visa Card: ${selectedPaymentMethod.card}`}
              </div>
            </div>
          )}

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Transaction ID / Reference Number *
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter your transaction ID or reference number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Proof (Optional)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="proof-upload"
                />
                <label
                  htmlFor="proof-upload"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  Upload Screenshot/Receipt
                </label>
                {proofFile && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    {proofFile.name}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Upload a screenshot of your payment or receipt (PNG, JPG, PDF - Max 10MB)
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !paymentMethod || !transactionId}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Submit Payment Request
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Important Notice */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Important Notice</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Your payment will be reviewed within 2 hours</li>
                  <li>• You'll receive an email notification once approved</li>
                  <li>• Make sure to include the correct transaction ID</li>
                  <li>• Keep your payment receipt for reference</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualPaymentForm;
