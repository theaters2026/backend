import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ExternalApiService } from './external-api.service'
import { DataProcessorService } from './data-processor.service'

@Injectable()
export class DataSyncService {
  private readonly logger = new Logger(DataSyncService.name)

  constructor(
    private externalApiService: ExternalApiService,
    private dataProcessorService: DataProcessorService,
  ) {}

  async syncData(shopId: string): Promise<{ message: string; stats: any }> {
    this.logger.log(`Starting data sync for shop_id: ${shopId}`)

    try {
      // Получаем данные из внешнего API
      const apiData = await this.externalApiService.fetchShowsFromApi(shopId)

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

      for (const apiShow of apiData.shows) {
        await this.dataProcessorService.processShow(apiShow, shopId, stats)
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
}
