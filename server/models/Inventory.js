const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Inventory = sequelize.define('Inventory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('Feed', 'Medicine', 'Equipment', 'Tools', 'Other'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minQuantity: {
      type: DataTypes.FLOAT,
      defaultValue: 5,
    },
    pricePerUnit: {
      type: DataTypes.FLOAT,
    },
    supplier: {
      type: DataTypes.STRING,
    },
    expiryDate: {
      type: DataTypes.DATE,
    },
    location: {
      type: DataTypes.STRING,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Inventory;
};
