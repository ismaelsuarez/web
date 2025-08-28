# 🎨 Frontend - React + Vite + TypeScript

Aplicación frontend para ecommerce construida con React, Vite, TypeScript y Tailwind CSS.

## 🛠️ Tecnologías

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Routing**: React Router DOM
- **UI Components**: Lucide React Icons
- **Package Manager**: pnpm

## 📋 Prerrequisitos

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Backend corriendo en http://localhost:3001

## ⚡ Configuración Rápida

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del frontend:

```bash
VITE_API_URL=http://localhost:3001
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Iniciar Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en http://localhost:3000

## 🌐 Páginas

### Home (`/`)
- Hero section con call-to-action
- Features destacados
- Link a productos

### Productos (`/productos`)
- Lista de productos con cards
- Búsqueda por texto
- Filtros por categoría
- Paginación
- Botón "Agregar al carrito"

### Detalle de Producto (`/productos/:id`)
- Galería de imágenes
- Información del producto
- Selección de variantes
- Especificaciones técnicas
- Botón "Agregar al carrito"

## 🛒 Carrito

- **Drawer lateral** con lista de productos
- **Persistencia** en localStorage
- **Gestión de cantidades**
- **Cálculo automático** del total
- **Botón para vaciar** carrito

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo |
| `pnpm build` | Construye para producción |
| `pnpm preview` | Previsualiza build de producción |
| `pnpm lint` | Ejecuta linting |
| `pnpm format` | Formatea el código |

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas de la aplicación
├── hooks/         # Custom hooks
├── stores/        # Stores de Zustand
├── types/         # Tipos TypeScript
├── lib/           # Utilidades y configuración
└── App.tsx        # Componente principal
```

## 🔗 Conexión con Backend

### Configuración

1. **Variables de entorno**:
   ```bash
   VITE_API_URL=http://localhost:3001
   ```

2. **Endpoints utilizados**:
   - `GET /api/products` - Lista de productos
   - `GET /api/products/:id` - Detalle de producto

### Desarrollo

1. **Iniciar backend**:
   ```bash
   cd apps/backend
   pnpm start:dev
   ```

2. **Iniciar frontend**:
   ```bash
   cd apps/frontend
   pnpm dev
   ```

3. **Verificar conexión**:
   - Backend: http://localhost:3001/health
   - Frontend: http://localhost:3000

## 🎨 Componentes UI

### ProductCard
- Muestra imagen, título, precio y stock
- Botón "Agregar al carrito"
- Diseño responsive

### CartDrawer
- Drawer lateral con productos
- Gestión de cantidades
- Cálculo de totales

### Layout
- Header con navegación
- Integración del carrito
- Estructura principal

## 🚀 Despliegue

### Producción

```bash
# Construir la aplicación
pnpm build

# Previsualizar
pnpm preview
```

### Variables de Entorno de Producción

```bash
VITE_API_URL=https://tu-api-backend.com
```

## 🔍 Troubleshooting

### Error de Conexión al Backend

1. Verifica que el backend esté corriendo en http://localhost:3001
2. Confirma la variable `VITE_API_URL` en `.env`
3. Revisa la consola del navegador para errores CORS

### Error de Build

```bash
# Limpiar cache
rm -rf node_modules
pnpm install

# Reconstruir
pnpm build
```

### Error de Dependencias

```bash
# Limpiar cache de pnpm
pnpm store prune

# Reinstalar dependencias
pnpm install
```
