import { pgEnum } from "drizzle-orm/pg-core";

export const interviewStatusEnum = pgEnum("interview_status", [
  "scheduled",
  "rescheduled",
  "completed",
  "cancelled",
  "approved",
  "rejected",
]);
