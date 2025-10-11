import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight,
  Calendar,
  CreditCard,
  Star,
  Zap,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const SubscriptionCard = ({ 
  subscription = null, 
  onUpgrade,
  onManageBilling 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const trialEndsAtRef = useRef(null);

  // Mock subscription data if none provided
  const currentSubscription = subscription || {
    plan: 'Free',
    status: 'active',
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    features: [
      '5 reports per month',
      'Basic templates',
      'PDF export',
      'Email support'
    ],
    usage: {
      reportsUsed: 2,
      reportsLimit: 5,
      storageUsed: 0.5,
      storageLimit: 1
    }
  };

  // Ensure subscription has required properties
  const safeSubscription = useMemo(() => ({
    plan: currentSubscription?.plan || 'Free',
    status: currentSubscription?.status || 'active',
    trialEndsAt: currentSubscription?.trialEndsAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    features: currentSubscription?.features || [
      '5 reports per month',
      'Basic templates',
      'PDF export',
      'Email support'
    ],
    usage: currentSubscription?.usage || {
      reportsUsed: 0,
      reportsLimit: 5,
      storageUsed: 0,
      storageLimit: 1
    }
  }), [currentSubscription]);

  useEffect(() => {
    const trialEndsAt = subscription?.trialEndsAt;
    
    // Only update if the trial end time has actually changed
    if (trialEndsAt && trialEndsAt !== trialEndsAtRef.current) {
      trialEndsAtRef.current = trialEndsAt;
      
      if (typeof trialEndsAt === 'string' || trialEndsAt instanceof Date) {
        const updateCountdown = () => {
          try {
            const now = new Date();
            const endTime = new Date(trialEndsAt);
            const diff = endTime - now;

            if (diff > 0) {
              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
              
              setTimeRemaining({ days, hours, minutes });
            } else {
              setTimeRemaining({ days: 0, hours: 0, minutes: 0 });
            }
          } catch (error) {
            console.error('Error updating countdown:', error);
            setTimeRemaining({ days: 0, hours: 0, minutes: 0 });
          }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
      }
    }
  }, [subscription?.trialEndsAt]);

  const getPlanColor = (plan) => {
    switch (plan?.toLowerCase()) {
      case 'free': return 'from-gray-500 to-gray-600';
      case 'pro': return 'from-blue-500 to-blue-600';
      case 'enterprise': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan?.toLowerCase()) {
      case 'free': return Star;
      case 'pro': return Zap;
      case 'enterprise': return Crown;
      default: return Star;
    }
  };

  const isTrialExpired = timeRemaining && timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0;

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${getPlanColor(safeSubscription.plan)} rounded-lg flex items-center justify-center`}>
              {React.createElement(getPlanIcon(safeSubscription.plan), { className: "w-6 h-6 text-white" })}
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {safeSubscription.plan} Plan
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {safeSubscription.status === 'trial' ? 'Trial Period' : 'Active Subscription'}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant={safeSubscription.plan === 'Free' ? 'secondary' : 'default'}
            className={safeSubscription.plan === 'Free' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}
          >
            {safeSubscription.plan}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Time Remaining (for trials) */}
        {safeSubscription.status === 'trial' && timeRemaining && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              isTrialExpired 
                ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Clock className={`w-5 h-5 ${isTrialExpired ? 'text-red-600' : 'text-yellow-600'}`} />
              <span className={`font-semibold ${isTrialExpired ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
                {isTrialExpired ? 'Trial Expired' : 'Trial Time Remaining'}
              </span>
            </div>
            {!isTrialExpired ? (
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                    {timeRemaining.days}
                  </div>
                  <div className="text-yellow-600 dark:text-yellow-400">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                    {timeRemaining.hours}
                  </div>
                  <div className="text-yellow-600 dark:text-yellow-400">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                    {timeRemaining.minutes}
                  </div>
                  <div className="text-yellow-600 dark:text-yellow-400">Minutes</div>
                </div>
              </div>
            ) : (
              <p className="text-red-700 dark:text-red-300">
                Your trial has expired. Upgrade to continue using SmartReport Pro.
              </p>
            )}
          </motion.div>
        )}

        {/* Usage Statistics */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Usage This Month</h4>
          
          {/* Reports Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Reports</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {safeSubscription.usage.reportsUsed} / {safeSubscription.usage.reportsLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(safeSubscription.usage.reportsUsed / safeSubscription.usage.reportsLimit) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Storage Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {safeSubscription.usage.storageUsed}GB / {safeSubscription.usage.storageLimit}GB
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(safeSubscription.usage.storageUsed / safeSubscription.usage.storageLimit) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">Plan Features</h4>
          <div className="space-y-2">
            {safeSubscription.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {safeSubscription.plan === 'Free' ? (
            <Button
              onClick={onUpgrade}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          ) : (
            <Button
              onClick={onUpgrade}
              variant="outline"
              className="flex-1"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Change Plan
            </Button>
          )}
          
          <Button
            onClick={onManageBilling}
            variant="outline"
            className="flex-1"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Manage Billing
          </Button>
        </div>

        {/* Next Billing Date */}
        {safeSubscription.nextBillingDate && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Next billing: {new Date(safeSubscription.nextBillingDate).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
