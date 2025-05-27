const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");

let database;

const db_url = process.env.DB_URL;
const connDb = (callback) => {
  if (database) {
    console.log("Database already connected");
    return callback(null, database);
  }
  MongoClient.connect(db_url)
    .then((client) => {
      database = client;
      callback(null, database);
    })
    .catch((error) => {
      console.error("Failed to connect to the database:", error);
      callback(error);
    });
};

const getDatabase = () => {
  if (!database) {
    throw Error("Database not connected");
  }
  return database;
};

module.exports = {
  connDb,
  getDatabase,
};
