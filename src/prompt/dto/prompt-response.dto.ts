import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for prompt generation response data.
 */
export class PromptResponseDto {
  @ApiProperty({
    description: 'Generated image generation prompt',
    example: 'A professional athlete running in morning sunlight, minimalistic style',
  })
  prompt?: string;
}
