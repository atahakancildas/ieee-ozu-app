import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { adminProfiles } from "./adminProfiles";

export const timeSlots = pgTable("time_slots", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => adminProfiles.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const timeSlotsRelations = relations(timeSlots, ({ one }) => ({
  admin: one(adminProfiles, {
    fields: [timeSlots.adminId],
    references: [adminProfiles.id],
  }),
}));
