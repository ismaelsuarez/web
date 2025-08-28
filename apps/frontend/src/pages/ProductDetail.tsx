import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@ecommerce/ui';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useAddToCart } from '../hooks/useCart';
import type { ProductVariant } from '../types/api';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const addToCartMutation = useAddToCart();
  
  const { data: product, isLoading, error } = useProduct(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-lg">Cargando producto...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 text-lg mb-4">
          Error al cargar el producto
        </div>
        <Link to="/productos">
          <Button>Volver a productos</Button>
        </Link>
      </div>
    );
  }

  // Set default selected variant if none selected
  if (!selectedVariant && product.variants.length > 0) {
    setSelectedVariant(product.variants[0] || null);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (selectedVariant) {
      if (isAuthenticated) {
        try {
          await addToCartMutation.mutateAsync({
            variantId: selectedVariant.id,
            quantity,
          });
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      } else {
        addItem(product, selectedVariant, quantity);
      }
    }
  };

  const currentImages = selectedVariant?.images || [];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-700">Inicio</Link>
        <span>/</span>
        <Link to="/productos" className="hover:text-gray-700">Productos</Link>
        <span>/</span>
        <span className="text-gray-900">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={currentImages[selectedImage] || '/placeholder-product.jpg'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Images */}
          {currentImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {currentImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-gray-500 mb-4">
              {product.brand} • {product.category.name}
            </p>
            {selectedVariant && (
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {formatPrice(selectedVariant.price)}
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Descripción
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Variants */}
          {product.variants.length > 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Variantes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setSelectedImage(0);
                    }}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {Object.entries(variant.specs)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      Stock: {variant.stock}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatPrice(variant.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          {selectedVariant && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Cantidad:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={selectedVariant.stock === 0}
                className="w-full"
                size="lg"
              >
                {selectedVariant.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </Button>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck size={16} />
              <span>Envío gratis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield size={16} />
              <span>Garantía 30 días</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RotateCcw size={16} />
              <span>Devolución fácil</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star size={16} />
              <span>Calidad premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {selectedVariant && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Especificaciones
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(selectedVariant.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700 capitalize">
                  {key}:
                </span>
                <span className="text-gray-900">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
