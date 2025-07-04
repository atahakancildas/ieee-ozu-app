import { pgTable, uuid, timestamp, varchar, text } from "drizzle-orm/pg-core";
import { yearEnum } from "../enums/yearEnum";

export const openPositionApplications = pgTable("open_position_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  surname: varchar("surname").notNull(),
  studentId: varchar("student_id").notNull(),
  faculty: varchar("faculty").notNull(),
  department: varchar("department").notNull(),
  email: varchar("email").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  year: yearEnum("year").notNull(),
  motivation: text("motivation").notNull(),
  weeklyCommitmentHours: varchar("weekly_commitment_hours").notNull(),
  references: text("references").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
