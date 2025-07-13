import { Module } from '@nestjs/common'
import { CrudModule } from './crud/crud.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: '.env',
    }),
    CrudModule,
  ],
})
export class AppModule {}
