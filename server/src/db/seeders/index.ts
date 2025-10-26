import { seedUsers, clearUsers } from './users.seed';

export { seedUsers, clearUsers };

export async function seedDatabase() {
  console.log('🌱 Starting complete database seeding...');

  try {
    await seedUsers();
    console.log('🎉 Complete database seeding finished!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}

export async function clearDatabase() {
  console.log('🧹 Clearing all database tables...');

  try {
    await clearUsers();
    console.log('✅ All database tables cleared!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

// Jika dijalankan langsung
if (import.meta.main) {
  await seedDatabase();
  process.exit(0);
}