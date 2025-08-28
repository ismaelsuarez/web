import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useCreatePayment, useShippingCost, useProvinces, useMercadoPago, type ShippingAddress } from '../hooks/useCheckout';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MapPin, CreditCard, CheckCircle } from 'lucide-react';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { data: provinces } = useProvinces();
  const { redirectToPayment } = useMercadoPago();
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    streetNumber: '',
    zipCode: '',
    city: '',
    province: '',
    shippingCost: 0,
  });

  const [selectedProvince, setSelectedProvince] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');

  // Calculate total weight for shipping (default 0.5kg per item)
  const totalWeight = items.reduce((weight, item) => weight + 0.5 * item.quantity, 0);

  // Get shipping cost
  const { data: shippingData } = useShippingCost(selectedProvince, totalWeight);

  // Update shipping cost when province or weight changes
  useEffect(() => {
    if (shippingData?.cost !== undefined) {
      setShippingAddress(prev => ({
        ...prev,
        shippingCost: shippingData.cost,
      }));
    }
  }, [shippingData]);

  const createPaymentMutation = useCreatePayment();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/productos');
    }
  }, [items, navigate]);

  const handleInputChange = (field: keyof ShippingAddress, value: string | number) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setShippingAddress(prev => ({
      ...prev,
      province,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Debes estar autenticado para realizar el pago');
      return;
    }

    if (items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Validate required fields
    const requiredFields: (keyof ShippingAddress)[] = ['fullName', 'email', 'phone', 'street', 'streetNumber', 'zipCode', 'city', 'province'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    
    if (missingFields.length > 0) {
      alert(`Por favor completa los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }

    try {
      if (paymentMethod === 'online') {
        // Create MercadoPago payment
        const result = await createPaymentMutation.mutateAsync(shippingAddress);
        
        // Redirect to MercadoPago
        await redirectToPayment(result.paymentUrl);
      } else {
        // Handle offline payment
        alert('Para pagos offline, contacta con el administrador');
      }
    } catch (error: any) {
      console.error('Error creating payment:', error);
      alert(error.message || 'Error al crear el pago');
    }
  };

  const subtotal = getTotal();
  const total = subtotal + shippingAddress.shippingCost;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso requerido</h2>
          <p className="text-gray-600 mb-4">Debes iniciar sesión para continuar con el checkout</p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Completa tu información para finalizar la compra</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.variant.id}`} className="flex justify-between items-center">
                                         <div>
                       <p className="font-medium">{item.product.title}</p>
                       <p className="text-sm text-gray-600">{item.variant.sku}</p>
                       <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                     </div>
                    <p className="font-medium">${item.variant.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>${shippingAddress.shippingCost}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold">Dirección de envío</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provincia *
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecciona una provincia</option>
                      {provinces?.map((province: string) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calle *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.streetNumber}
                      onChange={(e) => handleInputChange('streetNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código postal *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold">Método de pago</h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'online' | 'offline')}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium">MercadoPago (Online)</span>
                      <p className="text-sm text-gray-600">Paga de forma segura con tarjeta, transferencia o efectivo</p>
                    </div>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="offline"
                      checked={paymentMethod === 'offline'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'online' | 'offline')}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium">Pago offline</span>
                      <p className="text-sm text-gray-600">Contacta con el administrador para coordinar el pago</p>
                    </div>
                  </label>
                </div>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={createPaymentMutation.isPending}
                  className="flex items-center"
                >
                  {createPaymentMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Finalizar compra - ${total}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
