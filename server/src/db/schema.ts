import { pgTable, serial, varchar, text, timestamp, boolean, integer, numeric } from 'drizzle-orm/pg-core';

// Add your database tables here as needed for your application
// Example:
// export const users = pgTable('users', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 255 }).notNull(),
//   email: varchar('email', { length: 255 }).notNull().unique(),
//   password: varchar('password', { length: 255 }).notNull(),
//   createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
//   updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
// });

// Types will be generated here when you add tables
// export type User = typeof users.$inferSelect;
// export type NewUser = typeof users.$inferInsert;