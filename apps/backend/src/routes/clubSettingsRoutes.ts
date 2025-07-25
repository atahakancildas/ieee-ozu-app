import express from "express";
import { catchAsync } from "../middlewares/errorHandler";
import {
  getClubSettings,
  updateClubSettings,
} from "../controllers/clubSettingsController";

const router = express.Router();

// TODO: Add auth middlewares

// Protected routes (require authentication & admin role)
router.get("/", catchAsync(getClubSettings));
router.patch("/", catchAsync(updateClubSettings));

export default router;
