import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EventService } from '../services/event.service'
import { Public } from 'src/common/decorators'
import { BigIntSerializerInterceptor } from '../../../common/interceptors/bigint-serializer.interceptor'

@ApiTags('Event Management')
@Controller('event')
@UseInterceptors(BigIntSerializerInterceptor)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Public()
  @Post('sync-data')
  @ApiOperation({
    summary: 'Sync shows and events data from external API',
    description: 'Fetches shows and events data from external API and saves it to the database',
  })
  @ApiResponse({
    status: 200,
    description: 'Data synchronized successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Data synchronized successfully',
        },
        stats: {
          type: 'object',
          properties: {
            shows: { type: 'number', example: 5 },
            events: { type: 'number', example: 12 },
            buildings: { type: 'number', example: 3 },
            categories: { type: 'number', example: 8 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to sync data',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        shopId: {
          type: 'string',
          example: '2723',
          description: 'Shop ID to sync data for',
        },
      },
      required: ['shopId'],
    },
  })
  async syncData(@Body() body: { shopId: string }) {
    return this.eventService.syncData(body.shopId)
  }

  @Public()
  @Get('shows')
  @ApiOperation({
    summary: 'Get all shows',
    description: 'Retrieves all shows with their events and categories',
  })
  @ApiResponse({
    status: 200,
    description: 'Shows retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          externalId: { type: 'number' },
          name: { type: 'string' },
          image: { type: 'string', nullable: true },
          desc: { type: 'string', nullable: true },
          partnerId: { type: 'number' },
          ageLimit: { type: 'number' },
          shortInfo: { type: 'string', nullable: true },
          fullInfo: { type: 'string', nullable: true },
          duration: { type: 'string', nullable: true },
          minPrice: { type: 'number', nullable: true },
          maxPrice: { type: 'number', nullable: true },
          isPushkin: { type: 'boolean' },
          shopId: { type: 'string' },
          events: {
            type: 'array',
            items: { type: 'object' },
          },
          showCategories: {
            type: 'array',
            items: { type: 'object' },
          },
        },
      },
    },
  })
  async getAllShows() {
    return this.eventService.getAllShows()
  }

  @Public()
  @Get('events')
  @ApiOperation({
    summary: 'Get all events',
    description: 'Retrieves all events with their show and building information',
  })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          externalId: { type: 'number' },
          name: { type: 'string' },
          date: { type: 'string', format: 'date-time', nullable: true },
          address: { type: 'string', nullable: true },
          minPrice: { type: 'number', nullable: true },
          maxPrice: { type: 'number', nullable: true },
          count: { type: 'number' },
          show: { type: 'object', nullable: true },
          building: { type: 'object', nullable: true },
        },
      },
    },
  })
  async getAllEvents() {
    return this.eventService.getAllEvents()
  }

  @Public()
  @Get('shows/shop/:shopId')
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
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          externalId: { type: 'number' },
          name: { type: 'string' },
          image: { type: 'string', nullable: true },
          desc: { type: 'string', nullable: true },
          partnerId: { type: 'number' },
          ageLimit: { type: 'number' },
          shortInfo: { type: 'string', nullable: true },
          fullInfo: { type: 'string', nullable: true },
          duration: { type: 'string', nullable: true },
          minPrice: { type: 'number', nullable: true },
          maxPrice: { type: 'number', nullable: true },
          isPushkin: { type: 'boolean' },
          shopId: { type: 'string' },
          events: {
            type: 'array',
            items: { type: 'object' },
          },
          showCategories: {
            type: 'array',
            items: { type: 'object' },
          },
        },
      },
    },
  })
  async getShowsByShopId(@Param('shopId') shopId: string) {
    return this.eventService.getShowsByShopId(shopId)
  }

  @Public()
  @Get('events/shop/:shopId')
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
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          externalId: { type: 'number' },
          name: { type: 'string' },
          date: { type: 'string', format: 'date-time', nullable: true },
          address: { type: 'string', nullable: true },
          minPrice: { type: 'number', nullable: true },
          maxPrice: { type: 'number', nullable: true },
          count: { type: 'number' },
          show: { type: 'object', nullable: true },
          building: { type: 'object', nullable: true },
        },
      },
    },
  })
  async getEventsByShopId(@Param('shopId') shopId: string) {
    return this.eventService.getEventsByShopId(shopId)
  }
}
