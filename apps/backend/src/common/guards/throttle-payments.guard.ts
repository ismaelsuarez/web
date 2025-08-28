import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerRequest } from '../../types';

@Injectable()
export class ThrottlePaymentsGuard extends ThrottlerGuard {
  protected async getTracker(req: ThrottlerRequest): Promise<string> {
    // Use IP address as tracker for rate limiting
    return req.ips.length ? (req.ips[0] as string) : (req.ip || 'unknown');
  }

  protected errorMessage = 'Too many payment requests. Please try again later.';
}
