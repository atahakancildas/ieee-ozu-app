import { Request, Response } from "express";
import { db } from "../../utils/db";
import { adminTitles } from "../models/schemas/adminTitles";
import { eq } from "drizzle-orm";
import { AppError } from "../middlewares/errorHandler";

/**
 * @desc    Get all admin titles
 * @route   GET /api/admins/titles
 * @access  Private/Admin
 */
export const getAllTitles = async (req: Request, res: Response) => {
  const result = await db.query.adminTitles.findMany({
    with: {
      society: true,
    },
  });

  res.status(200).json(result);
};

/**
 * @desc    Get single admin title by ID
 * @route   GET /api/admins/titles/:id
 * @access  Private/Admin
 */
export const getTitleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const title = await db.query.adminTitles.findFirst({
    where: eq(adminTitles.id, id),
    with: {
      society: true,
    },
  });

  if (!title) {
    throw new AppError("Admin title not found", 404);
  }

  res.status(200).json(title);
};

/**
 * @desc    Create a new admin title
 * @route   POST /api/admins/titles
 * @access  Private/Admin
 */
export const createTitle = async (req: Request, res: Response) => {
  const { slug, titleEN, titleTR, societyId } = req.body;

  if (!slug || !titleEN || !titleTR || !societyId) {
    throw new AppError("Missing required fields", 400);
  }

  await db.insert(adminTitles).values({
    slug,
    titleEN,
    titleTR,
    societyId,
  });

  res.status(201).json({ message: "Admin title created successfully" });
};

/**
 * @desc    Update an admin title
 * @route   PUT /api/admins/titles/:id
 * @access  Private/Admin
 */
export const updateTitle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { slug, titleEN, titleTR, societyId } = req.body;

  const existingTitle = await db.query.adminTitles.findFirst({
    where: eq(adminTitles.id, id),
  });

  if (!existingTitle) {
    throw new AppError("Admin title not found", 404);
  }

  await db
    .update(adminTitles)
    .set({
      ...(slug && { slug }),
      ...(titleEN && { titleEN }),
      ...(titleTR && { titleTR }),
      ...(societyId && { societyId }),
    })
    .where(eq(adminTitles.id, id));

  res.status(200).json({ message: "Admin title updated successfully" });
};

/**
 * @desc    Delete an admin title
 * @route   DELETE /api/admins/titles/:id
 * @access  Private/Admin
 */
export const deleteTitle = async (req: Request, res: Response) => {
  const { id } = req.params;

  const title = await db.query.adminTitles.findFirst({
    where: eq(adminTitles.id, id),
  });

  if (!title) {
    throw new AppError("Admin title not found", 404);
  }

  await db.delete(adminTitles).where(eq(adminTitles.id, id));

  res.status(200).json({ message: "Admin title deleted successfully" });
};
