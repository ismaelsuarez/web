# 🛒 Flujo de Carrito con Autenticación

## 📋 Resumen

Sistema de carrito híbrido que maneja tanto usuarios autenticados como anónimos, con sincronización automática entre frontend y backend.

## 🔄 Flujo de Funcionamiento

### 1. **Usuario No Autenticado**
- **Carrito Local**: Se almacena en localStorage usando Zustand
- **Persistencia**: Los items persisten entre sesiones del navegador
- **Funcionalidad**: Agregar, remover, actualizar cantidades
- **Limitaciones**: No se sincroniza con el backend

### 2. **Usuario Autenticado**
- **Carrito Backend**: Se almacena en la base de datos PostgreSQL
- **Sincronización**: Se sincroniza automáticamente al hacer login
- **Validación de Stock**: Se verifica disponibilidad en tiempo real
- **Persistencia**: Los items persisten entre dispositivos

## 🚀 Endpoints del Backend

### `GET /api/cart`
- **Descripción**: Obtiene el carrito del usuario
- **Autenticación**: Requerida (simulada con userId = 1)
- **Respuesta**: 
  ```json
  {
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "variant": { ... },
        "product": { ... }
      }
    ],
    "total": 50000,
    "itemCount": 2
  }
  ```

### `POST /api/cart`
- **Descripción**: Agrega item al carrito
- **Body**:
  ```json
  {
    "variantId": 1,
    "quantity": 2
  }
  ```
- **Validaciones**: Stock disponible, variante existe

### `PUT /api/cart/item/:id`
- **Descripción**: Actualiza cantidad de un item
- **Body**:
  ```json
  {
    "quantity": 3
  }
  ```

### `DELETE /api/cart/item/:id`
- **Descripción**: Elimina item del carrito

### `DELETE /api/cart`
- **Descripción**: Vacía todo el carrito

## 🔐 Sistema de Autenticación

### Simulación Actual
- **Login**: Cualquier email válido
- **Usuario**: Se crea automáticamente con ID = 1
- **Persistencia**: Se mantiene en localStorage

### Implementación Real (Futuro)
- JWT tokens
- Refresh tokens
- Middleware de autenticación
- Validación de permisos

## 📱 Flujo en el Frontend

### 1. **Inicio de Sesión**
```typescript
// Usuario hace login
const user = { id: 1, email: "user@example.com", name: "user" };
login(user);

// Se sincroniza automáticamente
useEffect(() => {
  if (isAuthenticated && backendCart) {
    syncWithBackend(backendCart.items);
  }
}, [isAuthenticated, backendCart]);
```

### 2. **Agregar al Carrito**
```typescript
const handleAddToCart = async (product, variant, quantity) => {
  if (isAuthenticated) {
    // Envía al backend
    await addToCartMutation.mutateAsync({
      variantId: variant.id,
      quantity,
    });
  } else {
    // Almacena localmente
    addItem(product, variant, quantity);
  }
};
```

### 3. **Sincronización Automática**
- **Al Login**: Se carga el carrito del backend
- **Al Logout**: Se limpia el carrito local
- **En Tiempo Real**: Se actualiza con TanStack Query

## 🛡️ Validaciones de Stock

### Backend
```typescript
// Verificar stock disponible
if (variant.stock < quantity) {
  throw new BadRequestException(
    `Stock insuficiente. Disponible: ${variant.stock}`
  );
}
```

### Frontend
- **Validación Visual**: Se muestra stock disponible
- **Botones Deshabilitados**: Si no hay stock
- **Mensajes de Error**: Si falla la operación

## 🔄 Estados de Sincronización

### `isSyncing: false`
- Carrito sincronizado
- Operaciones normales

### `isSyncing: true`
- Operación en progreso
- Mostrar loading states
- Deshabilitar botones

## 📊 Estructura de Datos

### Carrito Local (Zustand)
```typescript
interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isSyncing: boolean;
  // ... métodos
}
```

### Carrito Backend (API)
```typescript
interface CartResponse {
  items: CartItem[];
  total: number;
  itemCount: number;
}
```

## 🎯 Casos de Uso

### 1. **Usuario Nuevo**
1. Navega sin login
2. Agrega productos al carrito local
3. Hace login
4. El carrito se sincroniza automáticamente

### 2. **Usuario Existente**
1. Hace login
2. Ve su carrito persistente
3. Continúa comprando
4. Todo se guarda en el backend

### 3. **Cambio de Dispositivo**
1. Usuario autenticado
2. Carrito disponible en cualquier dispositivo
3. Sincronización automática

## 🚀 Próximos Pasos

### Autenticación Real
- [ ] Implementar JWT
- [ ] Middleware de autenticación
- [ ] Refresh tokens
- [ ] Validación de permisos

### Carrito Avanzado
- [ ] Wishlist
- [ ] Carritos guardados
- [ ] Historial de compras
- [ ] Recomendaciones

### Optimizaciones
- [ ] Cache inteligente
- [ ] Optimistic updates
- [ ] Offline support
- [ ] Real-time sync

## 🔧 Testing

### Backend
```bash
# Probar endpoints
curl -X GET http://localhost:3001/api/cart
curl -X POST http://localhost:3001/api/cart \
  -H "Content-Type: application/json" \
  -d '{"variantId": 1, "quantity": 2}'
```

### Frontend
1. Abrir http://localhost:3000
2. Agregar productos sin login
3. Hacer login
4. Verificar sincronización
5. Probar todas las operaciones

## 📝 Notas Técnicas

- **Stock**: Se valida pero no se reserva hasta la orden final
- **CORS**: Configurado para desarrollo local
- **Error Handling**: Manejo de errores en ambos lados
- **Performance**: TanStack Query para cache y optimizaciones
- **UX**: Loading states y feedback visual
