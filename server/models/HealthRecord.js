const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const HealthRecord = sequelize.define('HealthRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM('Vaccination', 'Treatment', 'Check-up', 'Surgery', 'Deworming'),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    doctor: {
      type: DataTypes.STRING,
    },
    medicines: {
      type: DataTypes.JSON, // Stores array of objects
    },
    cost: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    nextDueDate: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('Completed', 'Ongoing', 'Scheduled'),
      defaultValue: 'Completed',
    },
    notes: {
      type: DataTypes.TEXT,
    },
  });

  return HealthRecord;
};
