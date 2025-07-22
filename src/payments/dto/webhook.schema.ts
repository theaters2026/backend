import { z } from 'zod'
import { Currency, PaymentStatus, WebhookEvent } from '../enums'

export const WebhookSchema = z.object({
  event: z.nativeEnum(WebhookEvent, { message: 'Invalid webhook event type' }),
  object: z.object({
    id: z.string().min(1, 'Payment ID is required'),
    status: z.nativeEnum(PaymentStatus, { message: 'Invalid payment status' }),
    amount: z.object({
      value: z.string(),
      currency: z.nativeEnum(Currency, { message: 'Invalid currency' }),
    }),
    created_at: z.string(),
    description: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
})
