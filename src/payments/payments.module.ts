import { Module } from '@nestjs/common'
import { YookassaController } from './controllers'
import { PaymentsService, WebhookService, YookassaService } from './services'

@Module({
  controllers: [YookassaController],
  providers: [YookassaService, PaymentsService, WebhookService],
  exports: [YookassaService, PaymentsService],
})
export class PaymentsModule {}
