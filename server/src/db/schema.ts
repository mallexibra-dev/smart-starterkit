import { mysqlTable, serial, varchar, text, decimal, int, timestamp, mysqlEnum, index } from 'drizzle-orm/mysql-core';

export const categories = mysqlTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 191 }).notNull().unique(),
  description: text('description'),
  status: mysqlEnum('status', ['active', 'inactive']).notNull().default('active'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').onUpdateNow(),
}, (table) => ({
  nameIdx: index('idx_category_name').on(table.name),
}));

export const products = mysqlTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 191 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  stock: int('stock').notNull().default(0),
  categoryId: int('categoryId').references(() => categories.id, { onDelete: 'set null' }),
  sku: varchar('sku', { length: 100 }).unique(),
  status: mysqlEnum('status', ['active', 'inactive']).notNull().default('active'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').onUpdateNow(),
}, (table) => ({
  nameIdx: index('idx_product_name').on(table.name),
  skuIdx: index('idx_product_sku').on(table.sku),
  categoryIdx: index('idx_product_category').on(table.categoryId),
  statusIdx: index('idx_product_status').on(table.status),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// Custom types for API with price as number
export type CategoryAPI = Omit<Category, 'id' | 'created_at' | 'updated_at'> & {
  id: number;
  created_at: string;
  updated_at: string | null;
  products?: ProductAPI[];
};
export type ProductAPI = Omit<Product, 'price'> & {
  price: number;
  category?: CategoryAPI | null;
};
export type NewProductAPI = Omit<NewProduct, 'price' | 'id' | 'created_at' | 'updated_at'> & {
  price: number;
};