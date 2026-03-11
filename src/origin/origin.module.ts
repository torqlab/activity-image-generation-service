import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { OriginGuard } from './origin.guard';
import { OriginService } from './origin.service';

/**
 * Module that provides origin validation functionality.
 * Registers OriginService globally and sets up OriginGuard for all routes.
 */
@Module({
  providers: [
    OriginService,
    {
      provide: APP_GUARD,
      useClass: OriginGuard,
    },
  ],
  exports: [OriginService],
})
export class OriginModule {}
