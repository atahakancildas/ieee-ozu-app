import express from "express";
import { catchAsync } from "../middlewares/errorHandler";
import {
  getAllOpenPositionApplications,
  getOpenPositionApplicationById,
  createOpenPositionApplication,
  updateOpenPositionApplication,
  deleteOpenPositionApplication,
} from "../controllers/openPositionApplicationsController";

const router = express.Router();

// TODO: Add auth middlewares

// Public routes
router.post("/", catchAsync(createOpenPositionApplication));

// Protected routes (require authentication & admin role)
router.get("/", catchAsync(getAllOpenPositionApplications));
router.get("/:id", catchAsync(getOpenPositionApplicationById));
router.patch("/:id", catchAsync(updateOpenPositionApplication));
router.delete("/:id", catchAsync(deleteOpenPositionApplication));

export default router;
