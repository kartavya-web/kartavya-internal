const mongoose = require("mongoose");
const connection = {};

const connectDB = async () => {
  try {
    if (connection.isConnected) return;

    const db = await mongoose.connect(process.env.DATABASE_URI);
    connection.isConnected = db.connection.readyState;
    console.log(`Successfully connnected to mongoDB 👍`);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
