import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core";

export const clubSettings = pgTable("club_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  areNewMemberRegistrationsOpen: boolean("are_new_member_registrations_open")
    .notNull()
    .default(false),
  areSocietyApplicationsOpen: boolean("are_society_applications_open")
    .notNull()
    .default(false),
  societyApplicationsOpenDate: timestamp(
    "society_applications_open_date"
  ).notNull(),
  societyApplicationsCloseDate: timestamp(
    "society_applications_close_date"
  ).notNull(),
  areSocietyInterviewsOpen: boolean("are_society_interviews_open")
    .notNull()
    .default(false),
  societyInterviewsOpenDate: timestamp(
    "society_interviews_open_date"
  ).notNull(),
  societyInterviewsCloseDate: timestamp(
    "society_interviews_close_date"
  ).notNull(),
  areOpenPositionApplicationsOpen: boolean(
    "are_open_position_applications_open"
  )
    .notNull()
    .default(false),
  openPositionApplicationsOpenDate: timestamp(
    "open_position_applications_open_date"
  ).notNull(),
  openPositionApplicationsCloseDate: timestamp(
    "open_position_applications_close_date"
  ).notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
