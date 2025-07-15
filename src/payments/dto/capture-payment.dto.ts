import { ApiProperty } from '@nestjs/swagger'
import { CapturePaymentSchema } from './capture-payment.schema'

export class CapturePaymentDto {
  static schema = CapturePaymentSchema

  @ApiProperty({
    description: 'Amount to capture (optional, if not provided - full amount will be captured)',
    example: {
      value: '100.00',
      currency: 'RUB',
    },
    required: false,
  })
  amount?: {
    value: string
    currency: string
  }
}
