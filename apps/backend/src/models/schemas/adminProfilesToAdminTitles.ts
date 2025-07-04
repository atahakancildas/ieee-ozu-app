import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { adminProfiles } from "./adminProfiles";
import { adminTitles } from "./adminTitles";
import { relations } from "drizzle-orm";

export const adminProfilesToAdminTitles = pgTable(
  "admin_profiles_to_admin_titles",
  {
    adminProfileId: uuid("admin_profile_id").references(() => adminProfiles.id),
    adminTitleId: uuid("admin_title_id").references(() => adminTitles.id),
  },
  (t) => [primaryKey({ columns: [t.adminProfileId, t.adminTitleId] })]
);

export const adminProfilesToAdminTitlesRelations = relations(
  adminProfilesToAdminTitles,
  ({ one }) => ({
    adminProfile: one(adminProfiles, {
      fields: [adminProfilesToAdminTitles.adminProfileId],
      references: [adminProfiles.id],
    }),
    adminTitle: one(adminTitles, {
      fields: [adminProfilesToAdminTitles.adminTitleId],
      references: [adminTitles.id],
    }),
  })
);
