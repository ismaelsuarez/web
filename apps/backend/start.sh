#!/bin/ash

# Script simple de inicio para el backend
# Maneja migraciones de Prisma y luego ejecuta la aplicación

set -e

echo "🚀 Iniciando Backend E-commerce..."

# Cambiar al directorio del backend
cd /app/apps/backend

# Generar cliente Prisma
echo "🔧 Generando cliente Prisma..."
npx prisma generate

# Esperar a que la base de datos esté lista y aplicar migraciones
echo "⏳ Esperando a que la base de datos esté lista..."
max_attempts=15
attempt=0

while [ $attempt -lt $max_attempts ]; do
  echo "📊 Intento $((attempt + 1))/$max_attempts de conectar a la base de datos..."
  
  if npx prisma db push --accept-data-loss; then
    echo "✅ Base de datos lista y migraciones aplicadas"
    break
  else
    attempt=$((attempt + 1))
    if [ $attempt -lt $max_attempts ]; then
      echo "📊 Base de datos no disponible, reintentando en 3 segundos..."
      sleep 3
    fi
  fi
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Error: No se pudo conectar a la base de datos después de $max_attempts intentos"
  exit 1
fi

# Iniciar la aplicación
echo "🚀 Iniciando aplicación NestJS..."
echo "📊 Puerto: ${PORT:-3001}"
echo "🌍 Entorno: ${NODE_ENV:-development}"

exec node dist/main.js
