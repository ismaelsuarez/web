import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data relevant for E2E (idempotent for CI)
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});

  // Create categories
  const category = await prisma.category.create({
    data: { name: 'Electrónicos', slug: 'electronics' },
  });

  // Create 3 seed products matching E2E expectations
  const products = [
    {
      title: 'Notebook Gamer Pro',
      slug: 'notebook-gamer',
      description: 'Potente notebook para gaming',
      brand: 'Test Brand',
      variants: [
        {
          sku: 'NB-GAMER-001',
          price: 250000,
          stock: 8,
          images: ['https://example.com/notebook.jpg'],
          specs: { cpu: 'i7', ram: '16GB' },
        },
      ],
    },
    {
      title: 'Mouse Wireless Gaming',
      slug: 'mouse-wireless',
      description: 'Mouse gamer inalámbrico',
      brand: 'Test Brand',
      variants: [
        {
          sku: 'MOUSE-WL-001',
          price: 15000,
          stock: 25,
          images: ['https://example.com/mouse.jpg'],
          specs: { dpi: '16000', connectivity: '2.4G' },
        },
      ],
    },
    {
      title: 'Teclado Mecánico RGB',
      slug: 'keyboard-mechanical',
      description: 'Teclado con switches mecánicos',
      brand: 'Test Brand',
      variants: [
        {
          sku: 'KB-RGB-001',
          price: 45000,
          stock: 15,
          images: ['https://example.com/keyboard.jpg'],
          specs: { switch: 'Blue', layout: 'ANSI' },
        },
      ],
    },
  ];

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        brand: p.brand,
        categoryId: category.id,
      },
    });
    for (const v of p.variants) {
      await prisma.productVariant.create({
        data: {
          sku: v.sku,
          price: v.price,
          stock: v.stock,
          images: v.images,
          specs: v.specs as any,
          productId: product.id,
        },
      });
    }
  }

  // Create test user expected by E2E
  const hashed = await bcrypt.hash('Test1234', 10);
  await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      password: hashed,
      name: 'Usuario Test',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.log('✅ Seed E2E completado');
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting E2E seed...');

  // Crear categorías básicas si no existen
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'computers' },
      update: {},
      create: {
        name: 'Computers',
        slug: 'computers',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
      },
    }),
  ]);

  console.log('✅ Categories created/updated');

  // Usuario de prueba para E2E
  const hashedPassword = await bcrypt.hash('Test1234', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {
      password: hashedPassword,
      name: 'Usuario Test',
    },
    create: {
      email: 'testuser@example.com',
      password: hashedPassword,
      name: 'Usuario Test',
    },
  });

  console.log('✅ Test user created/updated:', testUser.email);

  // Productos fake para E2E
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'notebook-gamer' },
      update: {},
      create: {
        title: 'Notebook Gamer Pro',
        slug: 'notebook-gamer',
        description: 'Potente notebook para gaming con gráficos dedicados',
        brand: 'GamingTech',
        categoryId: categories[1].id, // Computers
      },
    }),
    prisma.product.upsert({
      where: { slug: 'mouse-wireless' },
      update: {},
      create: {
        title: 'Mouse Wireless Gaming',
        slug: 'mouse-wireless',
        description: 'Mouse inalámbrico con sensor óptico de alta precisión',
        brand: 'TechMouse',
        categoryId: categories[2].id, // Accessories
      },
    }),
    prisma.product.upsert({
      where: { slug: 'keyboard-mechanical' },
      update: {},
      create: {
        title: 'Teclado Mecánico RGB',
        slug: 'keyboard-mechanical',
        description: 'Teclado mecánico con switches Cherry MX y iluminación RGB',
        brand: 'MechKeys',
        categoryId: categories[2].id, // Accessories
      },
    }),
  ]);

  console.log('✅ Products created/updated');

  // Variantes de productos con stock y precios
  const variants = await Promise.all([
    // Notebook Gamer - Variantes
    prisma.productVariant.upsert({
      where: {
        sku: 'NB-GAMER-001'
      },
      update: {
        price: 250000, // $250,000 ARS
        stock: 8,
        images: ['https://via.placeholder.com/400x300/2563eb/ffffff?text=Notebook+Gamer'],
        specs: { ram: '16GB', storage: '512GB SSD', gpu: 'RTX 3060' },
      },
      create: {
        productId: products[0].id,
        sku: 'NB-GAMER-001',
        price: 250000,
        stock: 8,
        images: ['https://via.placeholder.com/400x300/2563eb/ffffff?text=Notebook+Gamer'],
        specs: { ram: '16GB', storage: '512GB SSD', gpu: 'RTX 3060' },
      },
    }),
    prisma.productVariant.upsert({
      where: {
        sku: 'NB-GAMER-002'
      },
      update: {
        price: 350000, // $350,000 ARS
        stock: 5,
        images: ['https://via.placeholder.com/400x300/2563eb/ffffff?text=Notebook+Gamer+Pro'],
        specs: { ram: '32GB', storage: '1TB SSD', gpu: 'RTX 4070' },
      },
      create: {
        productId: products[0].id,
        sku: 'NB-GAMER-002',
        price: 350000,
        stock: 5,
        images: ['https://via.placeholder.com/400x300/2563eb/ffffff?text=Notebook+Gamer+Pro'],
        specs: { ram: '32GB', storage: '1TB SSD', gpu: 'RTX 4070' },
      },
    }),
    // Mouse Wireless - Variantes
    prisma.productVariant.upsert({
      where: {
        sku: 'MOUSE-001'
      },
      update: {
        price: 15000, // $15,000 ARS
        stock: 25,
        images: ['https://via.placeholder.com/400x300/059669/ffffff?text=Mouse+Wireless'],
        specs: { dpi: '12000', buttons: '6', wireless: true },
      },
      create: {
        productId: products[1].id,
        sku: 'MOUSE-001',
        price: 15000,
        stock: 25,
        images: ['https://via.placeholder.com/400x300/059669/ffffff?text=Mouse+Wireless'],
        specs: { dpi: '12000', buttons: '6', wireless: true },
      },
    }),
    // Keyboard Mechanical - Variantes
    prisma.productVariant.upsert({
      where: {
        sku: 'KB-MECH-001'
      },
      update: {
        price: 45000, // $45,000 ARS
        stock: 15,
        images: ['https://via.placeholder.com/400x300/dc2626/ffffff?text=Keyboard+Mechanical'],
        specs: { switches: 'Cherry MX Red', rgb: true, layout: 'Full Size' },
      },
      create: {
        productId: products[2].id,
        sku: 'KB-MECH-001',
        price: 45000,
        stock: 15,
        images: ['https://via.placeholder.com/400x300/dc2626/ffffff?text=Keyboard+Mechanical'],
        specs: { switches: 'Cherry MX Red', rgb: true, layout: 'Full Size' },
      },
    }),
  ]);

  console.log('✅ Product variants created/updated');

  // Limpiar carritos existentes del usuario de prueba
  await prisma.cart.deleteMany({
    where: { userId: testUser.id },
  });

  console.log('✅ Cleaned existing test user carts');

  console.log('🎉 E2E seed completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Variants: ${variants.length}`);
  console.log(`   - Test User: ${testUser.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during E2E seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
