const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firebaseUid: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  provider: {
    type: DataTypes.STRING,
    defaultValue: 'firebase'
  },
  plan: {
    type: DataTypes.ENUM('free', 'pro', 'business'),
    defaultValue: 'free'
  },
  subscriptionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('active', 'cancelled', 'expired', 'past_due'),
    defaultValue: 'active'
  },
  reportsUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reportsLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  subscriptionStartDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  subscriptionEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      unique: true,
      fields: ['firebaseUid']
    }
  ]
});

module.exports = User;
