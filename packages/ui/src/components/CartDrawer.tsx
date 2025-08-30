import React from 'react';
import { X, Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from './Button';
import type { CartItem } from '../types/api';

export interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemoveItem: (variantId: number) => void;
  onUpdateQuantity: (variantId: number, quantity: number) => void;
  onClearCart: () => void;
  total: number;
  itemCount: number;
  onCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  total,
  itemCount,
  onCheckout,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Carrito ({itemCount})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.variant.id} className="flex gap-4 p-3 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.variant.images[0] || '/placeholder-product.jpg'}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {Object.entries(item.variant.specs)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.variant.price)}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveItem(item.variant.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.variant.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.variant.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(total)}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClearCart}
                  className="flex-1"
                >
                  Vaciar carrito
                </Button>
                <Button 
                  className="flex-1"
                  onClick={onCheckout}
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Finalizar compra
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
