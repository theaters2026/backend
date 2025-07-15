import { ApiProperty } from '@nestjs/swagger'
import { WebhookSchema } from './webhook.schema'

export class WebhookDto {
  static schema = WebhookSchema

  @ApiProperty({
    description: 'Event type',
    example: 'payment.succeeded',
    type: String,
  })
  event!: string

  @ApiProperty({
    description: 'Payment object containing all payment details',
    example: {
      id: '2c85c4d0-000f-5000-8000-1e5c9dd9b0c7',
      status: 'succeeded',
      amount: {
        value: '100.00',
        currency: 'RUB',
      },
      created_at: '2024-01-15T12:00:00Z',
      description: 'Payment for order #123',
    },
  })
  object!: {
    id: string
    status: string
    amount: {
      value: string
      currency: string
    }
    created_at: string
    description?: string
    metadata?: Record<string, any>
  }
}
