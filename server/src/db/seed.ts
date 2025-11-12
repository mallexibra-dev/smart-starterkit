import { categorySeeder } from './seeders/category.seed';
import { productSeeder } from './seeders/product.seed';

async function seed() {
  console.log('🚀 Starting database seeding...');

  try {
    // Seed categories first
    console.log('📦 Seeding categories...');
    await categorySeeder();

    // Then seed products (depends on categories)
    console.log('🛍️  Seeding products...');
    await productSeeder();

    console.log('🎉 All seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeder
seed();