import { ApiProperty } from '@nestjs/swagger'

export class SyncStatsDto {
  @ApiProperty({ example: 5 })
  shows: number

  @ApiProperty({ example: 12 })
  events: number

  @ApiProperty({ example: 3 })
  buildings: number

  @ApiProperty({ example: 8 })
  categories: number
}

export class SyncResponseDto {
  @ApiProperty({ example: 'Data synchronized successfully' })
  message: string

  @ApiProperty({ type: SyncStatsDto })
  stats: SyncStatsDto
}
