import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { OriginService } from './origin.service';

/**
 * Guard that validates incoming request origins.
 * Extracts origin from request headers and checks against allowed origins list.
 * Allows originless requests in development mode for testing tools like curl/Postman.
 */
@Injectable()
export class OriginGuard implements CanActivate {
  /**
   * Initializes the origin guard with origin service and config service.
   * @param {OriginService} originService - Service for validating origins
   * @param {ConfigService} configService - NestJS ConfigService for environment variables
   */
  constructor(
    private readonly originService: OriginService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validates the request origin before allowing execution.
   * Checks Origin header first, then Referer header as fallback.
   * @param {ExecutionContext} context - NestJS ExecutionContext containing request
   * @returns {boolean} true if origin is allowed, throws ForbiddenException otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';

    const requestOrigin = this.extractOrigin(request);

    if (requestOrigin === null) {
      return nodeEnv === 'development';
    }

    const isAllowed = this.originService.isOriginAllowed(requestOrigin);

    if (!isAllowed) {
      throw new ForbiddenException(
        `Origin '${requestOrigin}' is not allowed to access this resource`,
      );
    }

    return true;
  }

  /**
   * Extracts origin from request headers.
   * Checks Origin header first, then falls back to Referer header.
   * @param {Request} request - Express request object
   * @returns {string | null} origin string or null if neither header present
   */
  private readonly extractOrigin = (request: Request): string | null => {
    const originHeader = request.headers.origin;

    if (originHeader && typeof originHeader === 'string') {
      return originHeader;
    }

    const refererHeader = request.headers.referer;

    if (refererHeader && typeof refererHeader === 'string') {
      return this.extractOriginFromReferer(refererHeader);
    }

    return null;
  };

  /**
   * Extracts origin from a Referer header URL.
   * Parses the URL and returns the origin (protocol + host).
   * @param {string} referer - The Referer header value
   * @returns {string | null} origin string or null if URL parsing fails
   */
  private readonly extractOriginFromReferer = (referer: string): string | null => {
    try {
      const url = new URL(referer);
      return url.origin;
    } catch {
      return null;
    }
  };
}
