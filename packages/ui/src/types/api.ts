export interface Category {
	id?: number;
	name: string;
	slug?: string;
}

export interface ProductVariant {
	id: number;
	sku: string;
	price: number;
	stock: number;
	images: string[];
	specs: Record<string, string>;
}

export interface Product {
	id: number;
	title: string;
	slug: string;
	description?: string;
	brand?: string;
	createdAt?: string;
	category: Category;
	variants: ProductVariant[];
}

export interface CartItem {
	product: Product;
	variant: ProductVariant;
	quantity: number;
}
