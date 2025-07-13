import { Event, EventDescription, EventMedia } from '@prisma/client'

export type EventWithRelations = Event & {
  description: EventDescription | null
  media: EventMedia | null
}
