import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { PromptService } from './prompt.service';
import { PromptQueryDto, PromptResponseDto } from './dto';

@ApiTags('Prompt')
@Controller('prompt')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Get()
  @ApiOperation({
    summary: 'Generate image prompt from activity signals',
    description:
      'Generates an image generation prompt based on Strava activity signals encoded as base64 JSON.',
  })
  @ApiQuery({
    name: 'signals',
    type: String,
    required: true,
    description: 'Base64-encoded JSON string of StravaActivitySignals',
  })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  generatePrompt(@Query() query: PromptQueryDto): PromptResponseDto {
    if (query.signals) {
      const signals = this.promptService.decodeSignals(query.signals);

      return this.promptService.generatePrompt(signals);
    } else {
      throw new BadRequestException('Signals are required!');
    }
  }
}
