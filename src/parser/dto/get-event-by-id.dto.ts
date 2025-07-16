import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

export const GetEventByIdSchema = z.object({
  id: z.string().uuid('ID должен быть в формате UUID'),
})

export class GetEventByIdDto {
  static schema = GetEventByIdSchema

  @ApiProperty({
    description: 'Уникальный идентификатор события',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    format: 'uuid',
  })
  id!: string
}
