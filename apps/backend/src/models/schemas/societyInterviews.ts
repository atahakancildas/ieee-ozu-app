import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { interviewStatusEnum } from "../enums/interviewStatusEnum";
import { adminProfiles } from "./adminProfiles";
import { members } from "./members";
import { societies } from "./societies";
import { timeSlots } from "./timeSlots";
import { relations } from "drizzle-orm";
import { societyApplications } from "./societyApplications";

export const societyInterviews = pgTable("societyInterviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id")
    .notNull()
    .references(() => societyApplications.id, { onDelete: "cascade" }),
  interviewerId: uuid("interviewer_id").references(() => adminProfiles.id, {
    onDelete: "cascade",
  }),
  intervieweeId: uuid("interviewee_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  associatedSocietyId: uuid("associated_society_id")
    .notNull()
    .references(() => societies.id, { onDelete: "cascade" }),
  timeSlotId: uuid("time_slot_id")
    .notNull()
    .references(() => timeSlots.id, { onDelete: "cascade" }),
  notes: text("notes").notNull(),
  status: interviewStatusEnum("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const societyInterviewsRelations = relations(
  societyInterviews,
  ({ one }) => ({
    application: one(societyApplications, {
      fields: [societyInterviews.applicationId],
      references: [societyApplications.id],
    }),
    interviewer: one(adminProfiles, {
      fields: [societyInterviews.interviewerId],
      references: [adminProfiles.id],
    }),
    interviewee: one(members, {
      fields: [societyInterviews.intervieweeId],
      references: [members.id],
    }),
    timeSlot: one(timeSlots, {
      fields: [societyInterviews.timeSlotId],
      references: [timeSlots.id],
    }),
    associatedSociety: one(societies, {
      fields: [societyInterviews.associatedSocietyId],
      references: [societies.id],
    }),
  })
);
