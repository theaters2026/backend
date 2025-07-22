import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class EventQueryService {
  private readonly logger = new Logger(EventQueryService.name)

  constructor(private prisma: PrismaService) {}

  async getAllEvents(): Promise<any[]> {
    try {
      return await this.prisma.event.findMany({
        include: {
          show: true,
          building: true,
        },
        orderBy: {
          date: 'asc',
        },
      })
    } catch (error) {
      this.logger.error(`Error fetching events`, error.stack)
      throw new InternalServerErrorException('Failed to fetch events')
    }
  }

  async getEventById(id: string): Promise<any> {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id },
        include: {
          show: {
            include: {
              showCategories: true,
            },
          },
          building: true,
        },
      })

      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`)
      }

      return event
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      this.logger.error(`Error fetching event ${id}`, error.stack)
      throw new InternalServerErrorException('Failed to fetch event')
    }
  }

  async getEventsByShopId(shopId: string): Promise<any[]> {
    try {
      return await this.prisma.event.findMany({
        where: {
          show: {
            shopId,
          },
        },
        include: {
          show: true,
          building: true,
        },
        orderBy: {
          date: 'asc',
        },
      })
    } catch (error) {
      this.logger.error(`Error fetching events for shop ${shopId}`, error.stack)
      throw new InternalServerErrorException('Failed to fetch events')
    }
  }
}
