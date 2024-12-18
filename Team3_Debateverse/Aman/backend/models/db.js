const mongoose = require("mongoose");

const db = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Database connected successfully.");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
};

module.exports = db;
