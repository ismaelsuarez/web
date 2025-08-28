import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useConfirmCheckout } from '../hooks/useCheckout';

const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  
  const confirmCheckoutMutation = useConfirmCheckout();

  useEffect(() => {
    const processPayment = async () => {
      if (!orderId) {
        setError('No se encontró información de la orden');
        setIsProcessing(false);
        return;
      }

      try {
        // Confirm the checkout with the backend
        await confirmCheckoutMutation.mutateAsync({
          orderId,
          paymentMethod: 'online',
        });

        setIsProcessing(false);
      } catch (error: any) {
        console.error('Error confirming checkout:', error);
        setError(error.message || 'Error al confirmar el pago');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [orderId, confirmCheckoutMutation]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Procesando pago...</h2>
          <p className="text-gray-600">Estamos confirmando tu pago con MercadoPago</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error en el pago</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/checkout')} className="w-full">
              Intentar nuevamente
            </Button>
            <Button onClick={() => navigate('/productos')} variant="secondary" className="w-full">
              Continuar comprando
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Pago exitoso!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. Recibirás un email de confirmación con los detalles de tu pedido.
        </p>

        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Número de orden:</span> {orderId}
            </p>
            {paymentId && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">ID de pago:</span> {paymentId}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button onClick={() => navigate('/productos')} className="w-full">
            Continuar comprando
          </Button>
          <Button onClick={() => navigate('/')} variant="secondary" className="w-full">
            Volver al inicio
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
