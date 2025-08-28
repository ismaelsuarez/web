#!/bin/sh

# Script para inyectar variables de entorno en el frontend

# Crear archivo de configuración con variables de entorno
cat > /usr/share/nginx/html/env-config.js << EOF
window.ENV = {
  VITE_API_URL: "${VITE_API_URL:-http://localhost:3001}",
  NODE_ENV: "${NODE_ENV:-production}"
};
EOF

# Ejecutar el comando original
exec "$@"
