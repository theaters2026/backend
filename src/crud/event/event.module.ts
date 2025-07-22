import { Module } from '@nestjs/common'
import { DataSyncController, EventController, ShowController } from './controllers'
import {
  DataProcessorService,
  DataSyncService,
  EventQueryService,
  EventService,
  ExternalApiService,
  ShowService,
} from './services'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  controllers: [EventController, ShowController, DataSyncController],
  providers: [
    EventService,
    DataSyncService,
    ShowService,
    EventQueryService,
    ExternalApiService,
    DataProcessorService,
    PrismaService,
  ],
})
export class EventModule {}
