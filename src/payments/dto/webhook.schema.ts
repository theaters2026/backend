import { z } from 'zod'

export const WebhookSchema = z.object({
  event: z.string().min(1, 'Event type is required'),
  object: z.object({
    id: z.string().min(1, 'Payment ID is required'),
    status: z.string().min(1, 'Status is required'),
    amount: z.object({
      value: z.string(),
      currency: z.string(),
    }),
    created_at: z.string(),
    description: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
})
