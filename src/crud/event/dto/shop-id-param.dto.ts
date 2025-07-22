import { ApiProperty } from '@nestjs/swagger'
import { shopIdParamSchema } from './shop-id-param.schema'

export class ShopIdParamDto {
  static schema = shopIdParamSchema

  @ApiProperty({
    description: 'Shop ID to filter by',
    example: '2723',
    type: String,
  })
  shopId: string
}
