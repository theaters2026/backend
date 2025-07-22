import { ApiProperty } from '@nestjs/swagger'

export class ParserResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Information successfully retrieved and output to console',
  })
  message: string

  @ApiProperty({
    description: 'Count of processed items',
    example: 42,
  })
  count: number
}
