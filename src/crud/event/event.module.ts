import { Module } from '@nestjs/common'
import { EventController } from './controllers/event.controller'
import { EventService } from './services/event.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService],
})
export class EventModule {}
