export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  images: string[];
  specs: Record<string, any>;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description?: string;
  brand: string;
  createdAt: string;
  category: Category;
  variants: ProductVariant[];
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CartItem {
  variant: ProductVariant;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
