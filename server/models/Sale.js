const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Sale = sequelize.define('Sale', {
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
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    ratePerLitre: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paidAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    pendingAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    paymentMode: {
      type: DataTypes.ENUM('Cash', 'Online', 'Credit'),
      defaultValue: 'Cash',
    },
    paymentStatus: {
      type: DataTypes.ENUM('Paid', 'Pending', 'Partial'),
      defaultValue: 'Pending',
    },
    invoiceNo: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  });

  return Sale;
};
