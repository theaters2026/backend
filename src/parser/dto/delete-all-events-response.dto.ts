import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

export const DeleteAllEventsResponseSchema = z.object({
  count: z.number().int().nonnegative(),
  message: z.string(),
})

export class DeleteAllEventsResponseDto {
  static schema = DeleteAllEventsResponseSchema

  @ApiProperty({
    description: 'Количество удаленных событий',
    example: 25,
    type: Number,
    minimum: 0,
  })
  count!: number

  @ApiProperty({
    description: 'Сообщение о результате удаления',
    example: 'Удалено 25 событий',
    type: String,
  })
  message!: string
}
