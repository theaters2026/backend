import { Module } from '@nestjs/common'
import { YookassaController } from './controllers/yookasa.controller'
import { YookassaService } from './services/yookassa.service'
import { PaymentsService } from './services/payments.service'

@Module({
  controllers: [YookassaController],
  providers: [YookassaService, PaymentsService],
  exports: [YookassaService, PaymentsService],
})
export class PaymentsModule {}
