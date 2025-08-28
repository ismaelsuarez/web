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

## 🚀 Próximos Pasos

1. Configurar Prisma para la base de datos
2. Implementar autenticación
3. Crear componentes UI adicionales
4. Configurar CI/CD
5. Implementar tests

## 📝 Licencia

MIT
