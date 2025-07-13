import { ApiProperty } from '@nestjs/swagger'
import { DeleteEventSchema } from './delete-event.schema'

export class DeleteEventDto {
  static schema = DeleteEventSchema

  @ApiProperty({
    description: 'Unique identifier of the event to be deleted',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    format: 'uuid',
  })
  id!: string
}
