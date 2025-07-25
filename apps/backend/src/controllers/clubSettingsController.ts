import { Request, Response } from "express";
import { db } from "../../utils/db";
import { clubSettings } from "../models/schemas/clubSettings";
import { AppError } from "../middlewares/errorHandler";
import { eq } from "drizzle-orm";

/**
 * @desc    Get club settings
 * @route   GET /api/club-settings
 * @access  Private/Admin
 */
export const getClubSettings = async (req: Request, res: Response) => {
  const result = await db.query.clubSettings.findFirst({
    where: eq(clubSettings.id, "1"),
  });

  if (!result) {
    throw new AppError("Club settings not found", 404);
  }

  return res.status(200).json(result);
};

/**
 * @desc    Update club settings
 * @route   PATCH /api/club-settings
 * @access  Private/Admin
 */
export const updateClubSettings = async (req: Request, res: Response) => {
  const {
    areNewMemberRegistrationsOpen,
    areSocietyApplicationsOpen,
    societyApplicationsOpenDate,
    societyApplicationsCloseDate,
    areSocietyInterviewsOpen,
    societyInterviewsOpenDate,
    societyInterviewsCloseDate,
    areOpenPositionApplicationsOpen,
    openPositionApplicationsOpenDate,
    openPositionApplicationsCloseDate,
  } = req.body;

  await db
    .update(clubSettings)
    .set({
      areNewMemberRegistrationsOpen,
      areSocietyApplicationsOpen,
      societyApplicationsOpenDate,
      societyApplicationsCloseDate,
      areSocietyInterviewsOpen,
      societyInterviewsOpenDate,
      societyInterviewsCloseDate,
      areOpenPositionApplicationsOpen,
      openPositionApplicationsOpenDate,
      openPositionApplicationsCloseDate,
    })
    .where(eq(clubSettings.id, "1"));

  res.status(200).json({ message: "Club settings updated successfully" });
};
