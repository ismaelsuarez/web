import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getProductStock(slug: string): Promise<number> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: { select: { stock: true } } },
  });
  if (!product) return -1;
  return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
}

export async function closeDb() {
  await prisma.$disconnect();
}


