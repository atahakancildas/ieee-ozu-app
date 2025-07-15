import { Request, Response } from "express";
import { db } from "../../utils/db";
import { adminProfiles } from "../models/schemas/adminProfiles";
import { adminProfilesToAdminTitles } from "../models/schemas/adminProfilesToAdminTitles";
import { societiesToAdmins } from "../models/schemas/societiesToAdmins";
import { adminTitles } from "../models/schemas/adminTitles";
import { eq, inArray } from "drizzle-orm";
import { AppError } from "../middlewares/errorHandler";
import { members } from "../models";
import cloudinary from "../../utils/cloudinary";
import streamifier from "streamifier";

/**
 * @desc    Get all admin profiles
 * @route   GET /api/admins
 * @access  Private/Admin
 */
export const getAllAdmins = async (req: Request, res: Response) => {
  const result = await db.query.members.findMany({
    where: eq(members.clubRole, "admin"),
    with: {
      adminProfile: {
        with: {
          titles: {
            with: {
              adminTitle: true,
            },
          },
        },
      },
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
      adminProfile: {
        with: {
          titles: {
            with: {
              adminTitle: true,
            },
          },
        },
      },
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
 * @desc    Update admin profile
 * @route   PUT /api/admins/:id
 * @access  Private/Admin
 */
export const updateAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingAdmin = await db.query.adminProfiles.findFirst({
    where: eq(adminProfiles.id, id),
  });

  if (!existingAdmin) {
    throw new AppError("Admin profile not found", 404);
  }

  const { linkedinUrl, publicEmail, titleIds = [] } = req.body;
  if (!linkedinUrl && !publicEmail && !req.file && titleIds.length === 0) {
    throw new AppError("No update data provided", 400);
  }

  await db.transaction(async (tx) => {
    let imgData = null;
    if (req.file) {
      if (existingAdmin.imgId) {
        await cloudinary.uploader.destroy(existingAdmin.imgId);
      }

      try {
        const result = await new Promise<{
          secure_url: string;
          public_id: string;
        }>((resolve) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error || !result) throw error;
              resolve(result);
            }
          );

          streamifier
            .createReadStream((req.file as Express.Multer.File).buffer)
            .pipe(stream);
        });

        imgData = { imgId: result.public_id, imgUrl: result.secure_url };
      } catch (error) {
        throw new AppError("Failed to upload image", 500);
      }
    }

    const updateData = {
      linkedinUrl,
      publicEmail,
      ...imgData,
    };

    await tx
      .update(adminProfiles)
      .set(updateData)
      .where(eq(adminProfiles.id, id));

    if (titleIds.length > 0) {
      await tx
        .delete(adminProfilesToAdminTitles)
        .where(eq(adminProfilesToAdminTitles.adminProfileId, id));

      await tx.insert(adminProfilesToAdminTitles).values(
        titleIds.map((titleId: string) => ({
          adminProfileId: id,
          adminTitleId: titleId,
        }))
      );
    }
  });

  res.json({ message: "Admin profile updated successfully" });
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
    if (existingAdmin.imgId) {
      await cloudinary.uploader.destroy(existingAdmin.imgId);
    }

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
