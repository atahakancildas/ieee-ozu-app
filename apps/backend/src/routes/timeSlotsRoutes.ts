import express from "express";
import { catchAsync } from "../middlewares/errorHandler";
import {
  getAllTimeSlotsForAnAdmin,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
} from "../controllers/timeSlotsController";

const router = express.Router();

// TODO: Add auth middlewares

router.get("/:adminId", catchAsync(getAllTimeSlotsForAnAdmin));
router.post("/", catchAsync(createTimeSlot));
router.patch("/:id", catchAsync(updateTimeSlot));
router.delete("/:id", catchAsync(deleteTimeSlot));

export default router;
