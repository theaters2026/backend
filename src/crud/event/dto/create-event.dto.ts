import { ApiProperty } from '@nestjs/swagger'
import {
  CreateEventDescriptionSchema,
  CreateEventMediaSchema,
  CreateEventSchema,
} from './create-event.schema'

export class CreateEventDescriptionDto {
  static schema = CreateEventDescriptionSchema

  @ApiProperty({
    description: 'Minimum age requirement for the event',
    example: 18,
    type: Number,
    minimum: 0,
  })
  age!: number

  @ApiProperty({
    description: 'Physical address where the event takes place',
    example: '123 Event Street, City, Country',
    type: String,
  })
  address!: string

  @ApiProperty({
    description: 'Event ticket price',
    example: 49.99,
    type: Number,
    required: false,
  })
  price?: number

  @ApiProperty({
    description: 'Event date and time',
    example: '2025-12-31T20:00:00Z',
    type: String,
    required: false,
  })
  date?: string

  @ApiProperty({
    description: 'Name of the organizing entity',
    example: 'Event Organizers Inc.',
    type: String,
    required: false,
  })
  org_name?: string
}

export class CreateEventMediaDto {
  static schema = CreateEventMediaSchema

  @ApiProperty({
    description: 'URL of the event media content',
    example: 'https://example.com/event-image.jpg',
    type: String,
    format: 'url',
  })
  url!: string

  @ApiProperty({
    description: 'Type of media content',
    example: 'image',
    type: String,
  })
  type!: string
}

export class CreateEventDto {
  static schema = CreateEventSchema

  @ApiProperty({
    description: 'Name of the event',
    example: 'Summer Music Festival 2025',
    type: String,
    minLength: 1,
  })
  name!: string

  @ApiProperty({
    description: 'Detailed description of the event',
    type: CreateEventDescriptionDto,
  })
  description!: CreateEventDescriptionDto

  @ApiProperty({
    description: 'Media content associated with the event',
    type: CreateEventMediaDto,
    required: false,
  })
  media?: CreateEventMediaDto
}
