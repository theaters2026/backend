import { Module } from '@nestjs/common'
import { CrudModule } from './crud/crud.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { PaymentsModule } from './payments/payments.module'
import { ParserModule } from './parser/parser.module'

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
    AuthModule,
    PaymentsModule,
    ParserModule,
  ],
})
export class AppModule {}
