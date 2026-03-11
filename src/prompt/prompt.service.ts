import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import getActivityImageGenerationPrompt from '@torqlab/get-activity-image-generation-prompt';
import { StravaActivitySignals } from '@torqlab/get-strava-activity-signals';

import { ForbiddenContentService } from '../forbidden-content';
import { PromptResponseDto } from './dto';

/**
 * Service for generating image prompts from Strava activity signals.
 */
@Injectable()
export class PromptService {
  private readonly logger = new Logger(PromptService.name);

  /**
   * Creates an instance of PromptService.
   * @param {ForbiddenContentService} forbiddenContentService - Service to validate content for forbidden words
   */
  constructor(private forbiddenContentService: ForbiddenContentService) {}

  /**
   * Decodes base64-encoded activity signals JSON string.
   * @param {string} encodedSignals - Base64-encoded JSON string of activity signals
   * @returns {{StravaActivitySignals}} The decoded activity signals
   */
  decodeSignals(encodedSignals: string): StravaActivitySignals {
    try {
      const decoded = Buffer.from(encodedSignals, 'base64').toString('utf-8');

      return JSON.parse(decoded) as StravaActivitySignals;
    } catch (error) {
      this.logger.error('Failed to decode signals', error);

      if (error instanceof SyntaxError) {
        throw new BadRequestException('Invalid JSON in decoded signals');
      } else {
        throw new BadRequestException('Invalid base64-encoded signals');
      }
    }
  }

  /**
   * Generates an image prompt based on the provided activity signals.
   * @param {StravaActivitySignals} signals - The Strava activity signals
   * @returns {{PromptResponseDto}} The generated prompt
   */
  generatePrompt(signals: StravaActivitySignals): PromptResponseDto {
    try {
      const prompt = getActivityImageGenerationPrompt(
        signals,
        this.forbiddenContentService.check.bind(this.forbiddenContentService)
      );

      return { prompt };
    } catch (error) {
      this.logger.error('Prompt generation failed', error);
      throw new BadRequestException('Failed to generate prompt');
    }
  }
}
