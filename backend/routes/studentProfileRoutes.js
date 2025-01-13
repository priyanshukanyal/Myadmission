// routes/studentProfileRoutes.js
import express from "express";
import {
  getProfile,
  upsertProfile,
} from "../controllers/studentProfileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.post("/profile", authMiddleware, upsertProfile);

export default router;
