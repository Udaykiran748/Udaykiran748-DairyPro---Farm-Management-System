const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Present', 'Absent', 'Half-day', 'Leave'),
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.STRING,
    },
    checkOut: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  });

  return Attendance;
};
