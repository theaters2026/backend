import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

export const SyncResponseSchema = z.object({
  message: z.string(),
  count: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
  errors: z.array(z.string()),
})

export class SyncResponseDto {
  static schema = SyncResponseSchema

  @ApiProperty({
    description: 'Сообщение о результате синхронизации',
    example: 'Парсинг завершен. Сохранено: 15, пропущено: 2',
    type: String,
  })
  message!: string

  @ApiProperty({
    description: 'Количество успешно сохраненных событий',
    example: 15,
    type: Number,
    minimum: 0,
  })
  count!: number

  @ApiProperty({
    description: 'Количество пропущенных событий',
    example: 2,
    type: Number,
    minimum: 0,
  })
  skipped!: number

  @ApiProperty({
    description: 'Список ошибок при обработке',
    example: ['Ошибка при сохранении "Спектакль": Неверная дата'],
    type: [String],
  })
  errors!: string[]
}
