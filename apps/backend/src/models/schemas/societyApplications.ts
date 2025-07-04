import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { members } from "./members";
import { societies } from "./societies";
import { applicationStatusEnum } from "../enums/applicationStatusEnum";
import { relations } from "drizzle-orm";

export const societyApplications = pgTable("society_application", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicantId: uuid("applicant_id")
    .notNull()
    .references(() => members.id),
  associatedSocietyId: uuid("associated_society_id")
    .notNull()
    .references(() => societies.id),
  motivation: text("motivation").notNull(),
  status: applicationStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const societyApplicationsRelations = relations(
  societyApplications,
  ({ one }) => ({
    applicant: one(members, {
      fields: [societyApplications.applicantId],
      references: [members.id],
    }),
    associatedSociety: one(societies, {
      fields: [societyApplications.associatedSocietyId],
      references: [societies.id],
    }),
  })
);
