# 🚀 Ecommerce Monorepo

Monorepo para aplicación de ecommerce construido con **pnpm + Turborepo**.

## 📁 Estructura del Proyecto

```
├── apps/
│   ├── frontend/     # Vite + React + TypeScript
│   └── backend/      # NestJS + TypeScript
├── packages/
│   └── ui/          # Componentes UI compartidos
├── infra/
│   └── docker-compose.yml  # Servicios de infraestructura
└── README.md
```

## 🛠️ Tecnologías

- **Monorepo**: pnpm + Turborepo
- **Frontend**: Vite + React + TypeScript
- **Backend**: NestJS + TypeScript
- **Base de Datos**: PostgreSQL 15
- **Cache**: Redis
- **UI**: Componentes compartidos con TypeScript

## ⚡ Inicio Rápido

### Prerrequisitos

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker y Docker Compose

### Instalación

1. **Instalar pnpm** (si no lo tienes):
   ```bash
   npm install -g pnpm
   ```

2. **Clonar el repositorio**:
   ```bash
   git clone <tu-repositorio>
   cd ecommerce-monorepo
   ```

3. **Instalar dependencias y configurar**:
   ```bash
   pnpm bootstrap
   ```

4. **Iniciar servicios de infraestructura**:
   ```bash
   cd infra
   docker-compose up -d
   ```

5. **Iniciar desarrollo**:
   ```bash
   pnpm dev
   ```

## 🚀 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia frontend (puerto 3000) y backend (puerto 3001) en paralelo |
| `pnpm build` | Construye todos los paquetes |
| `pnpm lint` | Ejecuta linting en todos los paquetes |
| `pnpm format` | Formatea código con Prettier |
| `pnpm bootstrap` | Instala dependencias y construye paquetes |
| `pnpm clean` | Limpia archivos de build |
| `pnpm test` | Ejecuta tests de backend y frontend |
| `pnpm test:coverage` | Ejecuta tests con reporte de cobertura |
| `pnpm backend:test` | Ejecuta solo tests del backend |
| `pnpm frontend:test` | Ejecuta solo tests del frontend |
| `pnpm test:e2e` | Ejecuta tests E2E con Playwright |
| `pnpm test:e2e:headed` | Ejecuta tests E2E con navegador visible |

## 🌐 Servicios

### Aplicaciones
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Health**: http://localhost:3001/health

### Infraestructura
- **PostgreSQL**: localhost:5432
  - Base de datos: `ecommerce_dev`
  - Usuario: `postgres`
  - Contraseña: `postgres`
- **Redis**: localhost:6379
- **PgAdmin**: http://localhost:5050
  - Email: `admin@ecommerce.com`
  - Contraseña: `admin`

## 🧪 Tests E2E

### Playwright Tests

El proyecto incluye tests E2E completos con Playwright que validan el flujo completo de compra:

#### Ejecutar Tests E2E

```bash
# Ejecutar tests E2E en modo headless
pnpm --filter frontend test:e2e

# Ejecutar tests E2E con navegador visible
pnpm --filter frontend test:e2e:headed

# Ejecutar tests E2E específicos
pnpm --filter frontend test:e2e --grep "checkout"
```

#### Escenarios de Test

Los tests E2E cubren los siguientes escenarios:

1. **Catálogo (PLP)**
   - Navegación a `/productos`
   - Validación de carga de productos
   - Búsqueda de productos

2. **Página de Producto (PDP)**
   - Visualización de detalles del producto
   - Agregar productos al carrito
   - Validación del drawer del carrito

3. **Carrito → Checkout**
   - Gestión del carrito
   - Login de usuario
   - Persistencia del carrito

4. **Pago (Mercado Pago)**
   - Configuración de envío
   - Creación de preference de pago
   - Redirección a Mercado Pago

5. **Confirmación de Orden**
   - Verificación de estado de orden
   - Validación de reducción de stock

#### Reportes

Los reportes de Playwright se generan en:
- **Local**: `apps/frontend/playwright-report/`
- **CI/CD**: Disponible como artefacto en GitHub Actions

#### Configuración

- **Base URL**: http://localhost:3000
- **Navegador**: Chromium por defecto
- **Retries**: 2 en CI, 0 en local
- **Reporter**: List + HTML

### Usuario de Prueba

Los tests utilizan un usuario de prueba:
- **Email**: testuser@example.com
- **Password**: Test1234

## 📦 Paquetes

### Frontend (`apps/frontend`)
Aplicación React con Vite, optimizada para desarrollo rápido.

### Backend (`apps/backend`)
API REST con NestJS, preparada para escalabilidad.

### UI (`packages/ui`)
Componentes React reutilizables con TypeScript.

## 🔧 Configuración

### TypeScript
- Configuración estricta habilitada
- Path mapping configurado
- Declaraciones de tipos automáticas

### ESLint + Prettier
- Reglas consistentes en todo el monorepo
- Formateo automático
- Integración con TypeScript

### Docker Compose
- Servicios aislados en red dedicada
- Volúmenes persistentes
- Configuración de desarrollo optimizada

## 🐳 Docker y Staging

### Desarrollo Local con Docker

Para ejecutar la aplicación completa en contenedores Docker:

```bash
# Construir y levantar todos los servicios
docker-compose -f docker-compose.staging.yml up --build

# Ejecutar en segundo plano
docker-compose -f docker-compose.staging.yml up -d --build

# Ver logs
docker-compose -f docker-compose.staging.yml logs -f

# Detener servicios
docker-compose -f docker-compose.staging.yml down
```

### Servicios Disponibles en Staging

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **PgAdmin**: http://localhost:5050 (con `--profile admin`)

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=your-mercadopago-access-token
MERCADOPAGO_PUBLIC_KEY=your-mercadopago-public-key

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001
```

## 🚀 Próximos Pasos

1. ✅ Configurar Prisma para la base de datos
2. ✅ Implementar autenticación JWT
3. ✅ Crear componentes UI adicionales
4. ✅ Configurar CI/CD con GitHub Actions
5. ✅ Implementar tests unitarios
6. ✅ Configurar Docker para staging
7. 🔄 Implementar tests de integración
8. 🔄 Configurar monitoreo y logging
9. 🔄 Optimizar performance
10. 🔄 Implementar PWA

## 📝 Licencia

MIT
