import { pgEnum } from "drizzle-orm/pg-core";

export const clubRoleEnum = pgEnum("club_role", ["member", "admin"]);
