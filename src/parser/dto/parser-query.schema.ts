import { z } from 'zod'

export const parserQuerySchema = z.object({
  url: z.string().url('Invalid URL format').optional(),
})
