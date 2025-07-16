import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ApiBuilding, ApiEvent, ApiShow, ApiShowsResponse } from '../types/api-types'
import axios, { AxiosResponse } from 'axios'

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name)
  private readonly API_BASE_URL = 'https://tickets.afisha.ru/wl'

  constructor(private prisma: PrismaService) {}

  async syncData(shopId: string): Promise<{ message: string; stats: any }> {
    this.logger.log(`Starting data sync for shop_id: ${shopId}`)

    try {
      // Получаем данные из внешнего API
      const apiData = await this.fetchShowsFromApi(shopId)

      if (!apiData.shows || apiData.shows.length === 0) {
        this.logger.warn(`No shows found for shop_id: ${shopId}`)
        return { message: 'No shows found', stats: { shows: 0, events: 0, buildings: 0 } }
      }

      const stats = {
        shows: 0,
        events: 0,
        buildings: 0,
        categories: 0,
      }

      // Обрабатываем каждое шоу
      for (const apiShow of apiData.shows) {
        await this.processShow(apiShow, shopId, stats)
      }

      this.logger.log(`Data sync completed for shop_id: ${shopId}`, stats)
      return {
        message: 'Data synchronized successfully',
        stats,
      }
    } catch (error) {
      this.logger.error(`Error during data sync for shop_id: ${shopId}`, error.stack)
      throw new InternalServerErrorException('Failed to sync data')
    }
  }

  private async fetchShowsFromApi(shopId: string): Promise<ApiShowsResponse> {
    try {
      const response: AxiosResponse<ApiShowsResponse> = await axios.post(
        `${this.API_BASE_URL}/${shopId}/api/shows`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        },
      )

      return response.data
    } catch (error) {
      this.logger.error(`Failed to fetch data from API for shop_id: ${shopId}`, error.stack)
      throw new InternalServerErrorException('Failed to fetch data from external API')
    }
  }

  private async processShow(apiShow: ApiShow, shopId: string, stats: any): Promise<void> {
    try {
      const show = await this.prisma.show.upsert({
        where: { externalId: apiShow.id },
        update: {
          name: apiShow.name,
          image: apiShow.image || null,
          desc: apiShow.desc || null,
          partnerId: apiShow.partner_id,
          ageLimit: apiShow.age_limit,
          shortInfo: apiShow.short_info || null,
          fullInfo: apiShow.full_info || null,
          publDate: apiShow.publ_date || null,
          premiereDate: apiShow.premiere_date || null,
          duration: apiShow.duration || null,
          minPrice: apiShow.min_price ? parseFloat(apiShow.min_price) : null,
          maxPrice: apiShow.max_price ? parseFloat(apiShow.max_price) : null,
          isPushkin: apiShow.is_pushkin,
          shopId: shopId,
          updatedAt: new Date(),
        },
        create: {
          externalId: apiShow.id,
          name: apiShow.name,
          image: apiShow.image || null,
          desc: apiShow.desc || null,
          partnerId: apiShow.partner_id,
          ageLimit: apiShow.age_limit,
          shortInfo: apiShow.short_info || null,
          fullInfo: apiShow.full_info || null,
          publDate: apiShow.publ_date || null,
          premiereDate: apiShow.premiere_date || null,
          duration: apiShow.duration || null,
          minPrice: apiShow.min_price ? parseFloat(apiShow.min_price) : null,
          maxPrice: apiShow.max_price ? parseFloat(apiShow.max_price) : null,
          isPushkin: apiShow.is_pushkin,
          shopId: shopId,
        },
      })

      stats.shows++

      // Обрабатываем категории показа
      if (apiShow.show_categories && apiShow.show_categories.length > 0) {
        // Удаляем старые категории
        await this.prisma.showCategory.deleteMany({
          where: { showId: show.id },
        })

        // Создаем новые категории
        for (const category of apiShow.show_categories) {
          await this.prisma.showCategory.create({
            data: {
              name: category.name,
              showId: show.id,
            },
          })
          stats.categories++
        }
      }

      // Обрабатываем события
      if (apiShow.events && apiShow.events.length > 0) {
        for (const apiEvent of apiShow.events) {
          await this.processEvent(apiEvent, show.id, stats)
        }
      }
    } catch (error) {
      this.logger.error(`Error processing show ${apiShow.id}`, error.stack)
      throw error
    }
  }

  private async processEvent(apiEvent: ApiEvent, showUuid: string, stats: any): Promise<void> {
    try {
      let building = null
      if (apiEvent.building) {
        building = await this.processBuilding(apiEvent.building, stats)
      }

      await this.prisma.event.upsert({
        where: { externalId: apiEvent.id },
        update: {
          name: apiEvent.name,
          showId: apiEvent.show_id,
          timeType: apiEvent.time_type,
          date: apiEvent.date ? new Date(apiEvent.date) : null,
          fixDate: apiEvent.fix_date ? new Date(apiEvent.fix_date) : null,
          endDate: apiEvent.end_date ? new Date(apiEvent.end_date) : null,
          timestamp: BigInt(apiEvent.timestamp),
          locationId: apiEvent.location_id,
          locationName: apiEvent.location_name || null,
          serviceName: apiEvent.service_name || null,
          count: apiEvent.count,
          minPrice: apiEvent.min_price ? parseFloat(apiEvent.min_price) : null,
          maxPrice: apiEvent.max_price ? parseFloat(apiEvent.max_price) : null,
          image: apiEvent.image || null,
          ageLimit: apiEvent.age_limit,
          desc: apiEvent.desc || null,
          isSeason: apiEvent.is_season,
          isCovidFree: apiEvent.is_covid_free,
          pipelineEventId: apiEvent.pipeline_event_id,
          isAccessOnlyLink: apiEvent.is_access_only_link,
          cityId: apiEvent.city_id,
          address: apiEvent.address || null,
          showUuid: showUuid,
          buildingId: building?.id || null,
          updatedAt: new Date(),
        },
        create: {
          externalId: apiEvent.id,
          name: apiEvent.name,
          showId: apiEvent.show_id,
          timeType: apiEvent.time_type,
          date: apiEvent.date ? new Date(apiEvent.date) : null,
          fixDate: apiEvent.fix_date ? new Date(apiEvent.fix_date) : null,
          endDate: apiEvent.end_date ? new Date(apiEvent.end_date) : null,
          timestamp: BigInt(apiEvent.timestamp),
          locationId: apiEvent.location_id,
          locationName: apiEvent.location_name || null,
          serviceName: apiEvent.service_name || null,
          count: apiEvent.count,
          minPrice: apiEvent.min_price ? parseFloat(apiEvent.min_price) : null,
          maxPrice: apiEvent.max_price ? parseFloat(apiEvent.max_price) : null,
          image: apiEvent.image || null,
          ageLimit: apiEvent.age_limit,
          desc: apiEvent.desc || null,
          isSeason: apiEvent.is_season,
          isCovidFree: apiEvent.is_covid_free,
          pipelineEventId: apiEvent.pipeline_event_id,
          isAccessOnlyLink: apiEvent.is_access_only_link,
          cityId: apiEvent.city_id,
          address: apiEvent.address || null,
          showUuid: showUuid,
          buildingId: building?.id || null,
        },
      })

      stats.events++
    } catch (error) {
      this.logger.error(`Error processing event ${apiEvent.id}`, error.stack)
      throw error
    }
  }

  private async processBuilding(apiBuilding: ApiBuilding, stats: any) {
    try {
      const building = await this.prisma.building.upsert({
        where: { externalId: apiBuilding.id },
        update: {
          name: apiBuilding.name,
          cityId: apiBuilding.city_id,
          address: apiBuilding.address,
          lat: apiBuilding.lat,
          lon: apiBuilding.lon,
          updatedAt: new Date(),
        },
        create: {
          externalId: apiBuilding.id,
          name: apiBuilding.name,
          cityId: apiBuilding.city_id,
          address: apiBuilding.address,
          lat: apiBuilding.lat,
          lon: apiBuilding.lon,
        },
      })

      if (building) {
        stats.buildings++
      }

      return building
    } catch (error) {
      this.logger.error(`Error processing building ${apiBuilding.id}`, error.stack)
      throw error
    }
  }

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
