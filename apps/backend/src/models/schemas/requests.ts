import {
  pgTable,
  uuid,
  varchar,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { yearEnum } from "../enums/yearEnum";
import { applicationStatusEnum } from "../enums/applicationStatusEnum";

export const requests = pgTable("requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  surname: varchar("surname").notNull(),
  studentId: varchar("student_id").notNull(),
  faculty: varchar("faculty").notNull(),
  department: varchar("department").notNull(),
  email: varchar("email").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  isPreviousYear: boolean("is_previous_year").notNull().default(false),
  year: yearEnum("year").notNull(),
  expectations: text("expectations").notNull(),
  status: applicationStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});
