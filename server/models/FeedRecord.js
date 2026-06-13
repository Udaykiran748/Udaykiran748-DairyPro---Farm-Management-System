const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const FeedRecord = sequelize.define('FeedRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    feedType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.ENUM('kg', 'g', 'litre'),
      defaultValue: 'kg',
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    animals: {
      type: DataTypes.JSON, // Array of animal IDs
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  });

  return FeedRecord;
};
