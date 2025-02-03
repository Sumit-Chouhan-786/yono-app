require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./db/connection");

// Routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cookieParser());
app.use(cors());

// Set the environment variables
const PORT = process.env.PORT || 3000;

// Middleware for logging HTTP requests
app.use(morgan("dev"));

// Middleware for parsing form data and JSON requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET || "your-secret-key", // Use the JWT_SECRET from .env or fallback to a default
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to handle flash messages
app.use((req, res, next) => {
  res.locals.message = req.session.message || null;
  delete req.session.message; // Remove the message after it's displayed
  next();
});

// Serve static files (CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve uploaded files (e.g., images) from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set up the views folder and EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes for admin functionality
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

// Error handling middleware (optional, for future use)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Internal Server Error");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
