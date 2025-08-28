import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { ProductCard } from '@ecommerce/ui';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useAddToCart } from '../hooks/useCart';
import type { Product, ProductVariant } from '../types/api';

export const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const addToCartMutation = useAddToCart();
  
  const { data, isLoading, error } = useProducts({
    q: searchQuery || undefined,
    category: selectedCategory || undefined,
    page: currentPage,
    limit: 12,
  } as any);

  const handleAddToCart = async (product: Product, variant: ProductVariant) => {
    if (isAuthenticated) {
      try {
        await addToCartMutation.mutateAsync({
          variantId: variant.id,
          quantity: 1,
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      addItem(product, variant);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-lg">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 text-lg mb-4">
          Error al cargar los productos
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const categories = [
    { slug: 'electronics', name: 'Electrónicos' },
    { slug: 'clothing', name: 'Ropa' },
    { slug: 'books', name: 'Libros' },
    { slug: 'home', name: 'Hogar' },
    { slug: 'sports', name: 'Deportes' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nuestros Productos
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explora nuestra amplia selección de productos de alta calidad
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Categorías:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.slug
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              
              <span className="px-3 py-2 text-gray-700">
                Página {currentPage} de {data.pagination.pages}
              </span>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === data.pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          )}

          {/* Results Info */}
          <div className="text-center text-gray-600">
            Mostrando {data.products.length} de {data.pagination.total} productos
          </div>
        </>
      )}

      {/* Empty State */}
      {data && data.products.length === 0 && (
        <div className="text-center py-20">
          <div className="text-gray-500 text-lg mb-4">
            No se encontraron productos
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setCurrentPage(1);
            }}
            className="btn-primary"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};
