import { db, users } from '../index';
import bcrypt from 'bcryptjs';

export async function seedUsers() {
  console.log('👥 Seeding users table...');

  try {
    await db.delete(users);

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users_data = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        emailVerified: true,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        emailVerified: true,
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: hashedPassword,
        emailVerified: false,
      },
      {
        name: 'Alice Brown',
        email: 'alice@example.com',
        password: hashedPassword,
        emailVerified: true,
      },
      {
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        password: hashedPassword,
        emailVerified: false,
      },
    ];

    const insertedUsers = await db.insert(users).values(users_data).returning();
    console.log(`✅ Created ${insertedUsers.length} users`);

    return insertedUsers;

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

export async function clearUsers() {
  console.log('🧹 Clearing users table...');
  await db.delete(users);
  console.log('✅ Users table cleared');
}

// Jika dijalankan langsung
if (import.meta.main) {
  await seedUsers();
  process.exit(0);
}