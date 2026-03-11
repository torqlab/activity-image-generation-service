import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service for managing and validating allowed request origins.
 * Parses comma-separated origins from ALLOWED_ORIGINS environment variable.
 */
@Injectable()
export class OriginService {
  private readonly allowedOrigins: string[];

  /**
   * Initializes the origin service with allowed origins from configuration.
   * Parses comma-separated values and trims whitespace.
   * @param {ConfigService} configService - NestJS ConfigService for environment variable access
   */
  constructor(private readonly configService: ConfigService) {
    const originsEnv = this.configService.get<string>('ALLOWED_ORIGINS') || '';
    this.allowedOrigins = originsEnv
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
  }

  /**
   * Retrieves the list of allowed origins.
   * @returns {string[]} Array of allowed origin strings
   */
  getAllowedOrigins(): string[] {
    return this.allowedOrigins;
  }

  /**
   * Checks if a given origin is allowed.
   * Performs strict equality check against allowed origins list.
   * @param {string} origin - The origin to validate
   * @returns {boolean} true if origin is in the allowed list, false otherwise
   */
  isOriginAllowed(origin: string): boolean {
    return this.allowedOrigins.includes(origin);
  }
}
