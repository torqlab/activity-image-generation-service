# Activity Image Generation Service

Standalone REST API service for generating AI images and prompts from activity signals.

## Overview

This service provides two main endpoints for the TORQ system:

1. **Image Generation** (`GET /api/v1/generator?prompt=<string>`) - Generates AI images from text prompts
2. **Prompt Generation** (`GET /api/v1/prompt?signals=<base64string>`) - Creates image prompts from Strava activity signals

## Quick Start

### Prerequisites

- Node.js 24.x
- Bun (package manager / runtime)
- Environment variables configured (see `.env.example`)

### Installation

```bash
bun install
```

### Development

```bash
bun run start:dev
```

Server runs on `http://localhost:3002`

### Production

```bash
bun run build
bun run start
```

## API Endpoints

### `GET /api/v1/generator`

Generates an AI image from a text prompt.

**Query Parameters:**
- `prompt` (string, required) - The text prompt for image generation

**Response (200 OK):**
```json
{
  "image": { /* image data */ },
  "provider": "pollinations",
  "prompt": "The provided prompt"
}
```

**Error Response (4xx/5xx):**
```json
{
  "error": "Error type",
  "message": "Error description"
}
```

### `GET /api/v1/prompt`

Generates an image prompt from Strava activity signals.

**Query Parameters:**
- `signals` (string, required) - Base64-encoded JSON of `StravaActivitySignals`

**Response (200 OK):**
```json
{
  "prompt": "Generated image prompt"
}
```

**Error Response (4xx/5xx):**
```json
{
  "error": "Error type",
  "message": "Error description"
}
```

## Configuration

Environment variables (see `.env.example`):

```bash
# Server
PORT=3002
NODE_ENV=development

# CORS
ORIGIN=http://localhost:3001

# Image Generation
POLLINATIONS_API_KEY=your_api_key
```

## Features

- ✅ **NestJS Framework** - Modular, scalable architecture
- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **API Documentation** - Swagger/OpenAPI at `/docs`
- ✅ **Input Validation** - class-validator with DTOs
- ✅ **Rate Limiting** - `@nestjs/throttler` (100 req/min global, 10 req/min per endpoint)
- ✅ **CORS Support** - Configurable via env var
- ✅ **Error Handling** - Global exception filter with consistent response format
- ✅ **Testing** - Jest unit tests and e2e tests
- ✅ **Containerized** - Dockerfile and docker-compose included

## Scripts

```bash
# Development
bun run start:dev        # Watch mode
bun run start:debug      # Debug mode

# Production
bun run build            # Build TypeScript
bun run start            # Start production server

# Code Quality
bun run lint             # ESLint check
bun run lint:fix         # ESLint auto-fix
bun run format           # Prettier format code

# Testing
bun run test             # Jest unit tests
bun run test:watch       # Jest watch mode
bun run test:cov         # Coverage report
bun run test:e2e         # E2E tests
```

## Docker

### Build

```bash
docker build -t activity-image-generation-service:latest .
```

### Run

```bash
docker run -p 3002:3002 \
  -e ORIGIN=http://localhost:3001 \
  -e POLLINATIONS_API_KEY=your_key \
  activity-image-generation-service:latest
```

### Docker Compose

```bash
docker-compose up --build
```

## Architecture

```
src/
├── main.ts                    # Application bootstrap
├── app.module.ts              # Root module
├── app.controller.ts          # Status endpoint
├── app.service.ts             # Status service
├── filters/                   # Global exception filter
├── forbidden-content/         # Forbidden content Check module
├── generator/                 # Image generation module
│   ├── generator.module.ts
│   ├── generator.controller.ts
│   ├── generator.service.ts
│   └── dto/
├── prompt/                    # Prompt generation module
│   ├── prompt.module.ts
│   ├── prompt.controller.ts
│   ├── prompt.service.ts
│   └── dto/
└── types/                     # Shared types (if needed)
```

## Dependencies

### Core
- `@nestjs/core` - NestJS framework
- `@nestjs/common` - Common decorators and utilities
- `@nestjs/config` - Environment configuration
- `@nestjs/platform-express` - Express adapter
- `@nestjs/swagger` - OpenAPI documentation
- `@nestjs/throttler` - Rate limiting

### Business Logic
- `@torqlab/generate-activity-image` - Image generation
- `@torqlab/get-activity-image-generation-prompt` - Prompt generation
- `@torqlab/get-strava-activity-signals` - Type definitions

### Utilities
- `class-validator` - Input validation
- `class-transformer` - DTO transformation
- `reflect-metadata` - TypeScript metadata

### Built-in
- **Forbidden Content Validation** - Local TypeScript implementation with regex patterns for detecting:
  - Real persons or identifiable individuals
  - Political or ideological symbols
  - Explicit violence or sexual content
  - Military or combat scenes
  - Text/captions/typography instructions

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3002
lsof -ti:3002 | xargs kill -9

# Or use different port
PORT=3003 bun run start:dev
```

### Build Issues

```bash
# Clear dist and node_modules
rm -rf dist node_modules
bun install
bun run build
```

### Tests Failing

```bash
# Run specific test file
bun run test generator.service.spec

# Run with coverage
bun run test:cov
```

## Related Services

- **@torq/server** - Main API server (OAuth, Strava integration)
- **@torq/ui** - Frontend application
- **@torqlab/generate-activity-image** - Image generation library
- **@torqlab/get-activity-image-generation-prompt** - Prompt generation library
- **@torqlab/get-strava-activity-signals** - Signal extraction library
- **@torqlab/strava-api** - Strava API client

## License

MIT © [Bohdan Balov](https://balov.dev)
