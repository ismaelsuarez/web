# 🚀 Backend - NestJS + Prisma

API REST para la aplicación de ecommerce construida con NestJS, Prisma y PostgreSQL.

## 🛠️ Tecnologías

- **Framework**: NestJS
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Validación**: Zod
- **Documentación**: Swagger/OpenAPI
- **Lenguaje**: TypeScript
- **Seguridad**: Helmet.js, Rate Limiting, CSP
- **Logging**: Pino (structured logging)

## 📋 Prerrequisitos

- Node.js >= 18.0.0
- PostgreSQL 15
- Docker (opcional, para servicios de infraestructura)

## ⚡ Configuración Rápida

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del backend:

```bash
# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_dev?schema=public"

# JWT
JWT_ACCESS_SECRET="your-super-secret-access-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN="your-mercadopago-access-token-here"
MERCADOPAGO_PUBLIC_KEY="your-mercadopago-public-key-here"

# URLs
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:3001"

# 🔒 Configuración de Seguridad
CSP_ENABLED=true
RATE_LIMIT_TTL=900
RATE_LIMIT_LIMIT=100
LOG_LEVEL=info
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Base de Datos

```bash
# Generar cliente de Prisma
pnpm db:generate

# Crear tablas en la base de datos
pnpm db:push

# Ejecutar seed con datos de ejemplo
pnpm db:seed
```

### 4. Iniciar Desarrollo

```bash
pnpm start:dev
```

## 🗄️ Base de Datos

### Modelos

- **Category**: Categorías de productos
- **Product**: Productos principales
- **ProductVariant**: Variantes de productos (talla, color, etc.)
- **User**: Usuarios del sistema
- **Cart**: Carritos de compra
- **CartItem**: Items en carritos
- **Order**: Órdenes de compra
- **OrderItem**: Items en órdenes

### Scripts de Base de Datos

| Comando | Descripción |
|---------|-------------|
| `pnpm db:generate` | Genera el cliente de Prisma |
| `pnpm db:push` | Sincroniza el esquema con la BD |
| `pnpm db:migrate` | Ejecuta migraciones |
| `pnpm db:seed` | Pobla la BD con datos de ejemplo |
| `pnpm db:studio` | Abre Prisma Studio |

## 🌐 Endpoints

### Productos

- `GET /api/products` - Listar productos con filtros y paginación
- `GET /api/products/:id` - Obtener producto por ID

### Parámetros de Consulta

- `q` - Búsqueda por título, descripción o marca
- `category` - Filtrar por categoría (slug)
- `page` - Número de página (default: 1)
- `limit` - Items por página (default: 20, max: 100)

### Ejemplos

```bash
# Listar todos los productos
GET /api/products

# Buscar productos
GET /api/products?q=iphone

# Filtrar por categoría
GET /api/products?category=electronics

# Con paginación
GET /api/products?page=2&limit=10

# Combinar filtros
GET /api/products?q=apple&category=electronics&page=1&limit=5
```

## 🔒 Seguridad

### Protecciones Implementadas

#### Helmet.js
- **Headers de seguridad**: Configuración automática de headers HTTP seguros
- **X-Powered-By**: Deshabilitado para ocultar información del servidor
- **Content Security Policy (CSP)**: Configurable con `CSP_ENABLED=true/false`

#### Rate Limiting
- **Límite global**: 100 requests por 15 minutos por IP (configurable)
- **Endpoints protegidos**: `/api/auth/*` y `/api/payments/*` con límites más estrictos
- **Configuración**: `RATE_LIMIT_TTL` y `RATE_LIMIT_LIMIT`

#### Logging Estructurado
- **Pino**: Logging de alto rendimiento en formato JSON
- **Nivel configurable**: `LOG_LEVEL=info|debug|error`
- **Serialización**: Requests y responses serializados

### Configuración de Seguridad

```bash
# Content Security Policy
CSP_ENABLED=true                    # Activar/desactivar CSP
RATE_LIMIT_TTL=900                  # Tiempo en segundos (15 min)
RATE_LIMIT_LIMIT=100                # Número máximo de requests
LOG_LEVEL=info                      # Nivel de logging
```

### Verificación de Seguridad

```bash
# Verificar headers de seguridad
curl -I http://localhost:3001/api/products

# Verificar rate limiting
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

## 📚 Documentación API

La documentación interactiva está disponible en:

- **Swagger UI**: http://localhost:3001/api/docs
- **OpenAPI JSON**: http://localhost:3001/api-json

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm start:dev` | Inicia en modo desarrollo con hot reload |
| `pnpm start:prod` | Inicia en modo producción |
| `pnpm build` | Construye la aplicación |
| `pnpm lint` | Ejecuta linting |
| `pnpm format` | Formatea el código |
| `pnpm test` | Ejecuta tests |

## 🚀 Despliegue

### Producción

```bash
# Construir la aplicación
pnpm build

# Iniciar en producción
pnpm start:prod
```

### Variables de Entorno de Producción

```bash
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
NODE_ENV="production"
PORT=3001
```

## 📁 Estructura del Proyecto

```
src/
├── dto/              # Data Transfer Objects
├── products/         # Módulo de productos
├── prisma/          # Configuración de Prisma
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## 🔍 Troubleshooting

### Error de Conexión a Base de Datos

1. Verifica que PostgreSQL esté corriendo
2. Confirma las credenciales en `DATABASE_URL`
3. Asegúrate de que la base de datos `ecommerce_dev` exista

### Error de Prisma

```bash
# Regenerar cliente de Prisma
pnpm db:generate

# Resetear base de datos
pnpm db:push --force-reset
```
