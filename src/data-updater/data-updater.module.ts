import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import {
  CityListLoaderService,
  CityUpdaterService,
  TranslationService,
  TypeUpdaterService,
} from './services'
import { CityUpdaterController, TypeUpdaterController } from './controllers'

@Module({
  imports: [PrismaModule],
  providers: [CityUpdaterService, TranslationService, CityListLoaderService, TypeUpdaterService],
  controllers: [CityUpdaterController, TypeUpdaterController],
  exports: [CityUpdaterService],
})
export class DataUpdaterModule {}
