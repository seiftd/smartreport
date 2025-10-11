const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subscription = sequelize.define('Subscription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    plan: {
      type: DataTypes.ENUM('Free', 'Pro', 'For Growing Businesses', 'Enterprise'),
      defaultValue: 'Free',
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'cancelled', 'expired', 'trial'),
      defaultValue: 'trial',
      allowNull: false
    },
    paymentProvider: {
      type: DataTypes.ENUM('paypal', 'stripe', 'lemon_squeezy', 'manual'),
      defaultValue: 'manual'
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subscriptionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    currentPeriodStart: {
      type: DataTypes.DATE,
      allowNull: true
    },
    currentPeriodEnd: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trialEndsAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: {
        reportsPerMonth: 5,
        teamMembers: 1,
        apiAccess: false,
        customBranding: false,
        prioritySupport: false,
        advancedAnalytics: false
      }
    },
    usage: {
      type: DataTypes.JSON,
      defaultValue: {
        reportsUsed: 0,
        teamMembersUsed: 1,
        apiCallsUsed: 0
      }
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'subscriptions',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['plan']
      },
      {
        fields: ['status']
      }
    ]
  });

  // Instance methods
  Subscription.prototype.isActive = function() {
    return this.status === 'active' || this.status === 'trial';
  };

  Subscription.prototype.isTrial = function() {
    return this.status === 'trial';
  };

  Subscription.prototype.isExpired = function() {
    if (this.status === 'expired') return true;
    if (this.currentPeriodEnd && new Date() > this.currentPeriodEnd) return true;
    if (this.trialEndsAt && new Date() > this.trialEndsAt && this.status === 'trial') return true;
    return false;
  };

  Subscription.prototype.hasFeature = function(feature) {
    return this.features && this.features[feature] === true;
  };

  Subscription.prototype.canUseFeature = function(feature, currentUsage = 0) {
    if (!this.isActive() || this.isExpired()) return false;
    
    switch (feature) {
      case 'reports':
        return currentUsage < this.features.reportsPerMonth;
      case 'teamMembers':
        return currentUsage < this.features.teamMembers;
      case 'apiAccess':
        return this.hasFeature('apiAccess');
      case 'customBranding':
        return this.hasFeature('customBranding');
      case 'prioritySupport':
        return this.hasFeature('prioritySupport');
      case 'advancedAnalytics':
        return this.hasFeature('advancedAnalytics');
      default:
        return false;
    }
  };

  // Static methods
  Subscription.getPlanFeatures = function(plan) {
    const planFeatures = {
      'Free': {
        reportsPerMonth: 5,
        teamMembers: 1,
        apiAccess: false,
        customBranding: false,
        prioritySupport: false,
        advancedAnalytics: false
      },
      'Pro': {
        reportsPerMonth: 50,
        teamMembers: 5,
        apiAccess: true,
        customBranding: true,
        prioritySupport: false,
        advancedAnalytics: true
      },
      'For Growing Businesses': {
        reportsPerMonth: 200,
        teamMembers: 25,
        apiAccess: true,
        customBranding: true,
        prioritySupport: true,
        advancedAnalytics: true
      },
      'Enterprise': {
        reportsPerMonth: -1, // unlimited
        teamMembers: -1, // unlimited
        apiAccess: true,
        customBranding: true,
        prioritySupport: true,
        advancedAnalytics: true
      }
    };

    return planFeatures[plan] || planFeatures['Free'];
  };

  return Subscription;
};
