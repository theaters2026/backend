import { Body, Controller, Delete, Get, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EventService } from '../services/event.service'
import { CreateEventDto } from '../dto/create-event.dto'
import { DeleteEventDto } from '../dto/delete-event.dto'

@ApiTags('Event Management')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new event',
    description:
      'Creates a new event with details including name, description, and optional media content',
  })
  @ApiResponse({
    status: 201,
    description: 'Event successfully created',
    type: CreateEventDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - Invalid input data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBody({
    type: CreateEventDto,
    description: 'Event creation data transfer object',
  })
  async create(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all events',
    description:
      'Retrieves all events with their descriptions and media content, ordered by date',
  })
  @ApiResponse({
    status: 200,
    description: 'Events successfully retrieved',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Event ID',
          },
          name: {
            type: 'string',
            description: 'Event name',
          },
          description: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              age: { type: 'number', description: 'Minimum age requirement' },
              address: { type: 'string', description: 'Event address' },
              price: {
                type: 'number',
                nullable: true,
                description: 'Event price',
              },
              date: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                description: 'Event date',
              },
              org_name: {
                type: 'string',
                nullable: true,
                description: 'Organizer name',
              },
            },
          },
          media: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'string', format: 'uuid' },
              url: { type: 'string', format: 'url', description: 'Media URL' },
              type: { type: 'string', description: 'Media type' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getAll() {
    return this.eventService.getAll()
  }

  @Delete('delete')
  @ApiOperation({
    summary: 'Delete an event by ID',
    description: 'Removes an existing event from the system using its UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully deleted',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'The ID of the deleted event',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found - The requested event does not exist',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBody({
    type: DeleteEventDto,
    description: 'Event deletion data transfer object containing the event ID',
  })
  delete(@Body() dto: DeleteEventDto) {
    return this.eventService.delete(dto)
  }
}
