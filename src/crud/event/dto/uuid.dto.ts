import { ApiProperty } from '@nestjs/swagger'
import { uuidParamSchema } from './uuid-param.schema'

export class UuidParamDto {
  static schema = uuidParamSchema

  @ApiProperty({
    description: 'UUID identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    format: 'uuid',
  })
  id: string
}
