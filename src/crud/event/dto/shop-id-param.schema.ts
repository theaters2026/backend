import { z } from 'zod'

export const shopIdParamSchema = z.object({
  shopId: z.string().min(1, 'Shop ID is required'),
})
