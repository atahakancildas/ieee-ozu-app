import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { members } from "./members";
import { relations } from "drizzle-orm";
import { adminProfilesToAdminTitles } from "./adminProfilesToAdminTitles";
import { societyInterviews } from "./societyInterviews";
import { timeSlots } from "./timeSlots";
import { societiesToAdmins } from "./societiesToAdmins";

export const adminProfiles = pgTable("admin_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: uuid("admin_id").references(() => members.id),
  imgId: varchar("img_id").notNull(),
  imgUrl: text("img_url").notNull(),
  linkedinUrl: text("linkedin_url").notNull(),
  publicEmail: varchar("public_email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const adminProfilesRelations = relations(
  adminProfiles,
  ({ one, many }) => ({
    titles: many(adminProfilesToAdminTitles),
    admin: one(members, {
      fields: [adminProfiles.adminId],
      references: [members.id],
    }),
    scheduledSocietyInterviews: many(societyInterviews),
    timeSlots: many(timeSlots),
    societies: many(societiesToAdmins),
  })
);
