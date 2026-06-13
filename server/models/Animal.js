const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Animal = sequelize.define('Animal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    animalId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Cow', 'Buffalo'),
      defaultValue: 'Cow',
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    gender: {
      type: DataTypes.ENUM('Female', 'Male'),
      defaultValue: 'Female',
    },
    isPregnant: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pregnancyDate: {
      type: DataTypes.DATE,
    },
    milkCapacity: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    purchaseDate: {
      type: DataTypes.DATE,
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
    },
    healthStatus: {
      type: DataTypes.ENUM('Excellent', 'Good', 'Fair', 'Poor', 'Sick'),
      defaultValue: 'Good',
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    notes: {
      type: DataTypes.TEXT,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Animal;
};
