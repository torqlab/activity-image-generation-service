import { ApiProperty } from '@nestjs/swagger';
import { GenerateActivityImageOutput } from '@torqlab/generate-activity-image';

/**
 * DTO for image generation response data.
 */
export class GeneratorResponseDto {
  @ApiProperty({
    description: 'Generated image data',
    type: 'object',
    example: { url: 'base64-encoded-image-data' },
  })
  image?: GenerateActivityImageOutput;

  @ApiProperty({
    description: 'Image provider used',
    example: 'pollinations',
  })
  provider?: string;

  @ApiProperty({
    description: 'Prompt used for generation',
    example: 'A runner at sunrise',
  })
  prompt?: string;
}
