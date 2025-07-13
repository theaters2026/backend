import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { MediaModule } from './media/media.module'
import { EventModule } from './event/event.module'

@Module({
  imports: [PrismaModule, MediaModule, EventModule],
})
export class CrudModule {}
