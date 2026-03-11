import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { GeneratorService } from './generator.service';
import { GeneratorQueryDto, GeneratorResponseDto } from './dto';

/**
 * Controller for image generation endpoints.
 */
@ApiTags('Generator')
@Controller('generator')
export class GeneratorController {
  /**
   * Creates an instance of GeneratorController.
   * @param {GeneratorService} generatorService - The generator service instance
   */
  constructor(private readonly generatorService: GeneratorService) {}

  /**
   * Endpoint to generate an AI image from a text prompt.
   * @param {GeneratorQueryDto} query - The query parameters containing the prompt text
   * @returns {{Promise<GeneratorResponseDto>}} The generated image response
   */
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
  async generateImage(@Query() query: GeneratorQueryDto): Promise<GeneratorResponseDto> {
    if (query.prompt) {
      return this.generatorService.generateImage(query.prompt);
    } else {
      throw new BadRequestException('Prompt is required!');
    }
  }
}
