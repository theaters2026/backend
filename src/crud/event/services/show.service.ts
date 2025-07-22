import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ShowService {
  private readonly logger = new Logger(ShowService.name)

  constructor(private prisma: PrismaService) {}

  async getAllShows(): Promise<any[]> {
    try {
      return await this.prisma.show.findMany({
        include: {
          events: {
            include: {
              building: true,
            },
          },
          showCategories: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } catch (error) {
      this.logger.error(`Error fetching shows`, error.stack)
      throw new InternalServerErrorException('Failed to fetch shows')
    }
  }

  async getShowById(id: string): Promise<any> {
    try {
      const show = await this.prisma.show.findUnique({
        where: { id },
        include: {
          events: {
            include: {
              building: true,
            },
          },
          showCategories: true,
        },
      })

      if (!show) {
        throw new NotFoundException(`Show with ID ${id} not found`)
      }

      return show
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      this.logger.error(`Error fetching show ${id}`, error.stack)
      throw new InternalServerErrorException('Failed to fetch show')
    }
  }

  async getShowsByShopId(shopId: string): Promise<any[]> {
    try {
      return await this.prisma.show.findMany({
        where: { shopId },
        include: {
          events: {
            include: {
              building: true,
            },
          },
          showCategories: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } catch (error) {
      this.logger.error(`Error fetching shows for shop ${shopId}`, error.stack)
      throw new InternalServerErrorException('Failed to fetch shows')
    }
  }
}
