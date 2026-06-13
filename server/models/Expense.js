const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Expense = sequelize.define('Expense', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.ENUM('Feed', 'Medicine', 'Salary', 'Electricity', 'Water', 'Maintenance', 'Equipment', 'Other'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
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
    paidTo: {
      type: DataTypes.STRING,
    },
    paymentMode: {
      type: DataTypes.ENUM('Cash', 'Online', 'Cheque'),
      defaultValue: 'Cash',
    },
    receipt: {
      type: DataTypes.STRING,
    },
  });

  return Expense;
};
