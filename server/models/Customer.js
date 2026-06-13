const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Retail', 'Wholesale', 'Cooperative'),
      defaultValue: 'Retail',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    dailyQuantity: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    ratePerLitre: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pendingAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Customer;
};
