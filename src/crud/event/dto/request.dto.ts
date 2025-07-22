import { ApiProperty } from '@nestjs/swagger'
import { syncDataSchema } from './sync-data.schema'

export class SyncDataDto {
  static schema = syncDataSchema

  @ApiProperty({
    description: 'Shop ID to sync data for',
    example: '2723',
    type: String,
  })
  shopId: string
}
