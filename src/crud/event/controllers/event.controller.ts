import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators'
import { BigIntSerializerInterceptor } from '../../../common/interceptors/bigint-serializer.interceptor'
import { EventService } from '../services/event.service'
import { UuidParamDto } from '../dto/uuid.dto'
import { ShopIdParamDto } from '../dto/shop-id-param.dto'
import { EventListItemDto, EventDetailDto } from '../dto/event-list.dto'

@ApiTags('Events')
@Controller('events')
@UseInterceptors(BigIntSerializerInterceptor)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all events',
    description: 'Retrieves all events with their show and building information',
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    type: [EventListItemDto],
  })
  async getAllEvents() {
    return this.eventService.getAllEvents()
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get event by ID',
    description: 'Retrieves a specific event by its UUID with all related data',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully',
    type: EventDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
  })
  async getEventById(@Param() params: UuidParamDto) {
    return this.eventService.getEventById(params.id)
  }

  @Public()
  @Get('shop/:shopId')
  @ApiOperation({
    summary: 'Get events by shop ID',
    description:
      'Retrieves all events for a specific shop with their show and building information',
  })
  @ApiParam({
    name: 'shopId',
    type: 'string',
    description: 'Shop ID to filter events',
    example: '2723',
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    type: [EventListItemDto],
  })
  async getEventsByShopId(@Param() params: ShopIdParamDto) {
    return this.eventService.getEventsByShopId(params.shopId)
  }
}
