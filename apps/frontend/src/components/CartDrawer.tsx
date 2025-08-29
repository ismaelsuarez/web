import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  items: any[];
  onClose: () => void;
  onRemoveItem: (variantId: number) => void;
  onUpdateQuantity: (variantId: number, quantity: number) => void;
  onClearCart: () => void;
  total: number;
  itemCount: number;
  onCheckout: () => void;
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
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" data-testid="cart-drawer">
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
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.variant.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.variant.images[0] || '/placeholder.png'}
                      alt={item.variant.sku}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.variant.sku}</h3>
                      <p className="text-sm text-gray-600">{formatPrice(item.variant.price)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.variant.id, Math.max(0, item.quantity - 1))}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.variant.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.variant.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={onCheckout}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  data-testid="checkout-button"
                >
                  Proceder al Checkout
                </button>
                <button
                  onClick={onClearCart}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
