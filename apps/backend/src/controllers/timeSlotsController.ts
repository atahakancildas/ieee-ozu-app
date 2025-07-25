import { Request, Response } from "express";
import { db } from "../../utils/db";
import { timeSlots } from "../models/schemas/timeSlots";
import { eq, and, gte, lte, or, gt, lt, ne } from "drizzle-orm";
import { AppError } from "../middlewares/errorHandler";

/**
 * @desc    Get all time slots (for an admin)
 * @route   GET /api/admins/time-slots/:adminId
 * @access  Private/Member
 */
export const getAllTimeSlotsForAnAdmin = async (
  req: Request,
  res: Response
) => {
  const { adminId } = req.params;

  const result = await db.query.timeSlots.findMany({
    where: eq(timeSlots.adminId, adminId),
  });

  res.status(200).json(result);
};

/**
 * @desc    Create a new time slot
 * @route   POST /api/admins/time-slots
 * @access  Private/Admin
 */
export const createTimeSlot = async (req: Request, res: Response) => {
  const { adminId, startTime, endTime, isAvailable = true } = req.body;

  if (!adminId || !startTime || !endTime) {
    throw new AppError("adminId, startTime, and endTime are required", 400);
  }

  if (new Date(startTime) >= new Date(endTime)) {
    throw new AppError("endTime must be after startTime", 400);
  }

  const overlappingSlots = await db
    .select()
    .from(timeSlots)
    .where(
      and(
        eq(timeSlots.adminId, adminId),
        or(
          and(
            lte(timeSlots.startTime, new Date(startTime)),
            gt(timeSlots.endTime, new Date(startTime))
          ),
          and(
            lt(timeSlots.startTime, new Date(endTime)),
            gte(timeSlots.endTime, new Date(endTime))
          ),
          and(
            gte(timeSlots.startTime, new Date(startTime)),
            lte(timeSlots.endTime, new Date(endTime))
          )
        )
      )
    );

  if (overlappingSlots.length > 0) {
    throw new AppError("Time slot overlaps with existing slot", 409);
  }

  await db.insert(timeSlots).values({
    adminId,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    isAvailable,
  });

  res.status(201).json({ message: "Time slot created successfully" });
};

/**
 * @desc    Update time slot (for only availability)
 * @route   PATCH /api/admins/time-slots/:id
 * @access  Private/Member
 */
export const updateTimeSlot = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  if (typeof isAvailable !== "boolean") {
    throw new AppError("isAvailable must be a boolean", 400);
  }

  const existingSlot = await db.query.timeSlots.findFirst({
    where: eq(timeSlots.id, id),
  });

  if (!existingSlot) {
    throw new AppError("Time slot not found", 404);
  }

  await db.update(timeSlots).set({ isAvailable }).where(eq(timeSlots.id, id));

  res.status(200).json({ message: "Time slot updated successfully" });
};

// TODO: Admins can only delete their own time slots
/**
 * @desc    Delete a time slot
 * @route   DELETE /api/admins/time-slots/:id
 * @access  Private/Admin
 */
export const deleteTimeSlot = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingSlot = await db.query.timeSlots.findFirst({
    where: eq(timeSlots.id, id),
  });

  if (!existingSlot) {
    throw new AppError("Time slot not found", 404);
  }

  await db.delete(timeSlots).where(eq(timeSlots.id, id));

  res.status(200).json({ message: "Time slot deleted successfully" });
};
