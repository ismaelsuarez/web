# Guía de Pruebas - Integración MercadoPago Sandbox

## Configuración Inicial

### 1. Variables de Entorno
Copia el archivo `apps/backend/env.example` a `apps/backend/.env` y configura:

```bash
# MercadoPago Sandbox (obtener desde https://www.mercadopago.com.ar/developers)
MERCADOPAGO_ACCESS_TOKEN="TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
MERCADOPAGO_PUBLIC_KEY="TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# URLs de la aplicación
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3001"
```

### 2. Obtener Credenciales de Sandbox
1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Crea una cuenta de desarrollador
3. Obtén las credenciales de **Sandbox** (no producción)
4. Configura las URLs de webhook en tu panel de desarrollador

## Flujo de Pruebas

### 1. Preparación del Entorno
```bash
# Instalar dependencias
pnpm bootstrap

# Iniciar servicios de infraestructura
docker-compose -f infra/docker-compose.yml up -d

# Configurar base de datos
pnpm --filter backend db:migrate
pnpm --filter backend db:seed

# Iniciar aplicaciones
pnpm dev
```

### 2. Prueba del Flujo Completo

#### Paso 1: Registro/Login
1. Ve a `http://localhost:5173`
2. Registra un nuevo usuario o inicia sesión
3. Verifica que el token JWT se almacene correctamente

#### Paso 2: Agregar Productos al Carrito
1. Navega a `/productos`
2. Selecciona productos y agrega al carrito
3. Verifica que aparezcan en el drawer lateral
4. Si estás autenticado, verifica que se sincronice con el backend

#### Paso 3: Proceso de Checkout
1. Ve a `/checkout` (requiere autenticación)
2. Completa el formulario de dirección de envío:
   ```json
   {
     "firstName": "Juan",
     "lastName": "Pérez",
     "address": "Av. Corrientes 1234",
     "city": "Buenos Aires",
     "postalCode": "1043",
     "phone": "11-1234-5678"
   }
   ```
3. Haz clic en "Pagar"

#### Paso 4: Redirección a MercadoPago
1. Deberías ser redirigido a MercadoPago Sandbox
2. Usa las tarjetas de prueba de MercadoPago:

**Tarjetas de Prueba:**
- **Aprobada:** `4509 9535 6623 3704` (Visa)
- **Rechazada:** `4000 0000 0000 0002` (Visa)
- **Pendiente:** `4000 0000 0000 0127` (Visa)

**Datos de Prueba:**
- Fecha: Cualquier fecha futura
- CVV: Cualquier número de 3 dígitos
- Nombre: Cualquier nombre

### 3. Verificación de Resultados

#### En el Backend (Logs)
```bash
# Ver logs del backend
pnpm --filter backend start:dev
```

Deberías ver:
- Creación de orden con status "pending"
- Creación de preferencia en MercadoPago
- Webhook recibido y procesado
- Actualización de status de orden

#### En la Base de Datos
```bash
# Abrir Prisma Studio
pnpm --filter backend db:studio
```

Verifica en la tabla `orders`:
- Orden creada con `status: "pending"`
- `preferenceId` y `paymentUrl` configurados
- `mercadopagoId` actualizado después del pago

#### En MercadoPago Dashboard
1. Ve a tu [Dashboard de MercadoPago](https://www.mercadopago.com.ar/developers/panel)
2. Verifica que aparezcan las preferencias creadas
3. Revisa los webhooks recibidos

## Casos de Prueba

### Caso 1: Pago Exitoso
1. Usa tarjeta `4509 9535 6623 3704`
2. Verifica que la orden cambie a status "paid"
3. Verifica que el carrito se limpie

### Caso 2: Pago Rechazado
1. Usa tarjeta `4000 0000 0000 0002`
2. Verifica que la orden cambie a status "failed"
3. Verifica que el carrito permanezca intacto

### Caso 3: Pago Pendiente
1. Usa tarjeta `4000 0000 0000 0127`
2. Verifica que la orden mantenga status "pending"

## Troubleshooting

### Error: "Invalid access token"
- Verifica que `MERCADOPAGO_ACCESS_TOKEN` sea correcto
- Asegúrate de usar credenciales de **Sandbox**, no producción

### Error: "Webhook not received"
- Verifica que `BACKEND_URL` sea accesible desde internet
- Usa ngrok para exponer tu localhost: `ngrok http 3001`
- Actualiza la URL del webhook en MercadoPago

### Error: "Order not found"
- Verifica que `external_reference` coincida con el ID de la orden
- Revisa los logs del backend para errores

### Error: "Cart is empty"
- Asegúrate de tener productos en el carrito
- Verifica que el usuario esté autenticado
- Revisa la sincronización del carrito

## Endpoints de Prueba

### Crear Pago
```bash
curl -X POST http://localhost:3001/api/checkout/create-payment \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "address": "Av. Corrientes 1234",
      "city": "Buenos Aires",
      "postalCode": "1043",
      "phone": "11-1234-5678"
    }
  }'
```

### Simular Webhook
```bash
curl -X POST http://localhost:3001/api/payments/mercadopago/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "id": "123456789"
    },
    "type": "payment"
  }'
```

## Notas Importantes

1. **Siempre usa credenciales de Sandbox** para pruebas
2. **Los webhooks pueden tardar** hasta 5 minutos en llegar
3. **Verifica los logs** del backend para debugging
4. **Usa ngrok** si necesitas exponer tu localhost para webhooks
5. **Las tarjetas de prueba** solo funcionan en sandbox

## Próximos Pasos

Una vez que las pruebas en sandbox funcionen correctamente:

1. Configurar credenciales de producción
2. Actualizar URLs a dominios reales
3. Configurar webhooks de producción
4. Implementar manejo de errores más robusto
5. Agregar notificaciones por email
6. Implementar página de confirmación de pago
