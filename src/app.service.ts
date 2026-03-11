import { Injectable } from '@nestjs/common';

/**
 * Service providing core application functionality.
 */
@Injectable()
export class AppService {
  /**
   * Gets the current status of the application.
   * @returns {{status: string}} The application status
   */
  getStatus(): { status: string } {
    return { status: 'ok' };
  }
}
