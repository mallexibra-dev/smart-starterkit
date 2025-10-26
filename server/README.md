# Server - Hono + Drizzle ORM

Backend server menggunakan Hono framework dengan PostgreSQL database melalui Drizzle ORM.

## 🏗️ Struktur

```
src/
├── db/
│   ├── index.ts     # Database connection
│   ├── schema.ts    # Table definitions
│   └── drizzle/     # Migration files
├── routes/          # API routes
├── middlewares/     # Custom middlewares
└── index.ts         # App entry point
```

## 🚀 Setup

### 1. Environment
```bash
# Copy environment file
cp .env.example .env.local

# Edit DATABASE_URL
DATABASE_URL=postgresql://app_user:app_password@localhost:5432/smart_starterkit
```

### 2. Database
```bash
# Start PostgreSQL
docker run -d --name postgres \
  -e POSTGRES_DB=smart_starterkit \
  -e POSTGRES_USER=app_user \
  -e POSTGRES_PASSWORD=app_password \
  -p 5432:5432 \
  postgres:16

# Run migrations
bun run db:migrate
```

### 3. Start Server
```bash
bun run dev
```

## 📝 Database Usage

### Schema
File `src/db/schema.ts` mendefinisikan tabel:
- `users` - User data
- `categories` - Categories
- `items` - Items with categories

### Basic CRUD
```typescript
import { db, users, type User, type NewUser } from '../db';

// CREATE
const [newUser] = await db.insert(users).values({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed_password',
}).returning();

// READ
const [user] = await db.select().from(users)
  .where(eq(users.id, 1)).limit(1);

const allUsers = await db.select().from(users);

// UPDATE
const [updatedUser] = await db.update(users)
  .set({ name: 'Jane Doe' })
  .where(eq(users.id, 1))
  .returning();

// DELETE
const [deletedUser] = await db.delete(users)
  .where(eq(users.id, 1))
  .returning();
```

### Advanced Queries
```typescript
import { eq, like, and, or } from 'drizzle-orm';

// JOIN
const userItems = await db
  .select({
    userName: users.name,
    itemName: items.name,
  })
  .from(users)
  .leftJoin(items, eq(users.id, items.userId));

// Complex WHERE
const searchResults = await db
  .select()
  .from(items)
  .where(and(
    eq(items.active, true),
    like(items.name, '%search%')
  ));
```

## 🔄 Migrations

### Add New Table
1. Edit `src/db/schema.ts` tambahkan table definition
2. Generate migration: `bun run db:generate`
3. Run migration: `bun run db:migrate`

### Commands
```bash
bun run db:generate  # Generate migration file
bun run db:migrate    # Run migrations
bun run db:studio     # Database GUI (http://localhost:3000)
```

## 🛠️ Available Scripts

```bash
bun run dev           # Start development server
bun run build         # Build for production
bun run test          # Run tests
bun run lint          # ESLint

# Database
bun run db:generate   # Generate migrations
bun run db:migrate     # Run migrations
bun run db:studio      # Database GUI
```

## 📚 References

- [Drizzle ORM](https://orm.drizzle.team/)
- [Hono Framework](https://hono.dev/)
- [PostgreSQL](https://www.postgresql.org/)