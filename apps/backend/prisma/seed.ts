import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear categorías
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electrónicos',
        slug: 'electronics',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: {
        name: 'Ropa',
        slug: 'clothing',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'books' },
      update: {},
      create: {
        name: 'Libros',
        slug: 'books',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home' },
      update: {},
      create: {
        name: 'Hogar',
        slug: 'home',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        name: 'Deportes',
        slug: 'sports',
      },
    }),
  ]);

  console.log('✅ Categorías creadas');

  // Datos de productos
  const productsData = [
    // Electrónicos
    {
      title: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'El iPhone más avanzado con chip A17 Pro',
      brand: 'Apple',
      categorySlug: 'electronics',
      variants: [
        {
          sku: 'IP15P-128-BLACK',
          price: 99900,
          stock: 50,
          images: ['https://example.com/iphone15pro-black.jpg'],
          specs: { color: 'Negro', storage: '128GB', ram: '8GB' },
        },
        {
          sku: 'IP15P-256-BLACK',
          price: 109900,
          stock: 30,
          images: ['https://example.com/iphone15pro-black.jpg'],
          specs: { color: 'Negro', storage: '256GB', ram: '8GB' },
        },
      ],
    },
    {
      title: 'MacBook Air M2',
      slug: 'macbook-air-m2',
      description: 'Portátil ultraligero con chip M2',
      brand: 'Apple',
      categorySlug: 'electronics',
      variants: [
        {
          sku: 'MBA-M2-256-SILVER',
          price: 119900,
          stock: 25,
          images: ['https://example.com/macbook-air-silver.jpg'],
          specs: { color: 'Plateado', storage: '256GB', ram: '8GB' },
        },
      ],
    },
    {
      title: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Flagship de Samsung con IA integrada',
      brand: 'Samsung',
      categorySlug: 'electronics',
      variants: [
        {
          sku: 'SGS24-128-BLACK',
          price: 89900,
          stock: 40,
          images: ['https://example.com/galaxy-s24-black.jpg'],
          specs: { color: 'Negro', storage: '128GB', ram: '8GB' },
        },
        {
          sku: 'SGS24-256-BLACK',
          price: 99900,
          stock: 35,
          images: ['https://example.com/galaxy-s24-black.jpg'],
          specs: { color: 'Negro', storage: '256GB', ram: '8GB' },
        },
      ],
    },
    // Ropa
    {
      title: 'Camiseta Básica',
      slug: 'camiseta-basica',
      description: 'Camiseta 100% algodón, cómoda y duradera',
      brand: 'BasicWear',
      categorySlug: 'clothing',
      variants: [
        {
          sku: 'CB-WHITE-S',
          price: 2500,
          stock: 100,
          images: ['https://example.com/camiseta-white-s.jpg'],
          specs: { color: 'Blanco', size: 'S', material: 'Algodón' },
        },
        {
          sku: 'CB-WHITE-M',
          price: 2500,
          stock: 120,
          images: ['https://example.com/camiseta-white-m.jpg'],
          specs: { color: 'Blanco', size: 'M', material: 'Algodón' },
        },
        {
          sku: 'CB-BLACK-L',
          price: 2500,
          stock: 80,
          images: ['https://example.com/camiseta-black-l.jpg'],
          specs: { color: 'Negro', size: 'L', material: 'Algodón' },
        },
      ],
    },
    {
      title: 'Jeans Slim Fit',
      slug: 'jeans-slim-fit',
      description: 'Jeans modernos con corte slim fit',
      brand: 'DenimCo',
      categorySlug: 'clothing',
      variants: [
        {
          sku: 'JSF-BLUE-30',
          price: 8900,
          stock: 60,
          images: ['https://example.com/jeans-blue-30.jpg'],
          specs: { color: 'Azul', waist: '30', length: '32', fit: 'Slim' },
        },
        {
          sku: 'JSF-BLUE-32',
          price: 8900,
          stock: 70,
          images: ['https://example.com/jeans-blue-32.jpg'],
          specs: { color: 'Azul', waist: '32', length: '32', fit: 'Slim' },
        },
      ],
    },
    // Libros
    {
      title: 'El Señor de los Anillos',
      slug: 'el-senor-de-los-anillos',
      description: 'Trilogía épica de fantasía',
      brand: 'Tolkien',
      categorySlug: 'books',
      variants: [
        {
          sku: 'ESDA-TRILOGY-HC',
          price: 4500,
          stock: 25,
          images: ['https://example.com/lotr-trilogy.jpg'],
          specs: { format: 'Tapa dura', pages: '1200', language: 'Español' },
        },
      ],
    },
    {
      title: 'Harry Potter y la Piedra Filosofal',
      slug: 'harry-potter-piedra-filosofal',
      description: 'Primera entrega de la saga de Harry Potter',
      brand: 'Rowling',
      categorySlug: 'books',
      variants: [
        {
          sku: 'HPPF-PB-ES',
          price: 1800,
          stock: 50,
          images: ['https://example.com/hp-philosophers-stone.jpg'],
          specs: { format: 'Tapa blanda', pages: '320', language: 'Español' },
        },
      ],
    },
    // Hogar
    {
      title: 'Cafetera Express',
      slug: 'cafetera-express',
      description: 'Cafetera automática para café espresso',
      brand: 'CoffeePro',
      categorySlug: 'home',
      variants: [
        {
          sku: 'CE-1000-BLACK',
          price: 15900,
          stock: 15,
          images: ['https://example.com/cafetera-black.jpg'],
          specs: { color: 'Negro', power: '1000W', capacity: '1.5L' },
        },
        {
          sku: 'CE-1000-SILVER',
          price: 15900,
          stock: 12,
          images: ['https://example.com/cafetera-silver.jpg'],
          specs: { color: 'Plateado', power: '1000W', capacity: '1.5L' },
        },
      ],
    },
    {
      title: 'Sofá 3 Plazas',
      slug: 'sofa-3-plazas',
      description: 'Sofá cómodo para sala de estar',
      brand: 'HomeComfort',
      categorySlug: 'home',
      variants: [
        {
          sku: 'S3P-GRAY',
          price: 45000,
          stock: 8,
          images: ['https://example.com/sofa-gray.jpg'],
          specs: { color: 'Gris', material: 'Tela', seats: '3' },
        },
      ],
    },
    // Deportes
    {
      title: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      description: 'Zapatillas deportivas con tecnología Air Max',
      brand: 'Nike',
      categorySlug: 'sports',
      variants: [
        {
          sku: 'NAM270-WHITE-42',
          price: 12900,
          stock: 30,
          images: ['https://example.com/nike-airmax-white.jpg'],
          specs: { color: 'Blanco', size: '42', type: 'Running' },
        },
        {
          sku: 'NAM270-BLACK-44',
          price: 12900,
          stock: 25,
          images: ['https://example.com/nike-airmax-black.jpg'],
          specs: { color: 'Negro', size: '44', type: 'Running' },
        },
      ],
    },
    {
      title: 'Pelota de Fútbol Profesional',
      slug: 'pelota-futbol-profesional',
      description: 'Pelota oficial para competiciones',
      brand: 'Adidas',
      categorySlug: 'sports',
      variants: [
        {
          sku: 'PFP-ADIDAS-5',
          price: 8900,
          stock: 40,
          images: ['https://example.com/adidas-ball.jpg'],
          specs: { size: '5', material: 'Sintético', weight: '420g' },
        },
      ],
    },
  ];

  // Crear productos y variantes
  for (const productData of productsData) {
    const category = categories.find(c => c.slug === productData.categorySlug);
    if (!category) continue;

    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        title: productData.title,
        slug: productData.slug,
        description: productData.description,
        brand: productData.brand,
        categoryId: category.id,
      },
    });

    for (const variantData of productData.variants) {
      await prisma.productVariant.upsert({
        where: { sku: variantData.sku },
        update: {},
        create: {
          sku: variantData.sku,
          price: variantData.price,
          stock: variantData.stock,
          images: variantData.images,
          specs: variantData.specs,
          productId: product.id,
        },
      });
    }
  }

  console.log('✅ Productos y variantes creados');
  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
