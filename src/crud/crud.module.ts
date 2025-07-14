import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { EventModule } from './event/event.module'

@Module({
  imports: [PrismaModule, EventModule],
})
export class CrudModule {}
