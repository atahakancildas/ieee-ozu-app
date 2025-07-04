import { pgTable, uuid } from "drizzle-orm/pg-core";
import { societies } from "./societies";
import { members } from "./members";
import { relations } from "drizzle-orm";

export const societiesToMembers = pgTable("societies_to_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  societyId: uuid("society_id")
    .notNull()
    .references(() => societies.id),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id),
});

export const societiesToMembersRelations = relations(
  societiesToMembers,
  ({ one }) => ({
    society: one(societies, {
      fields: [societiesToMembers.societyId],
      references: [societies.id],
    }),
    member: one(members, {
      fields: [societiesToMembers.memberId],
      references: [members.id],
    }),
  })
);
