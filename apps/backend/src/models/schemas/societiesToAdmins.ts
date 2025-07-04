import { pgTable, uuid } from "drizzle-orm/pg-core";
import { societies } from "./societies";
import { adminProfiles } from "./adminProfiles";
import { relations } from "drizzle-orm";

export const societiesToAdmins = pgTable("societies_to_admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  societyId: uuid("society_id")
    .notNull()
    .references(() => societies.id),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => adminProfiles.id),
});

export const societiesToAdminsRelations = relations(
  societiesToAdmins,
  ({ one }) => ({
    society: one(societies, {
      fields: [societiesToAdmins.societyId],
      references: [societies.id],
    }),
    admin: one(adminProfiles, {
      fields: [societiesToAdmins.adminId],
      references: [adminProfiles.id],
    }),
  })
);
