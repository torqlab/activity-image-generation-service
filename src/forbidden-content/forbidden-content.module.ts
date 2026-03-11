import { Module } from '@nestjs/common';
import { ForbiddenContentService } from './forbidden-content.service';

@Module({
  providers: [ForbiddenContentService],
  exports: [ForbiddenContentService],
})
export class ForbiddenContentModule {}
