import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import taskRoute from "./routes/taskRoute.js";
import authMiddleware from "./middleware/authMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true, methods: "GET, POST, PUT, DELETE" }));

// Default route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes for auth and tasks
app.use("/api/auth", authRoute);
app.use("/api/tasks", authMiddleware, taskRoute);

// Non-existing routes
app.use((req, res, next) => {
    const error = new Error("Resource Not Found");
    error.statusCode = 404;
    next(error); 
  });

// 404 route handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Global Error Handler
app.use(errorMiddleware)

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
