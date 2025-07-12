import express from "express";
import { catchAsync } from "../middlewares/errorHandler";
import {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
} from "../controllers/requestsController";

const router = express.Router();

// TODO: Add auth middlewares

// Public routes
router.post("/", catchAsync(createRequest));

// Protected routes (require authentication)
router.get("/", catchAsync(getAllRequests));
router.get("/:id", catchAsync(getRequestById));
router.patch("/:id", catchAsync(updateRequest));
router.delete("/:id", catchAsync(deleteRequest));

export default router;
