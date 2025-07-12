import express from "express";
import { catchAsync } from "../middlewares/errorHandler";
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminsController";

const router = express.Router();

// TODO: Add auth middlewares

// Protected routes (require authentication & admin role)
router.get("/", catchAsync(getAllAdmins));
router.post("/", catchAsync(createAdmin));
router.get("/:id", catchAsync(getAdminById));
router.patch("/:id", catchAsync(updateAdmin));
router.delete("/:id", catchAsync(deleteAdmin));

export default router;
