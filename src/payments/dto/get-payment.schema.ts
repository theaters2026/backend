import { z } from 'zod'

export const GetPaymentSchema = z.object({
  id: z.string().min(1, 'Payment ID is required'),
})
