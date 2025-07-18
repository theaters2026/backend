import { ApiProperty } from '@nestjs/swagger'
import { parserQuerySchema } from './parser-query.schema'

export class ParserQueryDto {
  static schema = parserQuerySchema

  @ApiProperty({
    description: 'URL for parsing a specific page',
    example:
      'https://www.afisha.ru/w/creations/performance/2487/f9f12827-da00-4200-80aa-b755ed5e3e51/https',
    type: String,
    format: 'url',
    required: false,
  })
  url?: string
}
