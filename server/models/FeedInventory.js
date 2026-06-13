const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const FeedInventory = sequelize.define('FeedInventory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    feedType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentStock: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    unit: {
      type: DataTypes.ENUM('kg', 'quintal', 'bag'),
      defaultValue: 'kg',
    },
    minStock: {
      type: DataTypes.FLOAT,
      defaultValue: 50,
    },
    pricePerUnit: {
      type: DataTypes.FLOAT,
    },
    supplier: {
      type: DataTypes.STRING,
    },
    lastRestocked: {
      type: DataTypes.DATE,
    },
  });

  return FeedInventory;
};
