// Import required modules
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors"; // Import CORS
import universityRoutes from "./routes/universityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 8111;

// Middleware
app.use(cors()); // Enable CORS after app initialization
app.use(bodyParser.json()); // For parsing JSON request bodies

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/universities", universityRoutes);
app.use("/api/users", userRoutes);
app.use("/api", studentProfileRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
