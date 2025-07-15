import { z } from 'zod'

export const CapturePaymentSchema = z.object({
  amount: z
    .object({
      value: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
      currency: z.string().length(3, 'Currency must be 3 characters').default('RUB'),
    })
    .optional(),
})
