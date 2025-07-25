import { Request, Response } from "express";
import { db } from "../../utils/db";
import { requests } from "../models/schemas/requests";
import { eq, desc } from "drizzle-orm";
import { AppError } from "../middlewares/errorHandler";

/**
 * @desc    Get all requests
 * @route   GET /api/requests
 * @access  Private/Admin
 */
export const getAllRequests = async (req: Request, res: Response) => {
  const result = await db.query.requests.findMany({
    orderBy: [desc(requests.createdAt)],
  });

  res.status(200).json(result);
};

/**
 * @desc    Get single request
 * @route   GET /api/requests/:id
 * @access  Private/Admin
 */
export const getRequestById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const request = await db.query.requests.findFirst({
    where: eq(requests.id, id),
  });

  if (!request) {
    throw new AppError("Request not found", 404);
  }

  res.status(200).json(request);
};

/**
 * @desc    Create new request
 * @route   POST /api/requests
 * @access  Public
 */
export const createRequest = async (req: Request, res: Response) => {
  const {
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
  } = req.body;

  if (
    !name ||
    !surname ||
    !studentId ||
    !email ||
    !faculty ||
    !department ||
    !phoneNumber ||
    isPreviousYear === undefined ||
    !year
  ) {
    throw new AppError("Missing required fields", 400);
  }

  await db.insert(requests).values({
    name,
    surname,
    studentId,
    faculty,
    department,
    email,
    phoneNumber,
    isPreviousYear: Boolean(isPreviousYear),
    year,
    expectations,
  });

  res.status(201).json({ message: "Request created successfully" });
};

/**
 * @desc    Update request (only status update is allowed)
 * @route   PATCH /api/requests/:id
 * @access  Private/Admin
 */
export const updateRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const existingRequest = await db.query.requests.findFirst({
    where: eq(requests.id, id),
  });

  if (!existingRequest) {
    throw new AppError("Request not found", 404);
  }

  if (status !== "approved" && status !== "rejected") {
    throw new AppError("Invalid status", 400);
  }

  await db.update(requests).set({ status }).where(eq(requests.id, id));

  res.status(200).json({ message: "Request updated successfully" });
};

/**
 * @desc    Delete request
 * @route   DELETE /api/requests/:id
 * @access  Private/Admin
 */
export const deleteRequest = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingRequest = await db.query.requests.findFirst({
    where: eq(requests.id, id),
  });

  if (!existingRequest) {
    throw new AppError("Request not found", 404);
  }

  await db.delete(requests).where(eq(requests.id, id));

  res.status(200).json({ message: "Request deleted successfully" });
};
