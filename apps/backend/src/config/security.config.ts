export const securityConfig = {
  // Content Security Policy
  csp: {
    enabled: process.env.CSP_ENABLED === 'true',
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.mercadopago.com"],
      fontSrc: ["'self'", "https:", "data:"],
      frameSrc: ["'self'", "https://www.mercadopago.com.ar"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },

  // Rate Limiting
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '900'), // 15 minutes
    limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100'), // 100 requests
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
};
