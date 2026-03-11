import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
  const origin = configService.get<string>('ORIGIN') || 'http://localhost:3001';
  const port = configService.get<number>('PORT') || 3002;
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Activity Image Generation Service')
      .setDescription('REST API for generating AI-based activity images.')
      .setVersion('1.0')
      .addTag('Generator', 'Image generation endpoints')
      .addTag('Prompt', 'Prompt generation endpoints')
      .build(),
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
    }),
  );
  app.setGlobalPrefix('api/v1');  
  app.enableCors({
    credentials: true,
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    origin,
  });

  SwaggerModule.setup('docs', app, document);

  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Environment: ${nodeEnv}`);
  console.log(`API Docs: http://localhost:${port}/docs`);
  console.log(`CORS Origin: ${origin}`);
};

bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});
