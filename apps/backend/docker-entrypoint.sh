#!/bin/sh

# Script de entrada para Docker Backend
# Ejecuta migraciones de Prisma y luego inicia la aplicación

set -e

echo "🚀 Iniciando Backend E-commerce..."

# Cambiar al directorio del backend
cd /app/apps/backend

# Verificar que los archivos necesarios existen
echo "📁 Verificando archivos necesarios..."
if [ ! -f "dist/main.js" ]; then
  echo "❌ Error: dist/main.js no encontrado. Verificando build..."
  ls -la dist/ || echo "❌ Directorio dist/ no existe"
  exit 1
fi

if [ ! -f "prisma/schema.prisma" ]; then
  echo "❌ Error: prisma/schema.prisma no encontrado"
  exit 1
fi

echo "✅ Archivos necesarios verificados"

# Generar cliente Prisma primero
echo "🔧 Generando cliente Prisma..."
npx prisma generate

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que la base de datos esté lista..."
max_attempts=60
attempt=0

while [ $attempt -lt $max_attempts ]; do
  echo "📊 Intento $((attempt + 1))/$max_attempts de conectar a la base de datos..."
  
  # Intentar aplicar migraciones directamente
  if npx prisma db push --accept-data-loss; then
    echo "✅ Base de datos lista y migraciones aplicadas"
    break
  else
    attempt=$((attempt + 1))
    echo "📊 Base de datos no disponible, reintentando en 10 segundos..."
    sleep 10
  fi
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Error: No se pudo conectar a la base de datos después de $max_attempts intentos"
  echo "🔍 Verificando variables de entorno..."
  echo "DATABASE_URL: ${DATABASE_URL:0:50}..."
  echo "❌ Fallo crítico: La aplicación requiere una base de datos funcional"
  echo "❌ No se puede continuar sin migraciones aplicadas correctamente"
  exit 1
fi

echo "✅ Base de datos lista y migraciones aplicadas"

# Verificar que el cliente Prisma se generó correctamente
echo "🔧 Verificando cliente Prisma..."
if [ ! -f "../../node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/index.js" ]; then
  echo "❌ Error: Cliente Prisma no encontrado, regenerando..."
  npx prisma generate
fi

# Iniciar la aplicación
echo "🚀 Iniciando aplicación NestJS..."
echo "📊 Puerto: ${PORT:-3001}"
echo "🌍 Entorno: ${NODE_ENV:-development}"

# Ejecutar con más logging
exec node dist/main.js
