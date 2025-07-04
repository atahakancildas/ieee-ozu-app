import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { societyApplications } from "./societyApplications";
import { societiesToAdmins } from "./societiesToAdmins";
import { societiesToMembers } from "./societiesToMembers";
import { relations } from "drizzle-orm";

export const societies = pgTable("societies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  descriptionTR: text("description_tr").notNull(),
  descriptionEN: text("description_en").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const societiesRelations = relations(societies, ({ many }) => ({
  applications: many(societyApplications),
  admins: many(societiesToAdmins),
  members: many(societiesToMembers),
}));
