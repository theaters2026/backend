import { Controller, Get, Query } from '@nestjs/common'
import { ParserService } from '../services'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators'
import { ParserQueryDto, ParserResponseDto } from '../dto'

@ApiTags('Parser')
@Controller('sync-data')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Public()
  @Get('info')
  @ApiOperation({ summary: 'Get information from poster' })
  @ApiResponse({
    status: 200,
    description: 'Information successfully retrieved and output to console',
    type: ParserResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during parsing',
  })
  async getInfo(@Query() query: ParserQueryDto): Promise<ParserResponseDto> {
    return this.parserService.getInfo(query.url)
  }
}
