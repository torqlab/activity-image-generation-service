import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { GeneratorService } from './generator.service';
import { GeneratorQueryDto, GeneratorResponseDto } from './dto';

@ApiTags('Generator')
@Controller('generator')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Get()
  @ApiOperation({
    summary: 'Generate AI image from prompt',
    description: 'Generates an AI image based on the provided text prompt.',
  })
  @ApiQuery({
    name: 'prompt',
    type: String,
    required: true,
    description: 'The text prompt for image generation',
  })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async generateImage(
    @Query() query: GeneratorQueryDto,
  ): Promise<GeneratorResponseDto> {
    if (query.prompt) {
      return this.generatorService.generateImage(query.prompt);
    } else {
      throw new BadRequestException('Prompt is required!');
    }
  }
}
