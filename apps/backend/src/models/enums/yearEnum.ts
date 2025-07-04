import { pgEnum } from "drizzle-orm/pg-core";

export const yearEnum = pgEnum("year", [
  "preparatory",
  "freshman",
  "sophomore",
  "junior",
  "senior",
  "graduate",
]);
