import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import generateActivityImage from '@torqlab/generate-activity-image';
import {
  ACTIVITY_IMAGE_GENERATION_PROMPT_DEFAULT,
} from '@torqlab/get-activity-image-generation-prompt';

import { ForbiddenContentService } from '../forbidden-content';
import { GeneratorResponseDto } from './dto';

/**
 * Service for generating AI activity images from text prompts.
 */
@Injectable()
export class GeneratorService {
  private readonly logger = new Logger(GeneratorService.name);

  /**
   * Creates an instance of GeneratorService.
   * @param {ConfigService} configService - The configuration service for accessing environment variables
   * @param {ForbiddenContentService} forbiddenContentService - Service to validate prompt content for forbidden words
   */
  constructor(
    private configService: ConfigService,
    private forbiddenContentService: ForbiddenContentService,
  ) {}

  /**
   * Generates an AI image based on the provided prompt text.
   * @param {string} prompt - The text prompt for image generation
   * @returns {{Promise<GeneratorResponseDto>}} The generated image and metadata
   */
  async generateImage(prompt: string): Promise<GeneratorResponseDto> {
    if (this.forbiddenContentService.check(prompt)) {
      throw new BadRequestException('Prompt contains forbidden content');
    } else {
      try {
        const providerApiKeys = {
          pollinations: this.configService.get<string>('POLLINATIONS_API_KEY') || '',
        };
        const image = await generateActivityImage({
          defaultPrompt: ACTIVITY_IMAGE_GENERATION_PROMPT_DEFAULT,
          provider: 'pollinations',
          prompt,
          providerApiKeys,
        });

        return {
          provider: 'pollinations',
          image,
          prompt,
        };
      } catch (error) {
        this.logger.error('Image generation failed', error);
        throw new BadRequestException('Failed to generate image');
      }
    }
  }
}
