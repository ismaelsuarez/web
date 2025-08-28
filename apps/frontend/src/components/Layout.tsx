import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { CartDrawer } from '@ecommerce/ui';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '../hooks/useCart';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';
import { useLogout } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();
  const {
    items: localItems,
    isOpen,
    toggleCart,
    closeCart,
    removeItem: removeLocalItem,
    updateQuantity: updateLocalQuantity,
    clearCart: clearLocalCart,
    syncWithBackend,
    setSyncing,
    getTotal,
    getItemCount,
  } = useCartStore();

  // Backend cart hooks
  const { data: backendCart, isLoading: isLoadingCart } = useCart();
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  // Sincronizar carrito local con backend cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && backendCart && !isLoadingCart) {
      syncWithBackend(backendCart.items);
    }
  }, [isAuthenticated, backendCart, isLoadingCart, syncWithBackend]);

  // Funciones que manejan tanto el carrito local como el backend
  const handleAddItem = async (product: any, variant: any, quantity: number) => {
    if (isAuthenticated) {
      try {
        setSyncing(true);
        await addToCartMutation.mutateAsync({
          variantId: variant.id,
          quantity,
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setSyncing(false);
      }
    } else {
      // Carrito local para usuarios no autenticados
      const existingItem = localItems.find(item => item.variant.id === variant.id);
      if (existingItem) {
        updateLocalQuantity(variant.id, existingItem.quantity + quantity);
      } else {
        // Agregar nuevo item al carrito local
        const newItem = {
          variant,
          product,
          quantity,
        };
        // Simular agregar al carrito local
        // En una implementación real, esto se manejaría en el store
      }
    }
  };

  const handleRemoveItem = async (variantId: number) => {
    if (isAuthenticated) {
      try {
        setSyncing(true);
        const item = localItems.find(item => item.variant.id === variantId);
        if (item?.id) {
          await removeCartItemMutation.mutateAsync(item.id);
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      } finally {
        setSyncing(false);
      }
    } else {
      removeLocalItem(variantId);
    }
  };

  const handleUpdateQuantity = async (variantId: number, quantity: number) => {
    if (isAuthenticated) {
      try {
        setSyncing(true);
        const item = localItems.find(item => item.variant.id === variantId);
        if (item?.id) {
          await updateCartItemMutation.mutateAsync({
            itemId: item.id,
            data: { quantity },
          });
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      } finally {
        setSyncing(false);
      }
    } else {
      updateLocalQuantity(variantId, quantity);
    }
  };

  const handleClearCart = async () => {
    if (isAuthenticated) {
      try {
        setSyncing(true);
        await clearCartMutation.mutateAsync();
      } catch (error) {
        console.error('Error clearing cart:', error);
      } finally {
        setSyncing(false);
      }
    } else {
      clearLocalCart();
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-gray-900">
              🛍️ Ecommerce
            </Link>
            
            <nav className="flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Productos
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/perfil"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Perfil
                  </Link>
                  <Link
                    to="/checkout"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Checkout
                  </Link>
                </>
              )}
              
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ShoppingCart size={24} />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </button>

              {/* Auth buttons */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Hola, {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
                                   ) : (
                       <div className="flex items-center space-x-2">
                         <button
                           onClick={() => setShowLoginModal(true)}
                           className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                         >
                           Iniciar Sesión
                         </button>
                         <button
                           onClick={() => setShowRegisterModal(true)}
                           className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                         >
                           Registrarse
                         </button>
                       </div>
                     )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isOpen}
        items={localItems}
        onClose={closeCart}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        total={getTotal()}
        itemCount={getItemCount()}
        onCheckout={() => {
          closeCart();
          window.location.href = '/checkout';
        }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
};
