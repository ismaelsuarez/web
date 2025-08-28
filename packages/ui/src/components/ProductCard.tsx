import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import type { Product, ProductVariant } from '../../../apps/frontend/src/types/api';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, variant: ProductVariant) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  className = '',
}) => {
  const cheapestVariant = product.variants.reduce((min, variant) =>
    variant.price < min.price ? variant : min
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={cheapestVariant.images[0] || '/placeholder-product.jpg'}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category.name}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 flex-1 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(cheapestVariant.price)}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {cheapestVariant.stock}
            </span>
          </div>
          
          {onAddToCart && (
            <Button
              onClick={() => onAddToCart(product, cheapestVariant)}
              disabled={cheapestVariant.stock === 0}
              className="w-full"
            >
              {cheapestVariant.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
