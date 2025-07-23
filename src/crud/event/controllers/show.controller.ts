import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators'
import { BigIntSerializerInterceptor } from '../../../common/interceptors'
import { EventService } from '../services'
import { ShopIdParamDto, ShowDto, UuidParamDto } from '../dto'

@ApiTags('Shows')
@Controller('shows')
@UseInterceptors(BigIntSerializerInterceptor)
export class ShowController {
  constructor(private readonly eventService: EventService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all shows',
    description: 'Retrieves all shows with their events and categories',
  })
  @ApiResponse({
    status: 200,
    description: 'Shows retrieved successfully',
    type: [ShowDto],
  })
  async getAllShows() {
    return this.eventService.getAllShows()
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get show by ID',
    description: 'Retrieves a specific show by its UUID with all related data',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Show UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Show retrieved successfully',
    type: ShowDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Show not found',
  })
  async getShowById(@Param() params: UuidParamDto) {
    return this.eventService.getShowById(params.id)
  }

  @Public()
  @Get('shop/:shopId')
  @ApiOperation({
    summary: 'Get shows by shop ID',
    description: 'Retrieves all shows for a specific shop with their events and categories',
  })
  @ApiParam({
    name: 'shopId',
    type: 'string',
    description: 'Shop ID to filter shows',
    example: '2723',
  })
  @ApiResponse({
    status: 200,
    description: 'Shows retrieved successfully',
    type: [ShowDto],
  })
  async getShowsByShopId(@Param() params: ShopIdParamDto) {
    return this.eventService.getShowsByShopId(params.shopId)
  }
}
