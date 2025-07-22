import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class TypeUpdaterService {
  private readonly logger = new Logger(TypeUpdaterService.name)

  constructor(private prisma: PrismaService) {}

  async updateShowTypes(): Promise<{ updated: number; errors: number }> {
    let updated = 0
    let errors = 0

    try {
      const shows = await this.prisma.show.findMany({
        where: {
          detailed_url: {
            not: null,
          },
        },
        select: {
          id: true,
          detailed_url: true,
          type_num: true,
        },
      })

      this.logger.log(`Found ${shows.length} shows to process`)

      for (const show of shows) {
        try {
          const newTypeNum = this.extractTypeFromUrl(show.detailed_url)

          if (newTypeNum && newTypeNum !== show.type_num) {
            await this.prisma.show.update({
              where: { id: show.id },
              data: { type_num: newTypeNum },
            })
            updated++
            this.logger.debug(`Updated show ${show.id}: type_num = ${newTypeNum}`)
          }
        } catch (error) {
          errors++
          this.logger.error(`Error updating show ${show.id}:`, error)
        }
      }

      this.logger.log(`Type update completed: ${updated} updated, ${errors} errors`)
      return { updated, errors }
    } catch (error) {
      this.logger.error('Error in updateShowTypes:', error)
      throw error
    }
  }

  async updateSingleShow(showId: string): Promise<boolean> {
    try {
      const show = await this.prisma.show.findUnique({
        where: { id: showId },
        select: {
          id: true,
          detailed_url: true,
          type_num: true,
        },
      })

      if (!show) {
        this.logger.warn(`Show with id ${showId} not found`)
        return false
      }

      const newTypeNum = this.extractTypeFromUrl(show.detailed_url)

      if (newTypeNum && newTypeNum !== show.type_num) {
        await this.prisma.show.update({
          where: { id: showId },
          data: { type_num: newTypeNum },
        })

        this.logger.log(`Updated show ${showId}: type_num = ${newTypeNum}`)
        return true
      }

      return false
    } catch (error) {
      this.logger.error(`Error updating single show ${showId}:`, error)
      throw error
    }
  }

  async getShowsWithoutTypeNum(): Promise<any[]> {
    return this.prisma.show.findMany({
      where: {
        type_num: null,
        detailed_url: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        detailed_url: true,
      },
    })
  }

  async getTypeStats(): Promise<any> {
    const stats = await this.prisma.show.groupBy({
      by: ['type_num'],
      _count: {
        id: true,
      },
    })

    return stats.map((stat) => ({
      type_num: stat.type_num || 'null',
      count: stat._count.id,
    }))
  }

  private extractTypeFromUrl(url: string): string | null {
    if (!url) return null

    try {
      const match = url.match(/\/creations\/([^\/]+)\//)

      if (!match) return null

      const type = match[1].toLowerCase()

      switch (type) {
        case 'performance':
          return '9'
        case 'concert':
          return '4'
        default:
          return null
      }
    } catch (error) {
      this.logger.error(`Error extracting type from URL ${url}:`, error)
      return null
    }
  }
}
