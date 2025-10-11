import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const PayPalIntegration = ({ selectedPlan, onPaymentSuccess, onPaymentError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // PayPal plan mapping
  const paypalPlans = {
    'Pro': {
      planId: 'P-1234567890', // Replace with actual PayPal plan ID
      price: 29,
      currency: 'USD',
      interval: 'month'
    },
    'For Growing Businesses': {
      planId: 'P-0987654321', // Replace with actual PayPal plan ID
      price: 99,
      currency: 'USD',
      interval: 'month'
    },
    'Enterprise': {
      planId: 'P-1122334455', // Replace with actual PayPal plan ID
      price: 299,
      currency: 'USD',
      interval: 'month'
    }
  };

  const currentPlan = paypalPlans[selectedPlan];

  const handlePayPalPayment = async () => {
    if (!currentPlan) {
      onPaymentError('Invalid plan selected');
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Create PayPal order
      const orderData = {
        plan: selectedPlan,
        amount: currentPlan.price,
        currency: currentPlan.currency,
        interval: currentPlan.interval
      };

      // Simulate PayPal payment process
      // In real implementation, you would:
      // 1. Create PayPal order via your backend
      // 2. Redirect to PayPal for payment
      // 3. Handle the callback/redirect
      
      console.log('Initiating PayPal payment for:', orderData);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      setPaymentStatus('success');
      onPaymentSuccess({
        plan: selectedPlan,
        amount: currentPlan.price,
        currency: currentPlan.currency,
        paymentId: 'PAY-' + Math.random().toString(36).substring(2, 15),
        subscriptionId: 'SUB-' + Math.random().toString(36).substring(2, 15)
      });

    } catch (error) {
      console.error('PayPal payment error:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      onPaymentError(error.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Processing payment...';
      case 'success':
        return 'Payment successful!';
      case 'error':
        return errorMessage;
      default:
        return 'Secure payment powered by PayPal';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          PayPal Payment
        </CardTitle>
        <CardDescription>
          Secure payment processing powered by PayPal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{selectedPlan} Plan</span>
              <Badge variant="outline">{currentPlan?.interval}</Badge>
            </div>
            <div className="text-2xl font-bold">
              ${currentPlan?.price}
              <span className="text-sm font-normal text-gray-500">/{currentPlan?.interval}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Billed monthly • Cancel anytime
            </div>
          </div>

          {/* Payment Features */}
          <div className="space-y-3">
            <h4 className="font-semibold">What's included:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {selectedPlan === 'Pro' && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>50 reports per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>5 team members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>API access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Custom branding</span>
                  </div>
                </>
              )}
              {selectedPlan === 'For Growing Businesses' && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>200 reports per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>25 team members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Advanced analytics</span>
                  </div>
                </>
              )}
              {selectedPlan === 'Enterprise' && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Unlimited reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Unlimited team members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Dedicated support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Custom integrations</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Status */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getStatusIcon()}
            <span className={`text-sm ${getStatusColor()}`}>
              {getStatusMessage()}
            </span>
          </div>

          {/* PayPal Button */}
          <Button
            onClick={handlePayPalPayment}
            disabled={isLoading || paymentStatus === 'processing'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pay with PayPal
              </div>
            )}
          </Button>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          {/* Terms */}
          <div className="text-xs text-gray-500 text-center">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            You can cancel your subscription at any time.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayPalIntegration;
