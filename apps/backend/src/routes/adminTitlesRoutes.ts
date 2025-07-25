import express from "express";
import { catchAsync } from "../middlewares/errorHandler";
import {
  getAllTitles,
  getTitleById,
  createTitle,
  updateTitle,
  deleteTitle,
} from "../controllers/adminTitlesController";

const router = express.Router();

// TODO: Add auth middlewares

// Protected routes (require authentication & admin role)
router.get("/", catchAsync(getAllTitles));
router.post("/", catchAsync(createTitle));
router.get("/:id", catchAsync(getTitleById));
router.put("/:id", catchAsync(updateTitle));
router.delete("/:id", catchAsync(deleteTitle));

export default router;
