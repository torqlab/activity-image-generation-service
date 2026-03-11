import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import getActivityImageGenerationPrompt from '@torqlab/get-activity-image-generation-prompt';
import { StravaActivitySignals } from '@torqlab/get-strava-activity-signals';

import { ForbiddenContentService } from '../forbidden-content';
import { PromptResponseDto } from './dto';

@Injectable()
export class PromptService {
  private readonly logger = new Logger(PromptService.name);

  constructor(private forbiddenContentService: ForbiddenContentService) {}

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

  generatePrompt(signals: StravaActivitySignals): PromptResponseDto {
    try {
      const prompt = getActivityImageGenerationPrompt(
        signals,
        this.forbiddenContentService.check.bind(this.forbiddenContentService),
      );

      return { prompt };
    } catch (error) {
      this.logger.error('Prompt generation failed', error);
      throw new BadRequestException('Failed to generate prompt');
    }
  }
}
