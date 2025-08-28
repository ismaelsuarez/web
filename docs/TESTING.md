# Testing Guide

Este documento describe cómo ejecutar los tests en el monorepo de ecommerce.

## Estructura de Tests

### Backend (NestJS + Jest)

Los tests del backend se encuentran en `apps/backend/src/**/*.spec.ts` y utilizan Jest como framework de testing.

**Servicios con tests:**
- `ProductsService` - Tests para listado y búsqueda de productos
- `CartService` - Tests para operaciones del carrito (agregar, actualizar, remover items)
- `ShippingService` - Tests para cálculo de costos de envío

### Frontend (React + Vitest)

Los tests del frontend se encuentran en `apps/frontend/src/**/*.test.tsx` y utilizan Vitest + React Testing Library.

**Componentes con tests:**
- `Products` - Tests para la página de listado de productos
- `ProductCard` - Tests para el componente de tarjeta de producto

## Comandos de Test

### Ejecutar todos los tests

```bash
# Ejecutar tests de backend y frontend
pnpm test

# Ejecutar tests con coverage
pnpm test:coverage
```

### Tests específicos

```bash
# Solo tests del backend
pnpm backend:test
pnpm backend:test:coverage

# Solo tests del frontend
pnpm frontend:test
pnpm frontend:test:coverage
```

### Tests individuales

```bash
# Backend - ejecutar tests en modo watch
cd apps/backend
pnpm test:watch

# Frontend - ejecutar tests en modo watch
cd apps/frontend
pnpm test

# Frontend - interfaz visual de tests
cd apps/frontend
pnpm test:ui
```

## Cobertura de Tests

### Backend
- **ProductsService**: Tests para `getProducts()` y `getProduct()`
- **CartService**: Tests para todas las operaciones CRUD del carrito
- **ShippingService**: Tests para cálculo de costos y validaciones

### Frontend
- **Products Page**: Tests para renderizado, estados de carga, errores y búsqueda
- **ProductCard**: Tests para renderizado, interacciones y estados de stock

## Configuración

### Backend (Jest)
- Configuración en `apps/backend/package.json`
- Mocks para PrismaService
- Tests unitarios con inyección de dependencias

### Frontend (Vitest)
- Configuración en `apps/frontend/vitest.config.ts`
- Setup en `apps/frontend/src/test/setup.ts`
- Mocks para localStorage, IntersectionObserver, etc.

## CI/CD

El workflow de GitHub Actions (`.github/workflows/ci.yml`) ejecuta automáticamente:

1. **Instalación de dependencias**
2. **Generación del cliente Prisma**
3. **Tests del backend con coverage**
4. **Build del frontend**
5. **Tests del frontend con coverage**
6. **Linting y type checking**
7. **Verificación de formato**

## Mejores Prácticas

### Backend
- Usar mocks para PrismaService
- Testear casos de éxito y error
- Validar llamadas a métodos mockeados
- Cubrir edge cases y validaciones

### Frontend
- Usar React Testing Library para tests de integración
- Mockear APIs y stores externos
- Testear estados de carga y error
- Verificar accesibilidad básica

### Generales
- Mantener tests simples y legibles
- Usar nombres descriptivos para los tests
- Agrupar tests relacionados en `describe` blocks
- Limpiar mocks después de cada test

## Troubleshooting

### Backend
```bash
# Si hay problemas con Prisma en tests
cd apps/backend
pnpm db:generate
```

### Frontend
```bash
# Si hay problemas con dependencias de test
cd apps/frontend
pnpm install
```

### Coverage
```bash
# Verificar que los archivos de coverage se generen
ls apps/backend/coverage/
ls apps/frontend/coverage/
```
