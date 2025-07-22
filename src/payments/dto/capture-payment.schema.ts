import { z } from 'zod'
import { Currency } from '../enums'

export const CapturePaymentSchema = z.object({
  amount: z
    .object({
      value: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
      currency: z.nativeEnum(Currency, { message: 'Invalid currency' }).default(Currency.RUB),
    })
    .optional(),
})
