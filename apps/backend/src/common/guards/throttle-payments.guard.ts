import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlePaymentsGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    // Use IP address as tracker for rate limiting
    return req.ips.length ? req.ips[0] : req.ip;
  }

  protected errorMessage = 'Too many payment requests. Please try again later.';
}
