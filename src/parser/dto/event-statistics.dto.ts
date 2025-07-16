import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

export const EventStatisticsSchema = z.object({
  total: z.number().int().nonnegative(),
  withImages: z.number().int().nonnegative(),
  withPrices: z.number().int().nonnegative(),
  withDates: z.number().int().nonnegative(),
  categories: z.record(z.string(), z.number().int().nonnegative()),
  ageRatings: z.record(z.string(), z.number().int().nonnegative()),
})

export class EventStatisticsDto {
  static schema = EventStatisticsSchema

  @ApiProperty({
    description: 'Общее количество событий',
    example: 150,
    type: Number,
    minimum: 0,
  })
  total!: number

  @ApiProperty({
    description: 'Количество событий с изображениями',
    example: 120,
    type: Number,
    minimum: 0,
  })
  withImages!: number

  @ApiProperty({
    description: 'Количество событий с указанными ценами',
    example: 100,
    type: Number,
    minimum: 0,
  })
  withPrices!: number

  @ApiProperty({
    description: 'Количество событий с указанными датами',
    example: 140,
    type: Number,
    minimum: 0,
  })
  withDates!: number

  @ApiProperty({
    description: 'Распределение по категориям',
    example: { Спектакль: 80, Концерт: 50, Выставка: 20 },
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  categories!: Record<string, number>

  @ApiProperty({
    description: 'Распределение по возрастным ограничениям',
    example: { '0+': 40, '6+': 30, '12+': 50, '18+': 30 },
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  ageRatings!: Record<string, number>
}
