const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const MilkRecord = sequelize.define('MilkRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    morningMilk: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    eveningMilk: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    totalMilk: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    quality: {
      type: DataTypes.ENUM('A+', 'A', 'B', 'C'),
      defaultValue: 'A',
    },
    fatContent: {
      type: DataTypes.FLOAT,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  }, {
    hooks: {
      beforeSave: (record) => {
        record.totalMilk = (record.morningMilk || 0) + (record.eveningMilk || 0);
      },
    },
  });

  return MilkRecord;
};
