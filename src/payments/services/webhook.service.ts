import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WebhookDto } from '../dto/webhook.dto'
import { PaymentsService } from './payments.service'
import { PaymentStatus, WebhookEvent } from '../enums'
import {
  UnknownWebhookEventException,
  WebhookProcessingException,
  WebhookValidationException,
} from '../exceptions/webhook.exceptions'
import * as crypto from 'crypto'

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name)
  private readonly webhookSecret: string

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {
    this.webhookSecret = this.configService.get<string>('WEBHOOK_SECRET') || ''
  }

  async processWebhook(dto: WebhookDto, signature: string): Promise<void> {
    try {
      this.logger.log(`Processing webhook event: ${dto.event} for payment: ${dto.object.id}`)

      const isValidSignature = await this.validateWebhookSignature(dto, signature)
      if (!isValidSignature) {
        throw new WebhookValidationException('Invalid webhook signature')
      }

      await this.handleWebhookEvent(dto)

      this.logger.log(`Webhook processed successfully: ${dto.event}`)
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`, error.stack)

      if (
        error instanceof WebhookValidationException ||
        error instanceof UnknownWebhookEventException
      ) {
        throw error
      }

      throw new WebhookProcessingException(`Failed to process webhook: ${error.message}`)
    }
  }

  private async handleWebhookEvent(dto: WebhookDto): Promise<void> {
    const { event, object } = dto

    switch (event) {
      case WebhookEvent.PAYMENT_SUCCEEDED:
        await this.paymentsService.updatePaymentStatus(object.id, PaymentStatus.SUCCEEDED)
        this.logger.log(`Payment succeeded: ${object.id}`)
        break

      case WebhookEvent.PAYMENT_CANCELED:
        await this.paymentsService.updatePaymentStatus(object.id, PaymentStatus.CANCELLED)
        this.logger.log(`Payment cancelled: ${object.id}`)
        break

      case WebhookEvent.PAYMENT_WAITING_FOR_CAPTURE:
        await this.paymentsService.updatePaymentStatus(object.id, PaymentStatus.WAITING_FOR_CAPTURE)
        this.logger.log(`Payment waiting for capture: ${object.id}`)
        break

      case WebhookEvent.PAYMENT_PENDING:
        await this.paymentsService.updatePaymentStatus(object.id, PaymentStatus.PENDING)
        this.logger.log(`Payment pending: ${object.id}`)
        break

      default:
        this.logger.warn(`Unknown webhook event: ${event}`)
        throw new UnknownWebhookEventException(`Unknown webhook event: ${event}`)
    }
  }

  async validateWebhookSignature(dto: WebhookDto, signature: string): Promise<boolean> {
    if (!signature) {
      this.logger.warn('No signature provided for webhook validation')
      return false
    }

    try {
      if (!this.webhookSecret) {
        this.logger.warn('Webhook secret not configured, skipping signature validation')
        return true
      }

      const payload = JSON.stringify(dto)
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex')

      const isValid = signature === expectedSignature

      if (!isValid) {
        this.logger.warn('Invalid webhook signature')
      }

      return isValid
    } catch (error) {
      this.logger.error('Error validating webhook signature:', error.message)
      return false
    }
  }
}
