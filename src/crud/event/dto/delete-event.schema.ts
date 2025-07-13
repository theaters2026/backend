import { z } from 'zod'

export const DeleteEventSchema = z.object({
  id: z.string().uuid('Invalid event id'),
})
