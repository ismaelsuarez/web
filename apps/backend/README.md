# 🚀 Backend - NestJS + Prisma

API REST para la aplicación de ecommerce construida con NestJS, Prisma y PostgreSQL.

## 🛠️ Tecnologías

- **Framework**: NestJS
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Validación**: Zod
- **Documentación**: Swagger/OpenAPI
- **Lenguaje**: TypeScript

## 📋 Prerrequisitos

- Node.js >= 18.0.0
- PostgreSQL 15
- Docker (opcional, para servicios de infraestructura)

## ⚡ Configuración Rápida

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del backend:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_dev?schema=public"
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
