import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateEventDto } from '../dto/create-event.dto'
import { DeleteEventDto } from '../dto/delete-event.dto'
import { EventWithRelations } from '../types'
import { Event, Prisma } from '@prisma/client'

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name)

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto): Promise<EventWithRelations> {
    try {
      return await this.prisma.event.create({
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
    } catch (error) {
      this.logger.error(`Error creating event: ${error.message}`, error.stack)

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Event with this name already exists')
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Related record not found')
        }
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid data provided')
      }

      throw new InternalServerErrorException('Failed to create event')
    }
  }

  async getAll(): Promise<EventWithRelations[]> {
    try {
      return await this.prisma.event.findMany({
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
    } catch (error) {
      this.logger.error(`Error fetching events: ${error.message}`, error.stack)

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException('Database error while fetching events')
      }

      throw new InternalServerErrorException('Failed to fetch events')
    }
  }

  async delete(dto: DeleteEventDto): Promise<Event> {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: dto.id },
      })

      if (!event) {
        throw new NotFoundException(`Event with id ${dto.id} not found`)
      }

      return await this.prisma.event.delete({
        where: { id: dto.id },
      })
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      this.logger.error(`Error deleting event: ${error.message}`, error.stack)

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Event with id ${dto.id} not found`)
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Cannot delete event due to existing references')
        }
      }

      throw new InternalServerErrorException('Failed to delete event')
    }
  }
}
