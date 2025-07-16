import { ApiProperty } from '@nestjs/swagger'

export class EventListItemDto {
  @ApiProperty({ format: 'uuid' })
  id: string

  @ApiProperty()
  externalId: number

  @ApiProperty()
  name: string

  @ApiProperty({ format: 'date-time' })
  date?: string

  @ApiProperty()
  address?: string

  @ApiProperty()
  minPrice?: number

  @ApiProperty()
  maxPrice?: number

  @ApiProperty()
  count: number

  @ApiProperty({ type: 'object', additionalProperties: true })
  show?: object

  @ApiProperty({ type: 'object', additionalProperties: true })
  building?: object
}

export class EventDetailDto {
  @ApiProperty({ format: 'uuid' })
  id: string

  @ApiProperty()
  externalId: number

  @ApiProperty()
  name: string

  @ApiProperty()
  showId?: number

  @ApiProperty()
  timeType?: number

  @ApiProperty({ format: 'date-time' })
  date?: string

  @ApiProperty({ format: 'date-time' })
  fixDate?: string

  @ApiProperty({ format: 'date-time' })
  endDate?: string

  @ApiProperty()
  timestamp?: string

  @ApiProperty()
  timezone?: string

  @ApiProperty()
  isPushkin: boolean

  @ApiProperty()
  locationId?: number

  @ApiProperty()
  locationName?: string

  @ApiProperty()
  serviceName?: string

  @ApiProperty()
  count: number

  @ApiProperty()
  minPrice?: number

  @ApiProperty()
  maxPrice?: number

  @ApiProperty()
  image?: string

  @ApiProperty()
  ageLimit: number

  @ApiProperty()
  desc?: string

  @ApiProperty()
  onlyPrivateSells: boolean

  @ApiProperty()
  isSeason: boolean

  @ApiProperty()
  isCovidFree: boolean

  @ApiProperty()
  isHideTime: boolean

  @ApiProperty()
  pipelineEventId?: number

  @ApiProperty()
  isAccessOnlyLink: boolean

  @ApiProperty()
  cityId?: number

  @ApiProperty()
  address?: string

  @ApiProperty({ type: 'object', additionalProperties: true })
  show?: object

  @ApiProperty({ type: 'object', additionalProperties: true })
  building?: object
}
