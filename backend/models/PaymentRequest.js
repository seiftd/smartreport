const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaymentRequest = sequelize.define('PaymentRequest', {
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
      type: DataTypes.ENUM('Pro', 'For Growing Businesses', 'Enterprise'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('binance', 'usdt', 'visa'),
      allowNull: false
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    proofUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'payment_requests',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['paymentMethod']
      }
    ]
  });

  // Instance methods
  PaymentRequest.prototype.isPending = function() {
    return this.status === 'pending';
  };

  PaymentRequest.prototype.isApproved = function() {
    return this.status === 'approved';
  };

  PaymentRequest.prototype.isRejected = function() {
    return this.status === 'rejected';
  };

  PaymentRequest.prototype.getPaymentDetails = function() {
    const paymentDetails = {
      binance: {
        id: '713636914',
        name: 'Binance Pay',
        instructions: 'Send payment to Binance Pay ID: 713636914'
      },
      usdt: {
        address: 'TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX',
        name: 'USDT (TRC20)',
        instructions: 'Send USDT to TRC20 address: TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX'
      },
      visa: {
        card: '4006930002826976',
        name: 'Visa Card',
        instructions: 'Send payment to Visa card: 4006930002826976'
      }
    };

    return paymentDetails[this.paymentMethod];
  };

  return PaymentRequest;
};
