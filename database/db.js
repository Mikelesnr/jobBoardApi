const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb"); // This import might be unused; consider removing if not needed.
const mongoose = require("mongoose");

let database; // A variable to hold the database instance, if direct access is required.

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Logs connection status or an error and exits the process on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB Connected 🚀");
    // Assigns the underlying MongoDB database object from the Mongoose connection.
    // This is useful if direct MongoDB driver methods are intended to be used.
    database = conn.connection.db;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1); // Exits the process if the database connection fails.
  }
};

/**
 * Retrieves the connected database instance.
 * Throws an error if the database has not yet been connected.
 * @returns {Db} The MongoDB database instance.
 */
const getDatabase = () => {
  if (!database) {
    throw Error("Database not connected");
  }
  return database;
};

// Exports all intended modules in a single object.
// This ensures all desired functions/variables are available when the file is required.
module.exports = {
  connectDB, // The function to initiate the database connection.
  getDatabase, // The function to retrieve the database instance.
};
