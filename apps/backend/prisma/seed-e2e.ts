import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting E2E seed...');
  const dbUrl = process.env.DATABASE_URL || '';
  const masked = dbUrl.length > 16 ? dbUrl.slice(0, 16) + '***' : '***';
  console.log('🔗 DATABASE_URL:', masked);

  // Categoría base
  const category = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: { name: 'Electrónicos', slug: 'electronics' },
  });

  // Usuario de prueba
  const hashedPassword = await bcrypt.hash('Test1234', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: { password: hashedPassword, name: 'Usuario Test' },
    create: { email: 'testuser@example.com', password: hashedPassword, name: 'Usuario Test' },
  });

  // Productos esperados por E2E
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'notebook-gamer' },
      update: {},
      create: {
        title: 'Notebook Gamer Pro',
        slug: 'notebook-gamer',
        description: 'Potente notebook para gaming',
        brand: 'Test Brand',
        categoryId: category.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'mouse-wireless' },
      update: {},
      create: {
        title: 'Mouse Wireless Gaming',
        slug: 'mouse-wireless',
        description: 'Mouse gamer inalámbrico',
        brand: 'Test Brand',
        categoryId: category.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'keyboard-mechanical' },
      update: {},
      create: {
        title: 'Teclado Mecánico RGB',
        slug: 'keyboard-mechanical',
        description: 'Teclado con switches mecánicos',
        brand: 'Test Brand',
        categoryId: category.id,
      },
    }),
  ]);

  // Variantes (precios, stock e imágenes)
  await Promise.all([
    prisma.productVariant.upsert({
      where: { sku: 'NB-GAMER-001' },
      update: { price: 250000, stock: 8, images: ['https://example.com/notebook.jpg'], specs: { cpu: 'i7', ram: '16GB' } },
      create: {
        productId: products[0].id,
        sku: 'NB-GAMER-001',
        price: 250000,
        stock: 8,
        images: ['https://example.com/notebook.jpg'],
        specs: { cpu: 'i7', ram: '16GB' },
      },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'MOUSE-WL-001' },
      update: { price: 15000, stock: 25, images: ['https://example.com/mouse.jpg'], specs: { dpi: '16000', connectivity: '2.4G' } },
      create: {
        productId: products[1].id,
        sku: 'MOUSE-WL-001',
        price: 15000,
        stock: 25,
        images: ['https://example.com/mouse.jpg'],
        specs: { dpi: '16000', connectivity: '2.4G' },
      },
    }),
    prisma.productVariant.upsert({
      where: { sku: 'KB-RGB-001' },
      update: { price: 45000, stock: 15, images: ['https://example.com/keyboard.jpg'], specs: { switch: 'Blue', layout: 'ANSI' } },
      create: {
        productId: products[2].id,
        sku: 'KB-RGB-001',
        price: 45000,
        stock: 15,
        images: ['https://example.com/keyboard.jpg'],
        specs: { switch: 'Blue', layout: 'ANSI' },
      },
    }),
  ]);

  // Limpiar carritos del usuario de prueba (idempotente)
  await prisma.cart.deleteMany({ where: { userId: testUser.id } });

  // Verificaciones de conteo
  const [categoriesCount, productsCount, variantsCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.productVariant.count(),
  ]);
  console.log('📊 Seed counts -> categories:', categoriesCount, 'products:', productsCount, 'variants:', variantsCount);

  if (productsCount === 0) {
    console.error('❌ E2E seed completed but products count is 0');
    // Código 2 indica seed sin datos efectivos para que CI lo diferencie de errores inesperados
    process.exit(2);
  }

  console.log('✅ E2E seed completed');
}

main()
  .catch((e) => {
    console.error('❌ Error during E2E seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
