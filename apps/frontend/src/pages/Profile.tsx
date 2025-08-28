import React from 'react';
import { User, LogOut, ShoppingBag, Package } from 'lucide-react';
import { Button } from '@ecommerce/ui';
import { useAuthStore } from '../stores/authStore';
import { useLogout } from '../hooks/useAuth';

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.name || 'Usuario'}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <ShoppingBag size={24} className="text-primary-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Mis Compras</h3>
                  <p className="text-sm text-gray-600">Historial de pedidos</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Package size={24} className="text-primary-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Favoritos</h3>
                  <p className="text-sm text-gray-600">Productos guardados</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <User size={24} className="text-primary-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Datos Personales</h3>
                  <p className="text-sm text-gray-600">Editar información</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Acciones de Cuenta
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => {/* TODO: Implementar edición de perfil */}}
                className="w-full justify-start"
              >
                <User size={20} className="mr-2" />
                Editar Perfil
              </Button>

              <Button
                variant="outline"
                onClick={() => {/* TODO: Implementar cambio de contraseña */}}
                className="w-full justify-start"
              >
                <LogOut size={20} className="mr-2" />
                Cambiar Contraseña
              </Button>

              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="w-full justify-start text-red-600 hover:text-red-700"
              >
                <LogOut size={20} className="mr-2" />
                {logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
