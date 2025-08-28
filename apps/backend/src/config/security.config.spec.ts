import { securityConfig } from './security.config';

describe('Security Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('CSP Configuration', () => {
    it('should enable CSP when CSP_ENABLED=true', () => {
      process.env.CSP_ENABLED = 'true';
      const config = require('./security.config').securityConfig;
      expect(config.csp.enabled).toBe(true);
    });

    it('should disable CSP when CSP_ENABLED=false', () => {
      process.env.CSP_ENABLED = 'false';
      const config = require('./security.config').securityConfig;
      expect(config.csp.enabled).toBe(false);
    });

    it('should have correct CSP directives', () => {
      expect(securityConfig.csp.directives).toEqual({
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.mercadopago.com"],
        fontSrc: ["'self'", "https:", "data:"],
        frameSrc: ["'self'", "https://www.mercadopago.com.ar"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      });
    });
  });

  describe('Rate Limiting Configuration', () => {
    it('should use default values when env vars are not set', () => {
      delete process.env.RATE_LIMIT_TTL;
      delete process.env.RATE_LIMIT_LIMIT;
      const config = require('./security.config').securityConfig;
      expect(config.rateLimit.ttl).toBe(900);
      expect(config.rateLimit.limit).toBe(100);
    });

    it('should use custom values from env vars', () => {
      process.env.RATE_LIMIT_TTL = '600';
      process.env.RATE_LIMIT_LIMIT = '50';
      const config = require('./security.config').securityConfig;
      expect(config.rateLimit.ttl).toBe(600);
      expect(config.rateLimit.limit).toBe(50);
    });
  });

  describe('Logging Configuration', () => {
    it('should use default log level when not set', () => {
      delete process.env.LOG_LEVEL;
      const config = require('./security.config').securityConfig;
      expect(config.logging.level).toBe('info');
    });

    it('should use custom log level from env var', () => {
      process.env.LOG_LEVEL = 'debug';
      const config = require('./security.config').securityConfig;
      expect(config.logging.level).toBe('debug');
    });
  });

  describe('CORS Configuration', () => {
    it('should use default frontend URL when not set', () => {
      delete process.env.FRONTEND_URL;
      const config = require('./security.config').securityConfig;
      expect(config.cors.origin).toBe('http://localhost:3000');
    });

    it('should use custom frontend URL from env var', () => {
      process.env.FRONTEND_URL = 'http://localhost:5173';
      const config = require('./security.config').securityConfig;
      expect(config.cors.origin).toBe('http://localhost:5173');
    });

    it('should have credentials enabled', () => {
      expect(securityConfig.cors.credentials).toBe(true);
    });
  });
});
