import { Module } from '@nestjs/common';
import { ForbiddenContentService } from './forbidden-content.service';

/**
 * Module for forbidden content filtering functionality.
 */
@Module({
  providers: [ForbiddenContentService],
  exports: [ForbiddenContentService],
})
export class ForbiddenContentModule {}
