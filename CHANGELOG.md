# Changelog

All notable changes to this project will be documented in this file.
Please, document here only changes visible to the client app.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-03-11

### [47 Add Origin/CORS Validation and Global Exception Handling](https://github.com/torqlab/activity-image-generation-service/issues/47)

### Added
- Origin/CORS validation system with configurable allowed origins via `ALLOWED_ORIGINS` environment variable
- `OriginGuard` for validating incoming request origins with development mode fallback
- `OriginService` for managing allowed origins configuration
- Global exception filter for consistent error response formatting across all endpoints
- Husky pre-push hook for code quality checks (linting, formatting, tests)
- Support for Origin and Referer header validation

### Changed
- Enhanced CORS configuration with dynamic origin validation using `corsOriginCallback`
- Improved error handling with centralized exception filtering
- Added `.nvmrc`, `.prettierignore`, and enhanced ESLint configuration for improved development workflow

## [1.0.0] - 2026-03-11

### Added

- Initial release of Activity Image Generation Service
- `GET /api/v1/generator?prompt=<string>` endpoint for AI image generation
- `GET /api/v1/prompt?signals=<base64string>` endpoint for prompt generation from activity signals
- NestJS framework with modular architecture
- Full TypeScript support with strict mode enabled
- Input validation with class-validator
- Global exception filter with consistent error response format
- CORS configuration via environment variables
- Rate limiting with `@nestjs/throttler` (100 req/min global, 10 req/min per endpoint)
- Swagger/OpenAPI documentation at `/docs`
- Comprehensive unit tests for services
- E2E tests for endpoints
- Docker and docker-compose configuration
- ESLint and Prettier configurations
- Jest testing setup
- Comprehensive README documentation
- **Integrated forbidden content validation** (from `@torq/check-forbidden-content`)

### Technical Details

- **Port**: 3002 (configurable via PORT env var)
- **API Prefix**: `/api/v1`
- **Node.js**: 24.x
- **Package Manager**: Bun
- **Dependencies**:
  - `@torqlab/generate-activity-image` - Image generation
  - `@torqlab/get-activity-image-generation-prompt` - Prompt generation
  - NestJS ecosystem (`@nestjs/core`, `@nestjs/config`, `@nestjs/swagger`, `@nestjs/throttler`)
  - `class-validator` & `class-transformer` - DTO validation
  - `swagger-ui-express` - API documentation UI
- **Internal Utilities**:
  - Forbidden content validation (local implementation)
