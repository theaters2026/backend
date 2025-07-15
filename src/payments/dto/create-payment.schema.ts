import { z } from 'zod'

export const CreatePaymentSchema = z.object({
  amount: z.object({
    value: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
    currency: z.string().length(3, 'Currency must be 3 characters').default('RUB'),
  }),
  description: z.string().optional(),
  confirmation: z.object({
    type: z.literal('redirect'),
    return_url: z.string().url('Invalid return URL'),
  }),
  capture: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
})
