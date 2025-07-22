import { z } from 'zod'

export const syncDataSchema = z.object({
  shopId: z.string().min(1, 'Shop ID is required'),
})
