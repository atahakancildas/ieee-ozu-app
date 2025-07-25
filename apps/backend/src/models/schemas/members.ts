import {
  pgTable,
  uuid,
  varchar,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { yearEnum } from "../enums/yearEnum";
import { clubRoleEnum } from "../enums/clubRoleEnum";
import { relations } from "drizzle-orm";
import { adminProfiles } from "./adminProfiles";
import { societyApplications } from "./societyApplications";
import { societiesToMembers } from "./societiesToMembers";
import { societyInterviews } from "./societyInterviews";

export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: varchar("clerk_user_id").notNull().unique(),
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
  clubRole: clubRoleEnum("club_role").notNull().default("member"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const membersRelations = relations(members, ({ one, many }) => ({
  adminProfile: one(adminProfiles),
  societies: many(societiesToMembers),
  societyApplications: many(societyApplications),
  societyInterviews: many(societyInterviews),
}));
