import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './Card';
import { Button } from './Button';

interface ProductCardProps {
  product: any;
  onAddToCart: (product: any, variant: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  // Obtener el precio más bajo y stock más bajo de las variantes
  const lowestPrice = Math.min(...product.variants.map((v: any) => v.price));
  const lowestStock = Math.min(...product.variants.map((v: any) => v.stock));
  const hasStock = lowestStock > 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/productos/${product.id}`}>
        <img
          src={product.variants[0]?.images[0] || '/placeholder.png'}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category.name}
          </span>
        </div>
        
        <Link to={`/productos/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        
        {product.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(lowestPrice)}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {lowestStock}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Link 
            to={`/productos/${product.id}`}
            className="flex-1"
          >
            <Button 
              variant="outline" 
              className="w-full"
            >
              Ver detalles
            </Button>
          </Link>
          
          <Button
            onClick={() => onAddToCart(product, product.variants[0])}
            disabled={!hasStock}
            className="flex-1"
          >
            {hasStock ? 'Agregar al carrito' : 'Sin stock'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
