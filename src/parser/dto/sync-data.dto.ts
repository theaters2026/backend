import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

export const SyncDataSchema = z.object({
  url: z.string().url().optional(),
})

export class SyncDataDto {
  static schema = SyncDataSchema

  @ApiProperty({
    description: 'URL для парсинга конкретной страницы',
    example: 'https://example.com/events',
    type: String,
    format: 'url',
    required: false,
  })
  url?: string
}
