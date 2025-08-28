import { Test, TestingModule } from '@nestjs/testing';
import { ThrottleAuthGuard } from './throttle-auth.guard';
import { ThrottlePaymentsGuard } from './throttle-payments.guard';

describe('Security Guards', () => {
  let throttleAuthGuard: ThrottleAuthGuard;
  let throttlePaymentsGuard: ThrottlePaymentsGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThrottleAuthGuard, ThrottlePaymentsGuard],
    }).compile();

    throttleAuthGuard = module.get<ThrottleAuthGuard>(ThrottleAuthGuard);
    throttlePaymentsGuard = module.get<ThrottlePaymentsGuard>(ThrottlePaymentsGuard);
  });

  describe('ThrottleAuthGuard', () => {
    it('should be defined', () => {
      expect(throttleAuthGuard).toBeDefined();
    });

    it('should return IP address as tracker', () => {
      const mockReq = {
        ip: '192.168.1.1',
        ips: [],
      };

      const tracker = throttleAuthGuard['getTracker'](mockReq);
      expect(tracker).toBe('192.168.1.1');
    });

    it('should return first IP from ips array', () => {
      const mockReq = {
        ip: '192.168.1.1',
        ips: ['10.0.0.1', '192.168.1.1'],
      };

      const tracker = throttleAuthGuard['getTracker'](mockReq);
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

    it('should return IP address as tracker', () => {
      const mockReq = {
        ip: '192.168.1.1',
        ips: [],
      };

      const tracker = throttlePaymentsGuard['getTracker'](mockReq);
      expect(tracker).toBe('192.168.1.1');
    });

    it('should have custom error message', () => {
      expect(throttlePaymentsGuard['errorMessage']).toBe(
        'Too many payment requests. Please try again later.'
      );
    });
  });
});
