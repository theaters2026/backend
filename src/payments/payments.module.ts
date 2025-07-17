import { Module } from '@nestjs/common'
import { YookassaController } from './controllers/yookasa.controller'
import { YookassaService } from './services/yookassa.service'
import { PaymentsService } from './services/payments.service'
import { WebhookService } from './services/webhook.service'

@Module({
  controllers: [YookassaController],
  providers: [YookassaService, PaymentsService, WebhookService],
  exports: [YookassaService, PaymentsService],
})
export class PaymentsModule {}
