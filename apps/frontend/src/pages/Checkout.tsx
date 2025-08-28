import React, { useState } from 'react';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { Button } from '@ecommerce/ui';
import { useCartStore } from '../stores/cartStore';

export const Checkout: React.FC = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simular proceso de checkout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsCompleted(true);
    clearCart();
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white shadow rounded-lg p-8">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pedido Completado!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación pronto.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Continuar Comprando
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Resumen del Pedido
          </h2>
          
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.variant.id} className="flex items-center space-x-4">
                <img
                  src={item.variant.images[0]}
                  alt={item.product.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.product.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.variant.sku} - Cantidad: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${(item.variant.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${getTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Información de Envío
          </h2>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Calle y número"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu ciudad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="CP"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tu teléfono"
              />
            </div>
          </form>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Método de Pago
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <CreditCard size={20} className="text-primary-600" />
                <span>Tarjeta de Crédito/Débito</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <Truck size={20} className="text-primary-600" />
                <span>Contra Reembolso</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={isProcessing || items.length === 0}
            className="w-full mt-6"
          >
            {isProcessing ? 'Procesando...' : 'Completar Pedido'}
          </Button>
        </div>
      </div>
    </div>
  );
};
