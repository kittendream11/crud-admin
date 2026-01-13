import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-01-12T10:00:00Z',
      },
    },
  })
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
