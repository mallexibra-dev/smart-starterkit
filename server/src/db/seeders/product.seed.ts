import { db } from '../index';
import { products, categories } from '../schema';

export const productSeeder = async () => {
  console.log('🌱 Seeding products...');

  try {
    // Get categories from database
    const categoryResults = await db.select().from(categories);
    const categoryMap = categoryResults.reduce((acc, cat) => {
      acc[cat.name] = cat.id;
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(categoryMap).length === 0) {
      throw new Error('No active categories found. Please seed categories first.');
    }

    const sampleProducts = [
      {
        name: 'Laptop Gaming ASUS ROG',
        description: 'High performance gaming laptop with RTX 4060, Intel Core i7, 16GB RAM',
        price: '15000000.00',
        stock: 25,
        categoryId: categoryMap['Electronics'] || null,
        sku: 'ASUS-ROG-001',
        status: 'active' as const,
      },
      {
        name: 'Wireless Mouse Logitech',
        description: 'Ergonomic wireless mouse with long battery life',
        price: '250000.00',
        stock: 100,
        categoryId: categoryMap['Electronics'] || null,
        sku: 'LOGI-MOUSE-001',
        status: 'active' as const,
      },
      {
        name: 'Mechanical Keyboard RGB',
        description: 'Gaming mechanical keyboard with RGB backlighting',
        price: '850000.00',
        stock: 50,
        categoryId: categoryMap['Electronics'] || null,
        sku: 'MECH-KB-001',
        status: 'active' as const,
      },
      {
        name: 'USB-C Hub 7-in-1',
        description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader',
        price: '450000.00',
        stock: 75,
        categoryId: categoryMap['Electronics'] || null,
        sku: 'HUB-USB7-001',
        status: 'active' as const,
      },
      {
        name: 'Monitor 27" 4K',
        description: '4K IPS monitor with HDR support and 60Hz refresh rate',
        price: '5500000.00',
        stock: 15,
        categoryId: categoryMap['Electronics'] || null,
        sku: 'MON-4K-001',
        status: 'active' as const,
      },
      {
        name: 'Desk Lamp LED',
        description: 'Adjustable LED desk lamp with touch controls',
        price: '320000.00',
        stock: 0,
        categoryId: categoryMap['Home & Garden'] || null,
        sku: 'LAMP-LED-001',
        status: 'inactive' as const,
      },
      {
        name: 'Webcam HD 1080p',
        description: 'Full HD webcam with auto-focus and noise cancellation',
        price: '680000.00',
        stock: 30,
        categoryId: categoryMap['Electronics'] || null,
        sku: 'CAM-HD-001',
        status: 'active' as const,
      },
      {
        name: 'Headphones Bluetooth',
        description: 'Wireless headphones with active noise cancellation',
        price: '1200000.00',
        stock: 45,
        categoryId: categoryMap['Electronics'] || null,
        sku: 'HP-BT-001',
        status: 'active' as const,
      },
      {
        name: 'External SSD 1TB',
        description: 'Portable external SSD with USB-C connectivity',
        price: '990000.00',
        stock: 60,
        categoryId: categoryMap['Electronics'] || null,
        sku: 'SSD-1TB-001',
        status: 'active' as const,
      },
      {
        name: 'Gaming Chair',
        description: 'Ergonomic gaming chair with lumbar support',
        price: '2200000.00',
        stock: 10,
        categoryId: categoryMap['Furniture'] || null,
        sku: 'CHAIR-GAME-001',
        status: 'active' as const,
      },
      {
        name: 'Office Desk Wooden',
        description: 'Solid wood office desk with storage drawers',
        price: '1800000.00',
        stock: 12,
        categoryId: categoryMap['Furniture'] || null,
        sku: 'DESK-WOOD-001',
        status: 'active' as const,
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Non-slip exercise yoga mat with carrying strap',
        price: '250000.00',
        stock: 35,
        categoryId: categoryMap['Sports'] || null,
        sku: 'YOGA-MAT-001',
        status: 'active' as const,
      },
      {
        name: 'Smartphone Android',
        description: 'Latest Android smartphone with 5G capability and triple camera',
        price: '8500000.00',
        stock: 40,
        categoryId: categoryMap['Electronics'] || null,
        sku: 'PHONE-AND-001',
        status: 'active' as const,
      },
      {
        name: 'Office Chair Mesh',
        description: 'Breathable mesh office chair with adjustable height',
        price: '950000.00',
        stock: 25,
        categoryId: categoryMap['Furniture'] || null,
        sku: 'CHAIR-MESH-001',
        status: 'active' as const,
      },
      {
        name: 'Dumbbell Set 20kg',
        description: 'Adjustable dumbbell set with weight plates and storage rack',
        price: '750000.00',
        stock: 20,
        categoryId: categoryMap['Sports'] || null,
        sku: 'DUMB-20KG-001',
        status: 'active' as const,
      },
      {
        name: 'Programming Book Collection',
        description: 'Set of 5 essential programming books for beginners',
        price: '450000.00',
        stock: 15,
        categoryId: categoryMap['Books'] || null,
        sku: 'BOOKS-PROG-001',
        status: 'active' as const,
      },
    ];

    // Clear existing products
    await db.delete(products);

    // Insert products
    await db.insert(products).values(sampleProducts);
    console.log(`✅ Successfully seeded ${sampleProducts.length} products`);
    return true;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};