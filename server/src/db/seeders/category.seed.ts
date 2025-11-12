import { db } from '../index';
import { categories } from '../schema';

export const categorySeeder = async () => {
  console.log('🌱 Seeding categories...');

  const sampleCategories = [
    {
      name: 'Electronics',
      description: 'Electronic devices and gadgets including computers, phones, and accessories',
      status: 'active' as const,
    },
    {
      name: 'Furniture',
      description: 'Office and home furniture including desks, chairs, and storage solutions',
      status: 'active' as const,
    },
    {
      name: 'Books',
      description: 'Books, magazines, and educational materials',
      status: 'active' as const,
    },
    {
      name: 'Clothing',
      description: 'Apparel and fashion items for all ages',
      status: 'active' as const,
    },
    {
      name: 'Sports',
      description: 'Sports equipment, fitness gear, and outdoor accessories',
      status: 'active' as const,
    },
    {
      name: 'Home & Garden',
      description: 'Home improvement, gardening tools, and household items',
      status: 'inactive' as const,
    },
    {
      name: 'Toys & Games',
      description: 'Children toys, board games, and entertainment products',
      status: 'active' as const,
    },
    {
      name: 'Food & Beverages',
      description: 'Food items, drinks, and kitchen supplies',
      status: 'active' as const,
    },
  ];

  try {
    // Clear existing categories
    await db.delete(categories);

    // Insert categories
    await db.insert(categories).values(sampleCategories);
    console.log(`✅ Successfully seeded ${sampleCategories.length} categories`);
    return true;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};