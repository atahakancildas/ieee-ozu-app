import { pgEnum } from "drizzle-orm/pg-core";

export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "approved",
  "rejected",
]);
