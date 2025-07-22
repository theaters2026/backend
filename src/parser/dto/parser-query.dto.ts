import { ApiProperty } from '@nestjs/swagger'
import { parserQuerySchema } from './parser-query.schema'

export class ParserQueryDto {
  static schema = parserQuerySchema

  @ApiProperty({
    description: 'URL for parsing a specific page',
    example: 'https://example.com/events',
    type: String,
    format: 'url',
    required: false,
  })
  url?: string
}
