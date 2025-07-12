import { Request, Response } from "express";
import { db } from "../../utils/db";
import { adminProfiles } from "../models/schemas/adminProfiles";
import { adminProfilesToAdminTitles } from "../models/schemas/adminProfilesToAdminTitles";
import { societiesToAdmins } from "../models/schemas/societiesToAdmins";
import { adminTitles } from "../models/schemas/adminTitles";
import { eq, inArray } from "drizzle-orm";
import { AppError } from "../middlewares/errorHandler";
import { members } from "../models";

/**
 * @desc    Get all admin profiles
 * @route   GET /api/admins
 * @access  Private/Admin
 */
export const getAllAdmins = async (req: Request, res: Response) => {
  const result = await db.query.members.findMany({
    where: eq(members.clubRole, "admin"),
    with: {
      adminProfile: true,
    },
  });

  res.json(result);
};

/**
 * @desc    Get single admin profile
 * @route   GET /api/admins/:id
 * @access  Private/Admin
 */
export const getAdminById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const admin = await db.query.members.findFirst({
    where: eq(members.id, id),
    with: {
      adminProfile: true,
    },
  });

  if (!admin) {
    throw new AppError("Admin profile not found", 404);
  }

  res.json(admin);
};

/**
 * @desc    Create new admin profile
 * @route   POST /api/admins
 * @access  Private/Admin
 */
export const createAdmin = async (req: Request, res: Response) => {
  const { adminId, linkedinUrl, publicEmail, titleIds = [] } = req.body;

  if (!adminId || !linkedinUrl || !publicEmail) {
    throw new AppError("Missing required fields", 400);
  }

  await db.transaction(async (tx) => {
    const [newAdmin] = await tx
      .insert(adminProfiles)
      .values({
        adminId,
        linkedinUrl,
        publicEmail,
      })
      .returning();

    await tx
      .update(members)
      .set({ clubRole: "admin" })
      .where(eq(members.id, adminId));

    if (titleIds && titleIds.length > 0) {
      await tx.insert(adminProfilesToAdminTitles).values(
        titleIds.map((titleId: string) => ({
          adminProfileId: newAdmin.id,
          adminTitleId: titleId,
        }))
      );

      const titles = await tx.query.adminTitles.findMany({
        where: inArray(adminTitles.id, titleIds),
        columns: {
          societyId: true,
        },
      });

      const societyRelations = titles.map((title) => ({
        adminId: newAdmin.id,
        societyId: title.societyId,
      }));

      if (societyRelations.length > 0) {
        await tx.insert(societiesToAdmins).values(societyRelations);
      }
    }
  });

  res.status(201).json({ message: "Admin created successfully" });
};

/**
 * @desc    Delete admin profile
 * @route   DELETE /api/admins/:id
 * @access  Private/Admin
 */
export const deleteAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingAdmin = await db.query.adminProfiles.findFirst({
    where: eq(adminProfiles.id, id),
  });

  if (!existingAdmin) {
    throw new AppError("Admin profile not found", 404);
  }

  await db.transaction(async (tx) => {
    await tx.delete(adminProfiles).where(eq(adminProfiles.id, id));

    if (existingAdmin.adminId) {
      await tx
        .update(members)
        .set({ clubRole: "member" })
        .where(eq(members.id, existingAdmin.adminId));
    }
  });

  res.json({
    message: "Admin profile and all related data deleted successfully",
  });
};
