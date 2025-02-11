// Import required modules
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors"; // Import CORS
import universityRoutes from "./routes/universityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import adminModuleRoutes from "./routes/SemesterApplicationDatesRoutes.js";
import countryRoutes from "./routes/countryRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import appliedRoutes from "./routes/appliedRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
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
app.use("/api/admin-module", adminModuleRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/applied", appliedRoutes);
app.use("/api/notifications", notificationRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
