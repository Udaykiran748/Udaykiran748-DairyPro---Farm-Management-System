const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false, // Set to console.log to see SQL queries
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./User')(sequelize, Sequelize);
db.Animal = require('./Animal')(sequelize, Sequelize);
db.MilkRecord = require('./MilkRecord')(sequelize, Sequelize);
db.HealthRecord = require('./HealthRecord')(sequelize, Sequelize);
db.FeedInventory = require('./FeedInventory')(sequelize, Sequelize);
db.FeedRecord = require('./FeedRecord')(sequelize, Sequelize);
db.Employee = require('./Employee')(sequelize, Sequelize);
db.Attendance = require('./Attendance')(sequelize, Sequelize);
db.Customer = require('./Customer')(sequelize, Sequelize);
db.Sale = require('./Sale')(sequelize, Sequelize);
db.Expense = require('./Expense')(sequelize, Sequelize);
db.Inventory = require('./Inventory')(sequelize, Sequelize);

// Define associations
// User associations
db.User.hasMany(db.Animal, { foreignKey: 'addedBy', as: 'animals' });
db.Animal.belongsTo(db.User, { foreignKey: 'addedBy', as: 'addedByUser' });

db.User.hasMany(db.MilkRecord, { foreignKey: 'recordedBy', as: 'milkRecords' });
db.MilkRecord.belongsTo(db.User, { foreignKey: 'recordedBy', as: 'recordedByUser' });

db.User.hasMany(db.HealthRecord, { foreignKey: 'recordedBy', as: 'healthRecords' });
db.HealthRecord.belongsTo(db.User, { foreignKey: 'recordedBy', as: 'recordedByUser' });

db.User.hasMany(db.FeedRecord, { foreignKey: 'recordedBy', as: 'feedRecords' });
db.FeedRecord.belongsTo(db.User, { foreignKey: 'recordedBy', as: 'recordedByUser' });

db.User.hasMany(db.Expense, { foreignKey: 'recordedBy', as: 'expenses' });
db.Expense.belongsTo(db.User, { foreignKey: 'recordedBy', as: 'recordedByUser' });

db.User.hasMany(db.Sale, { foreignKey: 'recordedBy', as: 'sales' });
db.Sale.belongsTo(db.User, { foreignKey: 'recordedBy', as: 'recordedByUser' });

// Animal associations
db.Animal.hasMany(db.MilkRecord, { foreignKey: 'animalIdRef', as: 'milkRecords' });
db.MilkRecord.belongsTo(db.Animal, { foreignKey: 'animalIdRef', as: 'animal' });

db.Animal.hasMany(db.HealthRecord, { foreignKey: 'animalIdRef', as: 'healthRecords' });
db.HealthRecord.belongsTo(db.Animal, { foreignKey: 'animalIdRef', as: 'animal' });

// Employee associations
db.Employee.hasMany(db.Attendance, { foreignKey: 'employeeIdRef', as: 'attendance' });
db.Attendance.belongsTo(db.Employee, { foreignKey: 'employeeIdRef', as: 'employee' });

// Customer associations
db.Customer.hasMany(db.Sale, { foreignKey: 'customerIdRef', as: 'sales' });
db.Sale.belongsTo(db.Customer, { foreignKey: 'customerIdRef', as: 'customer' });

module.exports = db;
