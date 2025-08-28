import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottleAuthGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    // Use IP address as tracker for rate limiting
    return req.ips.length ? req.ips[0] : req.ip;
  }

  protected errorMessage = 'Too many authentication attempts. Please try again later.';
}
