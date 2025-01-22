const mongoose = require("mongoose");

// Connect to MongoDB using the URL from .env file
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to the database"))
  .catch((error) => console.error("Database connection error:", error.message));
