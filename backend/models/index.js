const { sequelize } = require('../config/database');

// Import models
const User = require('./User');
const Report = require('./Report');
const Template = require('./Template');
const Subscription = require('./Subscription');
const PaymentRequest = require('./PaymentRequest');
const EnterpriseContact = require('./EnterpriseContact');

// Initialize models
const models = {
  User: User(sequelize),
  Report: Report(sequelize),
  Template: Template(sequelize),
  Subscription: Subscription(sequelize),
  PaymentRequest: PaymentRequest(sequelize),
  EnterpriseContact: EnterpriseContact(sequelize)
};

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize
module.exports = {
  ...models,
  sequelize
};
