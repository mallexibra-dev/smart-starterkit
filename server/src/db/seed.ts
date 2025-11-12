import { db } from './index';
import { users } from './schema';
import { AuthService } from '../lib/auth';

const seedData = async () => {
  console.log('🌱 Starting database seeding...');

  try {
    // Check if there are existing users
    const existingUsers = await db.select().from(users).limit(1);

    if (existingUsers.length > 0) {
      console.log('✅ Database already has data. Skipping seeding.');
      return;
    }

    console.log('📝 Creating sample users...');

    // Sample users to seed
    const sampleUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await AuthService.hashPassword('admin123'),
        emailVerified: true,
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await AuthService.hashPassword('password123'),
        emailVerified: false,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await AuthService.hashPassword('password123'),
        emailVerified: true,
      },
      {
        name: 'Test User',
        email: 'test@example.com',
        password: await AuthService.hashPassword('test123'),
        emailVerified: false,
      },
    ];

    // Insert users
    for (const user of sampleUsers) {
      await db.insert(users).values(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    console.log('🎉 Database seeding completed successfully!');

    // Display created users
    const createdUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
    }).from(users);

    console.log('\n📋 Created Users:');
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - ${user.email} (Verified: ${user.emailVerified})`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

const resetDatabase = async () => {
  console.log('🔄 Resetting database...');

  try {
    // Delete all users
    await db.delete(users);
    console.log('✅ All users deleted');

    // Run seeding again
    await seedData();

  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

// Command line interface
const command = process.argv[2];

if (command === 'reset') {
  resetDatabase();
} else if (command === 'seed' || !command) {
  seedData();
} else {
  console.log('Usage:');
  console.log('  bun run seed          - Seed the database');
  console.log('  bun run seed reset   - Reset and seed the database');
  process.exit(1);
}