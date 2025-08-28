# Guía de Pruebas de MercadoPago

## Configuración Inicial

### 1. Credenciales de MercadoPago

Para realizar pruebas, necesitas configurar las siguientes variables de entorno en el archivo `.env` del backend:

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Obtener Credenciales de Prueba

1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Inicia sesión con tu cuenta de MercadoPago
3. Ve a "Tus integraciones" > "Credenciales"
4. Copia las credenciales de **TEST** (no las de producción)

## Flujo de Pruebas Completo

### Paso 1: Configurar el Entorno

1. **Backend**: Asegúrate de que el servidor esté corriendo con las credenciales correctas
2. **Frontend**: Verifica que esté configurado para conectarse al backend
3. **Base de datos**: Asegúrate de que haya productos con stock disponible

### Paso 2: Crear Usuario de Prueba

1. Ve al frontend y regístrate con un email válido
2. Inicia sesión con las credenciales creadas

### Paso 3: Agregar Productos al Carrito

1. Navega a `/productos`
2. Agrega varios productos al carrito
3. Verifica que el carrito se actualice correctamente

### Paso 4: Procesar Checkout

1. Ve a `/checkout`
2. Completa el formulario de dirección de envío:
   - Nombre completo
   - Email válido
   - Teléfono
   - Dirección completa
   - Provincia (selecciona una para calcular envío)
3. Selecciona "MercadoPago (Online)" como método de pago
4. Haz clic en "Finalizar compra"

### Paso 5: Probar con Tarjetas de Prueba

MercadoPago proporciona tarjetas de prueba específicas para sandbox:

#### Tarjetas de Crédito Aprobadas:
- **Visa**: 4509 9535 6623 3704
- **Mastercard**: 5031 4332 1540 6351
- **American Express**: 3711 8030 3257 522

#### Tarjetas de Débito:
- **Maestro**: 5895 6254 0000 0004

#### Datos de Prueba:
- **CVV**: Cualquier número de 3 dígitos (ej: 123)
- **Fecha de vencimiento**: Cualquier fecha futura (ej: 12/25)
- **Nombre del titular**: Cualquier nombre
- **DNI**: Cualquier número de 8 dígitos (ej: 12345678)

### Paso 6: Verificar el Flujo Completo

1. **Creación de preferencia**: El backend debe crear una preferencia en MercadoPago
2. **Redirección**: El frontend debe redirigir a MercadoPago sandbox
3. **Pago**: Usa una tarjeta de prueba para completar el pago
4. **Retorno**: MercadoPago debe redirigir de vuelta al frontend
5. **Confirmación**: El backend debe procesar el webhook y confirmar la orden

## Casos de Prueba Específicos

### Caso 1: Pago Exitoso
1. Usa una tarjeta aprobada
2. Completa el pago en MercadoPago
3. Verifica que seas redirigido a `/checkout/success`
4. Confirma que la orden aparezca como "paid" en la base de datos
5. Verifica que el stock se haya decrementado

### Caso 2: Pago Rechazado
1. Usa una tarjeta rechazada (ej: 4000 0000 0000 0002)
2. Completa el pago en MercadoPago
3. Verifica que seas redirigido a `/checkout/failure`
4. Confirma que la orden aparezca como "failed" en la base de datos
5. Verifica que el stock NO se haya decrementado

### Caso 3: Pago Pendiente
1. Usa una tarjeta que genere un pago pendiente
2. Completa el pago en MercadoPago
3. Verifica que seas redirigido a `/checkout/pending`
4. Confirma que la orden aparezca como "pending" en la base de datos

### Caso 4: Cancelación
1. Inicia el proceso de pago
2. Cancela en MercadoPago antes de completar
3. Verifica que seas redirigido a `/checkout/failure`
4. Confirma que la orden mantenga su estado original

## Verificación de Webhooks

### Configurar Webhook Local

Para probar webhooks localmente:

1. **Usar ngrok** (para exponer tu servidor local):
   ```bash
   ngrok http 3001
   ```

2. **Configurar URL de webhook** en MercadoPago:
   - Ve a tu cuenta de MercadoPago
   - Configura la URL de webhook: `https://tu-ngrok-url.ngrok.io/api/payments/mercadopago/webhook`

3. **Verificar logs** del backend para confirmar que los webhooks se reciben

### Monitorear Webhooks

Los webhooks se procesan automáticamente y:
- Actualizan el estado de la orden
- Decrementan el stock (solo si el pago es aprobado)
- Envían notificaciones (si están configuradas)

## Verificación en Base de Datos

### Consultas Útiles

```sql
-- Ver todas las órdenes
SELECT * FROM "Order" ORDER BY "createdAt" DESC;

-- Ver órdenes por estado
SELECT * FROM "Order" WHERE status = 'paid';

-- Ver items de una orden específica
SELECT * FROM "OrderItem" WHERE "orderId" = 'order-id-here';

-- Verificar stock de productos
SELECT p.name, pv.name, pv.stock 
FROM "Product" p 
JOIN "ProductVariant" pv ON p.id = pv."productId";
```

## Troubleshooting

### Problemas Comunes

1. **Error 401 en MercadoPago**:
   - Verifica que las credenciales sean de TEST
   - Confirma que el ACCESS_TOKEN sea válido

2. **Webhook no se recibe**:
   - Verifica que la URL del webhook sea accesible
   - Confirma que el endpoint esté funcionando
   - Revisa los logs del backend

3. **Stock no se decrementa**:
   - Verifica que el pago esté aprobado
   - Confirma que el webhook se procese correctamente
   - Revisa los logs de transacciones

4. **Error de redirección**:
   - Verifica que las URLs de retorno estén configuradas correctamente
   - Confirma que el frontend esté accesible

### Logs Importantes

Revisa estos logs en el backend:
- Creación de preferencias
- Recepción de webhooks
- Confirmación de órdenes
- Errores de MercadoPago

## Notas Importantes

1. **Solo usa credenciales de TEST** para desarrollo
2. **Las tarjetas de prueba solo funcionan en sandbox**
3. **Los webhooks pueden tener retrasos** de hasta 5 minutos
4. **Siempre verifica el estado en la base de datos** después de las pruebas
5. **Mantén logs detallados** para debugging

## Próximos Pasos

Una vez que las pruebas en sandbox funcionen correctamente:

1. Configurar credenciales de producción
2. Actualizar URLs de webhook para producción
3. Configurar monitoreo y alertas
4. Implementar manejo de errores robusto
5. Configurar notificaciones por email
