import {
  mysqlTable,
  varchar,
  int,
  timestamp,
  index,
  boolean
} from 'drizzle-orm/mysql-core';

// Users table for email/password authentication only
export const users = mysqlTable('users', {
  id: int('id', { unsigned: true }).primaryKey().autoincrement(),
  name: varchar('name', { length: 191 }).notNull(),
  email: varchar('email', { length: 191 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  emailVerified: boolean('emailVerified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').onUpdateNow(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
}));