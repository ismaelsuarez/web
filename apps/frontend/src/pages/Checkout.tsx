import React, { useState, useEffect } from 'react';
import { CreditCard, Truck, CheckCircle, MapPin } from 'lucide-react';
import { Button } from '@ecommerce/ui';
import { useCartStore } from '../stores/cartStore';
import { useShippingCost, useProvinces } from '../hooks/useShipping';
import { useCreatePayment, useConfirmCheckout } from '../hooks/useCheckout';
import type { ShippingAddress } from '../types/api';

export const Checkout: React.FC = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'offline'>('mercadopago');

  const { data: provinces } = useProvinces();
  const { data: shippingCost } = useShippingCost(selectedProvince, calculateTotalWeight());
  const createPaymentMutation = useCreatePayment();
  const confirmCheckoutMutation = useConfirmCheckout();

  function calculateTotalWeight(): number {
    return items.reduce((total, item) => {
      // Asumir peso promedio de 0.5kg por item
      return total + (item.quantity * 0.5);
    }, 0);
  }

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setShippingAddress(prev => ({ ...prev, province }));
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    if (!shippingCost) {
      alert('Por favor selecciona una provincia para calcular el envío');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'mercadopago') {
        // Crear pago con MercadoPago
        const result = await createPaymentMutation.mutateAsync(shippingAddress);
        if (result.data?.paymentUrl) {
          window.location.href = result.data.paymentUrl;
        }
      } else {
        // Pago offline - confirmar directamente
        const result = await confirmCheckoutMutation.mutateAsync({
          orderId: 1, // Esto debería venir del backend
          paymentMethod: 'offline',
          shippingAddress,
          shippingCost: shippingCost.cost,
        });
        
        setIsCompleted(true);
        clearCart();
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      alert('Error al procesar el pedido');
    } finally {
      setIsProcessing(false);
    }
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

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getTotal().toLocaleString()}</span>
            </div>
            {shippingCost && (
              <div className="flex justify-between">
                <span>Envío ({selectedProvince})</span>
                <span>${shippingCost.cost.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>${((getTotal() + (shippingCost?.cost || 0))).toLocaleString()}</span>
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
                  value={shippingAddress.firstName}
                  onChange={(e) => handleAddressChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  value={shippingAddress.lastName}
                  onChange={(e) => handleAddressChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={shippingAddress.address}
                onChange={(e) => handleAddressChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Calle y número"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu ciudad"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona una provincia</option>
                  {provinces?.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="CP"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu teléfono"
                  required
                />
              </div>
            </div>
          </form>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Método de Pago
            </h3>
            
            <div className="space-y-3">
              <div 
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${
                  paymentMethod === 'mercadopago' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('mercadopago')}
              >
                <CreditCard size={20} className="text-primary-600" />
                <span>MercadoPago (Tarjeta/Transferencia)</span>
              </div>
              
              <div 
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${
                  paymentMethod === 'offline' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('offline')}
              >
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
