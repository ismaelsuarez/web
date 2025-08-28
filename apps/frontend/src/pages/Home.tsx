import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bienvenido a{' '}
            <span className="text-primary-600">Ecommerce</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubre nuestra amplia selección de productos de alta calidad. 
            Desde electrónicos hasta ropa, tenemos todo lo que necesitas.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/productos">
              <Button size="lg">
                Ver Productos
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Saber Más
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚚</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Envío Gratis
          </h3>
          <p className="text-gray-600">
            Envío gratis en pedidos superiores a $50.000
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Garantía
          </h3>
          <p className="text-gray-600">
            30 días de garantía en todos nuestros productos
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Soporte 24/7
          </h3>
          <p className="text-gray-600">
            Atención al cliente disponible las 24 horas
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gray-900 rounded-2xl text-white">
        <h2 className="text-3xl font-bold mb-4">
          ¿Listo para empezar?
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Explora nuestra colección y encuentra los mejores productos 
          al mejor precio.
        </p>
        <Link to="/productos">
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
            Comenzar a Comprar
          </Button>
        </Link>
      </section>
    </div>
  );
};
