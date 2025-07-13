import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateEventDto } from '../dto/create-event.dto'
import { DeleteEventDto } from '../dto/delete-event.dto'
import { Event, EventDescription, EventMedia } from '@prisma/client'

type EventWithRelations = Event & {
  description: EventDescription | null
  media: EventMedia | null
}

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto): Promise<EventWithRelations> {
    return this.prisma.event.create({
      data: {
        name: dto.name,
        description: {
          create: {
            age: dto.description.age,
            address: dto.description.address,
            price: dto.description.price ?? null,
            date: dto.description.date ? new Date(dto.description.date) : null,
            org_name: dto.description.org_name ?? null,
          },
        },
        media: dto.media
          ? {
              create: {
                url: dto.media.url,
                type: dto.media.type,
              },
            }
          : undefined,
      },
      include: {
        description: true,
        media: true,
      },
    })
  }

  async getAll(): Promise<EventWithRelations[]> {
    return this.prisma.event.findMany({
      include: {
        description: true,
        media: true,
      },
      orderBy: {
        description: {
          date: 'asc',
        },
      },
    })
  }

  async delete(dto: DeleteEventDto): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.id },
    })

    if (!event) {
      throw new NotFoundException(`Event with id ${dto.id} not found`)
    }

    return this.prisma.event.delete({
      where: { id: dto.id },
    })
  }
}
