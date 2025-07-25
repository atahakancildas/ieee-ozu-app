import { Request, Response } from "express";
import { db } from "../../utils/db";
import { openPositionApplications } from "../models/schemas/openPositionApplications";
import { eq, desc } from "drizzle-orm";
import { AppError } from "../middlewares/errorHandler";

/**
 * @desc    Get all open position applications
 * @route   GET /api/applications/open-position
 * @access  Private/Admin
 */
export const getAllOpenPositionApplications = async (
  req: Request,
  res: Response
) => {
  const result = await db.query.openPositionApplications.findMany({
    orderBy: [desc(openPositionApplications.createdAt)],
  });

  res.status(200).json(result);
};

/**
 * @desc    Get single open position application
 * @route   GET /api/applications/open-position/:id
 * @access  Private/Admin
 */
export const getOpenPositionApplicationById = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const application = await db.query.openPositionApplications.findFirst({
    where: eq(openPositionApplications.id, id),
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  res.status(200).json(application);
};

/**
 * @desc    Create new open position application
 * @route   POST /api/applications/open-position
 * @access  Public
 */
export const createOpenPositionApplication = async (
  req: Request,
  res: Response
) => {
  const {
    name,
    surname,
    studentId,
    faculty,
    department,
    email,
    phoneNumber,
    year,
    motivation,
    weeklyCommitmentHours,
    references: refs,
  } = req.body;

  if (
    !name ||
    !surname ||
    !studentId ||
    !faculty ||
    !department ||
    !email ||
    !phoneNumber ||
    !year ||
    !motivation ||
    !weeklyCommitmentHours ||
    !refs
  ) {
    throw new AppError("Missing required fields", 400);
  }

  await db.insert(openPositionApplications).values({
    name,
    surname,
    studentId,
    faculty,
    department,
    email,
    phoneNumber,
    year,
    motivation,
    weeklyCommitmentHours,
    references: refs,
  });

  res.status(201).json({ message: "Application submitted successfully" });
};

/**
 * @desc    Update open position application (only status update is allowed)
 * @route   PATCH /api/applications/open-position/:id
 * @access  Private/Admin
 */
export const updateOpenPositionApplication = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  const existingApplication = await db.query.openPositionApplications.findFirst(
    {
      where: eq(openPositionApplications.id, id),
    }
  );

  if (!existingApplication) {
    throw new AppError("Application not found", 404);
  }

  if (status !== "approved" && status !== "rejected") {
    throw new AppError("Invalid status", 400);
  }

  await db
    .update(openPositionApplications)
    .set({ status })
    .where(eq(openPositionApplications.id, id));

  res.status(200).json({ message: "Application updated successfully" });
};

/**
 * @desc    Delete open position application
 * @route   DELETE /api/applications/open-position/:id
 * @access  Private/Admin
 */
export const deleteOpenPositionApplication = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const existingApplication = await db.query.openPositionApplications.findFirst(
    {
      where: eq(openPositionApplications.id, id),
    }
  );

  if (!existingApplication) {
    throw new AppError("Application not found", 404);
  }

  await db
    .delete(openPositionApplications)
    .where(eq(openPositionApplications.id, id));

  res.status(200).json({ message: "Application deleted successfully" });
};
