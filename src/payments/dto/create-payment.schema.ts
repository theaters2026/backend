import { z } from 'zod'
import { Currency } from '../enums/currency.enum'
import { ConfirmationType } from '../enums/confirmation-type.enum'

export const CreatePaymentSchema = z.object({
  amount: z.object({
    value: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
    currency: z.nativeEnum(Currency, { message: 'Invalid currency' }).default(Currency.RUB),
  }),
  description: z.string().optional(),
  confirmation: z.object({
    type: z.nativeEnum(ConfirmationType),
    return_url: z.string().url('Invalid return URL'),
  }),
  capture: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
})
