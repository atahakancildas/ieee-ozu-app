import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core";

export const clubSettings = pgTable("club_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  areNewMemberRegistrationsOpen: boolean("are_new_member_registrations_open")
    .notNull()
    .default(false),
  areSocietyApplicationsOpen: boolean("are_society_applications_open")
    .notNull()
    .default(false),
  societyApplicationsOpenDate: timestamp("society_applications_open_date"),
  societyApplicationsCloseDate: timestamp("society_applications_close_date"),
  areSocietyInterviewsOpen: boolean("are_society_interviews_open")
    .notNull()
    .default(false),
  societyInterviewsOpenDate: timestamp("society_interviews_open_date"),
  societyInterviewsCloseDate: timestamp("society_interviews_close_date"),
  areOpenPositionApplicationsOpen: boolean(
    "are_open_position_applications_open"
  )
    .notNull()
    .default(false),
  openPositionApplicationsOpenDate: timestamp(
    "open_position_applications_open_date"
  ),
  openPositionApplicationsCloseDate: timestamp(
    "open_position_applications_close_date"
  ),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
