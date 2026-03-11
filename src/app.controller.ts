import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

/**
 * Main application controller.
 */
@Controller()
export class AppController {
  /**
   * Creates an instance of AppController.
   * @param {AppService} appService - The application service instance
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Returns the status of the application.
   * @returns {{status: string}} The application status
   */
  @Get()
  getStatus(): { status: string } {
    return this.appService.getStatus();
  }
}
