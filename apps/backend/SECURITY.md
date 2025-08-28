# 🔒 Guía de Seguridad - Backend NestJS

Esta guía documenta las mejoras de seguridad implementadas en el backend de la aplicación ecommerce.

## 🛡️ Protecciones Implementadas

### 1. Helmet.js

**Descripción**: Middleware de seguridad que configura automáticamente headers HTTP seguros.

**Configuración**:
```typescript
app.use(helmet.default({
  contentSecurityPolicy: securityConfig.csp.enabled ? {
    directives: securityConfig.csp.directives,
  } : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
```

**Headers configurados**:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`
- `Content-Security-Policy` (configurable)

**Variable de entorno**:
```bash
CSP_ENABLED=true  # Activar/desactivar CSP
```

### 2. Content Security Policy (CSP)

**Directivas configuradas**:
```typescript
directives: {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", "data:", "https:"],
  connectSrc: ["'self'", "https://api.mercadopago.com"],
  fontSrc: ["'self'", "https:", "data:"],
  frameSrc: ["'self'", "https://www.mercadopago.com.ar"],
  objectSrc: ["'none'"],
  upgradeInsecureRequests: [],
}
```

**Permisos específicos**:
- **MercadoPago**: Conexiones a `api.mercadopago.com` y frames de `www.mercadopago.com.ar`
- **Imágenes**: HTTPS y data URLs permitidos
- **Fuentes**: HTTPS y data URLs permitidos
- **Estilos**: Inline styles permitidos para compatibilidad

### 3. Rate Limiting

**Configuración global**:
```typescript
ThrottlerModule.forRoot([{
  ttl: securityConfig.rateLimit.ttl,      // 900 segundos (15 min)
  limit: securityConfig.rateLimit.limit,  // 100 requests
}])
```

**Guards personalizados**:
- **ThrottleAuthGuard**: Para endpoints de autenticación
- **ThrottlePaymentsGuard**: Para endpoints de pagos

**Variables de entorno**:
```bash
RATE_LIMIT_TTL=900    # Tiempo en segundos
RATE_LIMIT_LIMIT=100  # Número máximo de requests
```

**Endpoints protegidos**:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/checkout/create-payment`
- `POST /api/checkout/confirm`

### 4. Logging Estructurado

**Configuración Pino**:
```typescript
LoggerModule.forRoot({
  pinoHttp: {
    level: securityConfig.logging.level,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
      },
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: req.headers,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  },
})
```

**Variable de entorno**:
```bash
LOG_LEVEL=info  # info|debug|error
```

## 🔧 Configuración

### Variables de Entorno Requeridas

```bash
# 🔒 Security Configuration
CSP_ENABLED=true
RATE_LIMIT_TTL=900
RATE_LIMIT_LIMIT=100
LOG_LEVEL=info
```

### Archivo de Configuración

Todas las configuraciones están centralizadas en `src/config/security.config.ts`:

```typescript
export const securityConfig = {
  csp: {
    enabled: process.env.CSP_ENABLED === 'true',
    directives: { /* CSP directives */ },
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL) || 900,
    limit: parseInt(process.env.RATE_LIMIT_LIMIT) || 100,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
};
```

## 🧪 Verificación

### 1. Verificar Headers de Seguridad

```bash
curl -I http://localhost:3001/api/products
```

**Headers esperados**:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self'; ...
```

### 2. Verificar Rate Limiting

```bash
# Hacer múltiples requests rápidos
for i in {1..110}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}'
done
```

**Respuesta esperada después del límite**:
```json
{
  "statusCode": 429,
  "message": "Too many authentication attempts. Please try again later."
}
```

### 3. Verificar Logging

Los logs estructurados aparecerán en la consola con formato JSON:

```json
{
  "level": "info",
  "time": "2024-01-15T10:30:00.000Z",
  "pid": 1234,
  "hostname": "localhost",
  "req": {
    "method": "GET",
    "url": "/api/products",
    "headers": { /* headers */ }
  },
  "res": {
    "statusCode": 200
  }
}
```

## 🚨 Monitoreo y Alertas

### Logs de Seguridad

Los siguientes eventos se registran automáticamente:

1. **Rate limiting excedido**:
   ```json
   {
     "level": "warn",
     "message": "Rate limit exceeded",
     "ip": "192.168.1.1",
     "endpoint": "/api/auth/login"
   }
   ```

2. **Requests con headers sospechosos**:
   ```json
   {
     "level": "warn",
     "message": "Suspicious request headers",
     "headers": { /* headers */ }
   }
   ```

3. **Errores de autenticación**:
   ```json
   {
     "level": "error",
     "message": "Authentication failed",
     "ip": "192.168.1.1",
     "reason": "Invalid credentials"
   }
   ```

### Métricas Recomendadas

1. **Rate limiting hits**: Número de veces que se excede el límite
2. **Failed authentication attempts**: Intentos fallidos de login
3. **Suspicious IP addresses**: IPs que generan muchos errores
4. **CSP violations**: Violaciones de Content Security Policy

## 🔄 Mantenimiento

### Actualización de Dependencias

```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencias de seguridad
npm update helmet @nestjs/throttler pino nestjs-pino
```

### Revisión de Configuración

1. **Mensualmente**: Revisar logs de seguridad
2. **Trimestralmente**: Actualizar CSP directives si es necesario
3. **Anualmente**: Revisar y ajustar rate limiting según el tráfico

### Backup de Configuración

```bash
# Exportar configuración actual
cp .env .env.backup.$(date +%Y%m%d)
```

## 📚 Recursos Adicionales

- [Helmet.js Documentation](https://helmetjs.github.io/)
- [NestJS Throttler](https://docs.nestjs.com/security/rate-limiting)
- [Pino Logger](https://getpino.io/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
