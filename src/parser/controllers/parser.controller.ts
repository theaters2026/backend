import { Controller, Get, Query } from '@nestjs/common'
import { ParserService } from '../services/parser.service'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators'

@ApiTags('parser')
@Controller('sync-data')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Public()
  @Get('info')
  @ApiOperation({
    summary: 'Get information from poster',
    description:
      'Starts parsing data from poster and outputs information to console. You can pass a URL to parse a specific page or leave empty for default parsing',
  })
  @ApiQuery({
    name: 'url',
    required: false,
    description: 'URL for parsing a specific page',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Information successfully retrieved and output to console',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        count: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during parsing',
  })
  async getInfo(@Query('url') url?: string) {
    return this.parserService.getInfo(url)
  }
}
