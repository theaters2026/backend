import { Module } from '@nestjs/common'
import { EventController } from './controllers/event.controller'
import { ShowController } from './controllers/show.controller'
import { DataSyncController } from './controllers/data-sync.controller'
import { EventService } from './services/event.service'
import { DataSyncService } from './services/data-sync.service'
import { ShowService } from './services/show.service'
import { EventQueryService } from './services/event-query.service'
import { ExternalApiService } from './services/external-api.service'
import { DataProcessorService } from './services/data-processor.service'
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
