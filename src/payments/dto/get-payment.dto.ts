import { ApiProperty } from '@nestjs/swagger'
import { GetPaymentSchema } from './get-payment.schema'

export class GetPaymentDto {
  static schema = GetPaymentSchema

  @ApiProperty({
    description: 'Payment ID',
    example: '2c85c4d0-000f-5000-8000-1e5c9dd9b0c7',
    type: String,
  })
  id!: string
}
