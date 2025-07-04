import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { adminProfilesToAdminTitles } from "./adminProfilesToAdminTitles";
import { societies } from "./societies";

export const adminTitles = pgTable("admin_titles", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug").notNull(),
  titleEN: varchar("title_en").notNull(),
  titleTR: varchar("title_tr").notNull(),
  societyId: uuid("society_id")
    .notNull()
    .references(() => societies.id),
});

export const adminTitlesRelations = relations(adminTitles, ({ one, many }) => ({
  admins: many(adminProfilesToAdminTitles),
  society: one(societies, {
    fields: [adminTitles.societyId],
    references: [societies.id],
  }),
}));
