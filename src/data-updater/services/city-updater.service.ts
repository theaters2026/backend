import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { capitalizeFirstLetter, extractCityFromAddress } from '../utils'
import { CityUpdateStats, GeocodingResult } from '../interfaces'
import { TranslationService } from './translate.service'
import { CityListLoaderService } from './city-loader.service'

@Injectable()
export class CityUpdaterService {
  private readonly logger = new Logger(CityUpdaterService.name)
  private readonly geocodingCache = new Map<string, GeocodingResult>()

  constructor(
    private readonly prisma: PrismaService,
    private readonly cityListLoader: CityListLoaderService,
    private readonly translationService: TranslationService,
  ) {}

  async updateCityIdForEvents(): Promise<void> {
    try {
      this.logger.log('Starting city_id update for events...')

      const eventsWithAddress = await this.prisma.event.findMany({
        where: {
          address: {
            not: null,
          },
        },
        select: {
          id: true,
          address: true,
          locationName: true,
          cityId: true,
        },
      })

      this.logger.log(`Found ${eventsWithAddress.length} events with address`)

      let updatedCount = 0
      let skippedCount = 0

      for (const event of eventsWithAddress) {
        try {
          const cityId = await this.getCityIdByAddress(event.address!, event.id)
          if (cityId) {
            updatedCount++
          } else {
            skippedCount++
          }
        } catch (error) {
          this.logger.error(`Error processing event ${event.id}: ${error.message}`)
          skippedCount++
        }
      }

      this.logger.log(
        `City processing completed. Updated: ${updatedCount}, Skipped: ${skippedCount}`,
      )
    } catch (error) {
      this.logger.error(`Error in updateCityIdForEvents: ${error.message}`)
      throw error
    }
  }

  async updateCityIdForEvent(eventId: string): Promise<void> {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        select: { address: true, cityId: true },
      })

      if (!event) {
        throw new Error(`Event with id ${eventId} not found`)
      }

      if (!event.address) {
        throw new Error(`Event ${eventId} has no address`)
      }

      await this.getCityIdByAddress(event.address, eventId)
    } catch (error) {
      this.logger.error(`Error processing event ${eventId}: ${error.message}`)
      throw error
    }
  }

  private async getCityIdByAddress(address: string, eventId?: string): Promise<number | null> {
    try {
      if (this.geocodingCache.has(address)) {
        const cached = this.geocodingCache.get(address)
        if (cached?.cityId && eventId) {
          await this.updateEventCityId(eventId, cached.cityId)
        }
        return cached?.cityId || null
      }

      const cityName = extractCityFromAddress(address)

      if (cityName) {
        const translatedCity = await this.translationService.translateToEnglish(cityName)
        const capitalizedCity = capitalizeFirstLetter(translatedCity)
        const cityFromList = this.cityListLoader.findCityInList(capitalizedCity)

        if (cityFromList) {
          const result: GeocodingResult = {
            lat: cityFromList.coord.lat,
            lon: cityFromList.coord.lon,
            city: cityFromList.name,
            cityId: cityFromList.id,
          }
          this.geocodingCache.set(address, result)

          if (eventId) {
            await this.updateEventCityId(eventId, cityFromList.id)
          }

          return cityFromList.id
        } else {
          const result: GeocodingResult = {
            lat: 0,
            lon: 0,
            city: capitalizedCity,
            cityId: null,
          }
          this.geocodingCache.set(address, result)
        }
      }

      return null
    } catch (error) {
      this.logger.error(`Error getting city_id for address ${address}: ${error.message}`)
      return null
    }
  }

  private async updateEventCityId(eventId: string, cityId: number): Promise<void> {
    try {
      await this.prisma.event.update({
        where: { id: eventId },
        data: { cityId: cityId },
      })

      this.logger.log(`Updated event ${eventId} with city_id: ${cityId}`)
    } catch (error) {
      this.logger.error(`Error updating event ${eventId} with city_id ${cityId}: ${error.message}`)
      throw error
    }
  }

  async getCityUpdateStats(): Promise<CityUpdateStats> {
    const [eventsWithAddress, eventsWithCityId] = await Promise.all([
      this.prisma.event.count({
        where: {
          address: {
            not: null,
          },
        },
      }),
      this.prisma.event.count({
        where: {
          cityId: {
            not: null,
          },
        },
      }),
    ])

    return {
      eventsWithAddress,
      eventsWithCityId,
      eventsWithoutCityId: eventsWithAddress - eventsWithCityId,
    }
  }
}
