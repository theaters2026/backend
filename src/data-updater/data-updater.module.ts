import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { CityUpdaterService } from './services/city-updater.service'
import { CityUpdaterController } from './controllers/city-updater.controller'
import { CityListLoaderService, TranslationService } from './services'
import { TypeUpdaterService } from './services/type-updater.service'
import { TypeUpdaterController } from './controllers/type-updater.controller'

@Module({
  imports: [PrismaModule],
  providers: [CityUpdaterService, TranslationService, CityListLoaderService, TypeUpdaterService],
  controllers: [CityUpdaterController, TypeUpdaterController],
  exports: [CityUpdaterService],
})
export class DataUpdaterModule {}
