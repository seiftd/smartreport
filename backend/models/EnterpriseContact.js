const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EnterpriseContact = sequelize.define('EnterpriseContact', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    budget: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('new', 'contacted', 'closed'),
      defaultValue: 'new',
      allowNull: false
    },
    submittedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    contactedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'enterprise_contacts',
    timestamps: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['status']
      },
      {
        fields: ['submittedAt']
      }
    ]
  });

  // Instance methods
  EnterpriseContact.prototype.isNew = function() {
    return this.status === 'new';
  };

  EnterpriseContact.prototype.isContacted = function() {
    return this.status === 'contacted';
  };

  EnterpriseContact.prototype.isClosed = function() {
    return this.status === 'closed';
  };

  EnterpriseContact.prototype.markAsContacted = function(assignedTo = null) {
    this.status = 'contacted';
    this.contactedAt = new Date();
    if (assignedTo) {
      this.assignedTo = assignedTo;
    }
  };

  EnterpriseContact.prototype.markAsClosed = function() {
    this.status = 'closed';
    this.closedAt = new Date();
  };

  return EnterpriseContact;
};
