import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const CheckoutFailure: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  const getErrorMessage = () => {
    switch (status) {
      case 'rejected':
        return 'Tu pago fue rechazado. Por favor, intenta con otro método de pago.';
      case 'cancelled':
        return 'El pago fue cancelado. Puedes intentar nuevamente cuando quieras.';
      case 'pending':
        return 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.';
      default:
        return 'Hubo un problema con tu pago. Por favor, intenta nuevamente.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pago no completado
        </h1>
        
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>

        {(orderId || paymentId) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            {orderId && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Número de orden:</span> {orderId}
              </p>
            )}
            {paymentId && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">ID de pago:</span> {paymentId}
              </p>
            )}
            {status && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Estado:</span> {status}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button onClick={() => navigate('/checkout')} className="w-full">
            Intentar nuevamente
          </Button>
          <Button onClick={() => navigate('/productos')} variant="secondary" className="w-full">
            Continuar comprando
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" className="w-full">
            Volver al inicio
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Si tienes problemas con el pago, contacta con nuestro soporte técnico.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutFailure;
