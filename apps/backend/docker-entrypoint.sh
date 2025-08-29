#!/bin/sh

# Script de entrada para Docker Backend
# Ejecuta migraciones de Prisma y luego inicia la aplicación

set -e

echo "🚀 Iniciando Backend E-commerce..."

# Cambiar al directorio del backend
cd /app/apps/backend

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que la base de datos esté lista..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  if npx prisma db push --accept-data-loss; then
    echo "✅ Base de datos lista y migraciones aplicadas"
    break
  else
    attempt=$((attempt + 1))
    echo "📊 Base de datos no disponible, intento $attempt/$max_attempts, reintentando en 5 segundos..."
    sleep 5
  fi
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Error: No se pudo conectar a la base de datos después de $max_attempts intentos"
  exit 1
fi

echo "✅ Base de datos lista y migraciones aplicadas"

# Generar cliente Prisma
echo "🔧 Generando cliente Prisma..."
npx prisma generate

# Iniciar la aplicación
echo "🚀 Iniciando aplicación NestJS..."
exec node dist/main.js
