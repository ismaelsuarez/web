import { Test, TestingModule } from '@nestjs/testing';
import { ThrottleAuthGuard } from './throttle-auth.guard';
import { ThrottlePaymentsGuard } from './throttle-payments.guard';
import { ThrottlerModule } from '@nestjs/throttler';

describe('Security Guards', () => {
  let throttleAuthGuard: ThrottleAuthGuard;
  let throttlePaymentsGuard: ThrottlePaymentsGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{
          ttl: 900,
          limit: 100,
        }]),
      ],
      providers: [ThrottleAuthGuard, ThrottlePaymentsGuard],
    }).compile();

    throttleAuthGuard = module.get<ThrottleAuthGuard>(ThrottleAuthGuard);
    throttlePaymentsGuard = module.get<ThrottlePaymentsGuard>(ThrottlePaymentsGuard);
  });

  describe('ThrottleAuthGuard', () => {
    it('should be defined', () => {
      expect(throttleAuthGuard).toBeDefined();
    });

    it('should return IP address as tracker', async () => {
      const mockReq = {
        ip: '192.168.1.1',
        ips: [],
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        acceptsEncodings: jest.fn(),
        acceptsLanguages: jest.fn(),
        range: jest.fn(),
        param: jest.fn(),
        is: jest.fn(),
        protocol: '',
        secure: false,
        subdomains: [],
        path: '',
        hostname: '',
        host: '',
        fresh: false,
        stale: false,
        xhr: false,
        body: {},
        cookies: {},
        method: '',
        params: {},
        query: {},
        route: {},
        signedCookies: {},
        originalUrl: '',
        url: '',
        baseUrl: '',
      } as any;

      const tracker = await throttleAuthGuard['getTracker'](mockReq);
      expect(tracker).toBe('192.168.1.1');
    });

    it('should return first IP from ips array', async () => {
      const mockReq = {
        ip: '192.168.1.1',
        ips: ['10.0.0.1', '192.168.1.1'],
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        acceptsEncodings: jest.fn(),
        acceptsLanguages: jest.fn(),
        range: jest.fn(),
        param: jest.fn(),
        is: jest.fn(),
        protocol: '',
        secure: false,
        subdomains: [],
        path: '',
        hostname: '',
        host: '',
        fresh: false,
        stale: false,
        xhr: false,
        body: {},
        cookies: {},
        method: '',
        params: {},
        query: {},
        route: {},
        signedCookies: {},
        originalUrl: '',
        url: '',
        baseUrl: '',
      } as any;

      const tracker = await throttleAuthGuard['getTracker'](mockReq);
      expect(tracker).toBe('10.0.0.1');
    });

    it('should have custom error message', () => {
      expect(throttleAuthGuard['errorMessage']).toBe(
        'Too many authentication attempts. Please try again later.'
      );
    });
  });

  describe('ThrottlePaymentsGuard', () => {
    it('should be defined', () => {
      expect(throttlePaymentsGuard).toBeDefined();
    });

    it('should return IP address as tracker', async () => {
      const mockReq = {
        ip: '192.168.1.1',
        ips: [],
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        acceptsEncodings: jest.fn(),
        acceptsLanguages: jest.fn(),
        range: jest.fn(),
        param: jest.fn(),
        is: jest.fn(),
        protocol: '',
        secure: false,
        subdomains: [],
        path: '',
        hostname: '',
        host: '',
        fresh: false,
        stale: false,
        xhr: false,
        body: {},
        cookies: {},
        method: '',
        params: {},
        query: {},
        route: {},
        signedCookies: {},
        originalUrl: '',
        url: '',
        baseUrl: '',
      } as any;

      const tracker = await throttlePaymentsGuard['getTracker'](mockReq);
      expect(tracker).toBe('192.168.1.1');
    });

    it('should have custom error message', () => {
      expect(throttlePaymentsGuard['errorMessage']).toBe(
        'Too many payment requests. Please try again later.'
      );
    });
  });
});
