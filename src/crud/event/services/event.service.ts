import { Injectable } from '@nestjs/common'
import { DataSyncService } from './data-sync.service'
import { ShowService } from './show.service'
import { EventQueryService } from './event-query.service'

@Injectable()
export class EventService {
  constructor(
    private dataSyncService: DataSyncService,
    private showService: ShowService,
    private eventQueryService: EventQueryService,
  ) {}

  async syncData(shopId: string): Promise<{ message: string; stats: any }> {
    return this.dataSyncService.syncData(shopId)
  }

  async getAllShows(): Promise<any[]> {
    return this.showService.getAllShows()
  }

  async getShowById(id: string): Promise<any> {
    return this.showService.getShowById(id)
  }

  async getShowsByShopId(shopId: string): Promise<any[]> {
    return this.showService.getShowsByShopId(shopId)
  }

  async getAllEvents(): Promise<any[]> {
    return this.eventQueryService.getAllEvents()
  }

  async getEventById(id: string): Promise<any> {
    return this.eventQueryService.getEventById(id)
  }

  async getEventsByShopId(shopId: string): Promise<any[]> {
    return this.eventQueryService.getEventsByShopId(shopId)
  }
}
