import { z } from 'zod'

export const CreateEventDescriptionSchema = z.object({
  age: z.number().int().nonnegative(),
  address: z.string().min(1),
  price: z.number().optional(),
  date: z.string().optional(),
  org_name: z.string().optional(),
})

export const CreateEventMediaSchema = z.object({
  url: z.string().url(),
  type: z.string().min(1),
})

export const CreateEventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  description: CreateEventDescriptionSchema,
  media: CreateEventMediaSchema.optional(),
})
