import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators'
import { BigIntSerializerInterceptor } from '../../../common/interceptors'
import { EventService } from '../services'
import { SyncDataDto, SyncResponseDto } from '../dto'

@ApiTags('Data Synchronization')
@Controller('sync')
@UseInterceptors(BigIntSerializerInterceptor)
export class DataSyncController {
  constructor(private readonly eventService: EventService) {}

  @Public()
  @Post('data')
  @ApiOperation({
    summary: 'Sync shows and events data from external API',
    description: 'Fetches shows and events data from external API and saves it to the database',
  })
  @ApiResponse({
    status: 200,
    description: 'Data synchronized successfully',
    type: SyncResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to sync data',
  })
  @ApiBody({ type: SyncDataDto })
  async syncData(@Body() syncDataDto: SyncDataDto) {
    return this.eventService.syncData(syncDataDto.shopId)
  }
}
