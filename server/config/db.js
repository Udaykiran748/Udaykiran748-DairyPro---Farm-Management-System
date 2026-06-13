const db = require('../models');

const connectDB = async () => {
  try {
    // Authenticate the connection
    await db.sequelize.authenticate();
    console.log(`✅ MySQL Connected: ${process.env.DB_HOST}`);

    // Sync all models
    // Using { alter: true } so it safely updates tables if they exist
    await db.sequelize.sync({ alter: true });
    console.log(`✅ Database tables synced`);

  } catch (error) {
    console.log(`❌ MySQL Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;