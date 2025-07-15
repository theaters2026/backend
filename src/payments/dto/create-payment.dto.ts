import { ApiProperty } from '@nestjs/swagger'
import { CreatePaymentSchema } from './create-payment.schema'

export class CreatePaymentDto {
  static schema = CreatePaymentSchema

  @ApiProperty({
    description: 'Payment amount details',
    example: {
      value: '100.00',
      currency: 'RUB',
    },
    type: 'object',
    properties: {
      value: { type: 'string', example: '100.00' },
      currency: { type: 'string', example: 'RUB' },
    },
  })
  amount!: {
    value: string
    currency: string
  }

  @ApiProperty({
    description: 'Payment description',
    example: 'Оплата заказа #123',
    required: false,
  })
  description?: string

  @ApiProperty({
    description: 'Payment confirmation details',
    example: {
      type: 'redirect',
      return_url: 'https://example.com/return',
    },
    type: 'object',
    properties: {
      type: { type: 'string', example: 'redirect' },
      return_url: { type: 'string', example: 'https://example.com/return' },
    },
  })
  confirmation!: {
    type: 'redirect'
    return_url: string
  }

  @ApiProperty({
    description: 'Auto capture payment',
    example: true,
    default: true,
    required: false,
  })
  capture?: boolean

  @ApiProperty({
    description: 'Additional metadata',
    example: { order_id: '12345' },
    required: false,
  })
  metadata?: Record<string, any>
}
