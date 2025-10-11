import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown, Zap, Star, ArrowRight, CreditCard, Shield, Users, BarChart3, FileText, Download, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import PayPalIntegration from './PayPalIntegration';
import ManualPaymentForm from './ManualPaymentForm';
import EnterpriseContactForm from './EnterpriseContactForm';
import { updateSubscriptionPlan } from '../services/api';

const UpgradeModal = ({ isOpen, onClose, currentPlan = 'Free' }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // 'paypal' or 'manual'
  const [showEnterpriseContact, setShowEnterpriseContact] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '5 reports per month',
        'Basic templates',
        'PDF export',
        'Email support',
        '1GB storage'
      ],
      limitations: [
        'Limited templates',
        'Basic analytics',
        'Standard support'
      ],
      color: 'from-gray-500 to-gray-600',
      icon: Star,
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For growing businesses',
      features: [
        'Unlimited reports',
        'Premium templates',
        'All export formats',
        'Priority support',
        '10GB storage',
        'Advanced analytics',
        'Custom branding',
        'API access'
      ],
      limitations: [],
      color: 'from-blue-500 to-blue-600',
      icon: Zap,
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'Advanced security',
        'Dedicated support',
        'Custom integrations',
        'White-label solution',
        'SLA guarantee',
        'Team collaboration'
      ],
      limitations: [],
      color: 'from-purple-500 to-purple-600',
      icon: Crown,
      popular: false
    }
  ];

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    
    // For Enterprise plan, show contact form instead of payment
    if (plan.name === 'Enterprise') {
      setShowEnterpriseContact(true);
    } else {
      setShowPayment(true);
      setPaymentError('');
      setPaymentMethod(''); // Reset payment method
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      setIsProcessing(true);
      
      // Update subscription in backend
      const token = localStorage.getItem('token');
      const result = await updateSubscriptionPlan(token, {
        plan: selectedPlan.name,
        paymentProvider: 'paypal',
        paymentId: paymentData.paymentId,
        subscriptionId: paymentData.subscriptionId
      });

      if (result.success) {
        alert(`Successfully upgraded to ${selectedPlan.name} plan!`);
        onClose();
        // Refresh the page to update subscription status
        window.location.reload();
      } else {
        throw new Error(result.message || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Payment success error:', error);
      setPaymentError(error.message || 'Failed to update subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
    setShowPayment(false);
  };

  const handleBackToPlans = () => {
    setShowPayment(false);
    setSelectedPlan(null);
    setPaymentError('');
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
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choose Your Plan</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Upgrade to unlock more features and create unlimited reports
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {plans.map((plan, index) => {
                const IconComponent = plan.icon;
                const isCurrentPlan = currentPlan.toLowerCase() === plan.id;
                const isSelected = selectedPlan === plan.id;
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className={`relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <Card className={`h-full ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''} ${isCurrentPlan ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-blue-500 text-white px-4 py-1">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      
                      {isCurrentPlan && (
                        <div className="absolute -top-4 right-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Current Plan
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                          {plan.name}
                        </CardTitle>
                        <div className="mt-4">
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                          <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                        </div>
                        <CardDescription className="mt-2">{plan.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Features */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Features</h4>
                          <ul className="space-y-2">
                            {plan.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center space-x-2">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Limitations (for Free plan) */}
                        {plan.limitations.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Limitations</h4>
                            <ul className="space-y-2">
                              {plan.limitations.map((limitation, limitationIndex) => (
                                <li key={limitationIndex} className="flex items-center space-x-2">
                                  <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                                  <span className="text-sm text-gray-500 dark:text-gray-500">{limitation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="pt-4">
                          {isCurrentPlan ? (
                            <Button
                              disabled
                              className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                            >
                              Current Plan
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setSelectedPlan(plan.id)}
                              className={`w-full ${
                                plan.popular 
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                  : 'bg-gray-900 hover:bg-gray-800 text-white'
                              }`}
                            >
                              {plan.id === 'free' ? 'Downgrade' : 'Choose Plan'}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Payment Method Selection */}
            {showPayment && selectedPlan && !paymentMethod && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Choose Payment Method</h3>
                  <Button
                    variant="outline"
                    onClick={handleBackToPlans}
                    disabled={isProcessing}
                  >
                    ← Back to Plans
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="p-6 border rounded-lg cursor-pointer hover:border-blue-500 transition-all"
                    onClick={() => handlePaymentMethodSelect('paypal')}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">PayPal</h4>
                        <p className="text-sm text-gray-600">Instant payment</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Pay securely with PayPal. Your subscription will be activated immediately.</p>
                  </div>
                  
                  <div
                    className="p-6 border rounded-lg cursor-pointer hover:border-blue-500 transition-all"
                    onClick={() => handlePaymentMethodSelect('manual')}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Manual Payment</h4>
                        <p className="text-sm text-gray-600">Binance Pay, USDT, Visa</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Pay using Binance Pay, USDT, or Visa. Reviewed within 2 hours.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PayPal Payment Integration */}
            {showPayment && selectedPlan && paymentMethod === 'paypal' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">PayPal Payment</h3>
                  <Button
                    variant="outline"
                    onClick={() => setPaymentMethod('')}
                    disabled={isProcessing}
                  >
                    ← Back to Payment Methods
                  </Button>
                </div>
                
                {paymentError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{paymentError}</p>
                  </div>
                )}
                
                <PayPalIntegration
                  selectedPlan={selectedPlan}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </motion.div>
            )}

            {/* Manual Payment Form */}
            {showPayment && selectedPlan && paymentMethod === 'manual' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <ManualPaymentForm
                  selectedPlan={selectedPlan}
                  onPaymentSubmit={handlePaymentSuccess}
                  onCancel={() => setPaymentMethod('')}
                />
              </motion.div>
            )}

            {/* Selected Plan Confirmation (for non-payment plans) */}
            {selectedPlan && !showPayment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      Ready to upgrade to {plans.find(p => p.id === selectedPlan)?.name}?
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 mt-1">
                      You'll be redirected to our secure payment processor to complete your subscription.
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPlan(null)}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleUpgrade(selectedPlan)}
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4" />
                          <span>Continue to Payment</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security & Trust */}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enterprise Contact Form */}
      <EnterpriseContactForm
        isOpen={showEnterpriseContact}
        onClose={() => setShowEnterpriseContact(false)}
      />
    </AnimatePresence>
  );
};

export default UpgradeModal;
