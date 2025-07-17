import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { CityUpdaterService } from './services/city-updater.service'
import { CityUpdaterController } from './controllers/city-updater.controller'
import { CityListLoaderService, TranslationService } from './services'

@Module({
  imports: [PrismaModule],
  providers: [CityUpdaterService, TranslationService, CityListLoaderService],
  controllers: [CityUpdaterController],
  exports: [CityUpdaterService],
})
export class DataUpdaterModule {}
