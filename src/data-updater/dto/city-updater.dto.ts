import { ApiProperty } from '@nestjs/swagger'

export class CityUpdateStatsDto {
  @ApiProperty({ description: 'Number of events with address' })
  eventsWithAddress: number

  @ApiProperty({ description: 'Number of events with city_id' })
  eventsWithCityId: number

  @ApiProperty({ description: 'Number of events without city_id' })
  eventsWithoutCityId: number
}

export class CityUpdateResponseDto {
  @ApiProperty({ description: 'Response message' })
  message: string
}
