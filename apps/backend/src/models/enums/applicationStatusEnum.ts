import { pgEnum } from "drizzle-orm/pg-core";

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "approved",
  "rejected",
]);
