import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import generateActivityImage from '@torqlab/generate-activity-image';
import {
  ACTIVITY_IMAGE_GENERATION_PROMPT_DEFAULT,
} from '@torqlab/get-activity-image-generation-prompt';

import { ForbiddenContentService } from '../forbidden-content';
import { GeneratorResponseDto } from './dto';

@Injectable()
export class GeneratorService {
  private readonly logger = new Logger(GeneratorService.name);

  constructor(
    private configService: ConfigService,
    private forbiddenContentService: ForbiddenContentService,
  ) {}

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
