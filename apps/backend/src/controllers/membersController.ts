import { Request, Response } from "express";
import { db } from "../db";
import { members } from "../models/schemas/members";
import { eq, desc } from "drizzle-orm";
import { AppError } from "../middlewares/errorHandler";

/**
 * @desc    Get all members
 * @route   GET /api/members
 * @access  Private/Admin
 */
export const getAllMembers = async (req: Request, res: Response) => {
  const result = await db.query.members.findMany({
    orderBy: [desc(members.createdAt)],
  });

  res.json(result);
};

/**
 * @desc    Get single member
 * @route   GET /api/members/:id
 * @access  Private/Admin
 */
export const getMemberById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const member = await db.query.members.findFirst({
    where: eq(members.id, id),
  });

  if (!member) {
    throw new AppError("Member not found", 404);
  }

  res.json(member);
};

// TODO: Handle sending emails to users whose applications are approved
/**
 * @desc    Create new member
 * @route   POST /api/members
 * @access  Private/Admin
 */
export const createMember = async (req: Request, res: Response) => {
  const {
    clerkUserId,
    name,
    surname,
    studentId,
    faculty,
    department,
    email,
    phoneNumber,
    isPreviousYear,
    year,
    expectations,
    clubRole,
  } = req.body;

  // Input validation
  if (
    !clerkUserId ||
    !name ||
    !surname ||
    !studentId ||
    !faculty ||
    !department ||
    !email ||
    !phoneNumber ||
    isPreviousYear === undefined ||
    !year ||
    !expectations
  ) {
    throw new AppError("Missing required fields", 400);
  }

  await db.insert(members).values({
    clerkUserId,
    name,
    surname,
    studentId,
    faculty,
    department,
    email,
    phoneNumber,
    isPreviousYear,
    year,
    expectations,
    clubRole,
  });

  res.status(201).json({ message: "Member created successfully" });
};

/**
 * @desc    Update member
 * @route   PATCH /api/members/:id
 * @access  Private/Admin
 */
export const updateMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  // Prevent updating clerkUserId
  if (updateData.clerkUserId) {
    delete updateData.clerkUserId;
  }

  await db.update(members).set(updateData).where(eq(members.id, id));

  res.status(200).json({ message: "Member updated successfully" });
};

/**
 * @desc    Delete member
 * @route   DELETE /api/members/:id
 * @access  Private/Admin
 */
export const deleteMember = async (req: Request, res: Response) => {
  const { id } = req.params;

  await db.delete(members).where(eq(members.id, id));

  res.status(200).json({ message: "Member deleted successfully" });
};
