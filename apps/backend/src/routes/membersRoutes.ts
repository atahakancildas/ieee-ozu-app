import express from "express";
import { catchAsync } from "../middlewares/errorHandler";
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/membersController";

const router = express.Router();

// TODO: Add auth middlewares

// Protected routes (require authentication)
router.get("/", catchAsync(getAllMembers));
router.post("/", catchAsync(createMember));
router.get("/:id", catchAsync(getMemberById));
router.patch("/:id", catchAsync(updateMember));
router.delete("/:id", catchAsync(deleteMember));

export default router;
