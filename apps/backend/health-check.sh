#!/bin/sh

# Script de health check para el backend
# Verifica que la aplicación esté respondiendo correctamente

set -e

# Función para verificar si el puerto está abierto
check_port() {
  local port=$1
  local host=${2:-localhost}
  
  # Usar netstat para verificar si el puerto está en uso
  if netstat -tuln | grep -q ":$port "; then
    return 0
  else
    return 1
  fi
}

# Función para verificar el endpoint de health
check_health_endpoint() {
  local port=${1:-3001}
  local host=${2:-localhost}
  local url="http://$host:$port/health"
  
  # Intentar con wget primero
  if command -v wget >/dev/null 2>&1; then
    if wget --no-verbose --tries=1 --spider "$url" >/dev/null 2>&1; then
      return 0
    fi
  fi
  
  # Intentar con curl como alternativa
  if command -v curl >/dev/null 2>&1; then
    if curl -f -s "$url" >/dev/null 2>&1; then
      return 0
    fi
  fi
  
  # Intentar con nc (netcat) como última opción
  if command -v nc >/dev/null 2>&1; then
    if echo "GET /health HTTP/1.1\r\nHost: $host\r\n\r\n" | nc "$host" "$port" | grep -q "HTTP/1.1 200"; then
      return 0
    fi
  fi
  
  return 1
}

# Verificar que el proceso de Node.js esté ejecutándose
check_node_process() {
  if pgrep -f "node.*dist/main.js" >/dev/null; then
    return 0
  else
    return 1
  fi
}

# Ejecutar verificaciones
echo "🔍 Ejecutando health check..."

# Verificar proceso de Node.js
if ! check_node_process; then
  echo "❌ Proceso de Node.js no encontrado"
  exit 1
fi

echo "✅ Proceso de Node.js ejecutándose"

# Verificar que el puerto esté abierto
if ! check_port 3001; then
  echo "❌ Puerto 3001 no está abierto"
  exit 1
fi

echo "✅ Puerto 3001 abierto"

# Verificar endpoint de health
if ! check_health_endpoint 3001; then
  echo "❌ Endpoint /health no responde"
  exit 1
fi

echo "✅ Endpoint /health responde correctamente"
echo "✅ Health check completado exitosamente"
exit 0
