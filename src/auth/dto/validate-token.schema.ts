import { z } from 'zod'

export const validateTokenSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
})
