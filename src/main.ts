import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters';
import { OriginService } from './origin';

/**
 * Type definition for CORS origin validation callback.
 */
type OriginCallback = (error: Error | null, allowed: boolean) => void;

/**
 * Module-scoped variable to store OriginService instance and nodeEnv.
 * Used by the CORS origin validator callback.
 */
const moduleConfig = {
  originService: null as OriginService | null,
  nodeEnv: 'development',
};

/**
 * Validates CORS origin from request header.
 * Checks if origin is allowed based on OriginService configuration.
 * Allows originless requests in development mode.
 * Uses module-scoped config for dependency access.
 * @param {string | undefined} requestOrigin - The origin from the request header
 * @param {OriginCallback} callback - NestJS CORS callback function
 */
const corsOriginCallback = (requestOrigin: string | undefined, callback: OriginCallback): void => {
  if (!requestOrigin) {
    callback(null, moduleConfig.nodeEnv === 'development');
    return;
  }

  if (!moduleConfig.originService) {
    callback(new Error('Origin service not initialized'), false);
    return;
  }

  const isAllowed = moduleConfig.originService.isOriginAllowed(requestOrigin);

  if (isAllowed) {
    callback(null, true);
  } else {
    callback(new Error(`Origin '${requestOrigin}' is not allowed by CORS`), false);
  }
};

/**
 * Initializes and starts the NestJS application.
 */
const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const originService = app.get(OriginService);
  moduleConfig.originService = originService;
  moduleConfig.nodeEnv = configService.get<string>('NODE_ENV') || 'development';

  const nodeEnv = moduleConfig.nodeEnv;
  const port = configService.get<number>('PORT') || 3002;
  const allowedOrigins = originService.getAllowedOrigins();
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Activity Image Generation Service')
      .setDescription('REST API for generating AI-based activity images.')
      .setVersion('1.0')
      .addTag('Generator', 'Image generation endpoints')
      .addTag('Prompt', 'Prompt generation endpoints')
      .build()
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    credentials: true,
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    origin: corsOriginCallback,
  });

  SwaggerModule.setup('docs', app, document);

  await app.listen(port, '0.0.0.0');

  console.info(`Application is running on: http://localhost:${port}`);
  console.info(`Environment: ${nodeEnv}`);
  console.info(`API Docs: http://localhost:${port}/docs`);
  console.info(
    `Allowed origins: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'none'}`
  );
};

bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});
