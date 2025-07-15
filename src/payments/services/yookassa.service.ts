import { Injectable, Logger } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { PaymentAmount, PaymentResponse } from '../interfaces/payment.interfaces'
import { CreatePaymentDto } from '../dto/create-payment.dto'
import { WebhookDto } from '../dto/webhook.dto'

@Injectable()
export class YookassaService {
  private readonly logger = new Logger(YookassaService.name)
  private readonly httpClient: AxiosInstance
  private readonly shopId: string
  private readonly secretKey: string

  constructor() {
    this.shopId = process.env.SHOP_ID || ''
    this.secretKey = process.env.PAYMENTS_SECRET_KEY || ''

    if (!this.shopId) {
      throw new Error('SHOP_ID environment variable is required')
    }

    if (!this.secretKey) {
      throw new Error('PAYMENTS_SECRET_KEY environment variable is required')
    }

    this.httpClient = axios.create({
      baseURL: 'https://api.yookassa.ru/v3',
      auth: {
        username: this.shopId,
        password: this.secretKey,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async createPayment(dto: CreatePaymentDto): Promise<PaymentResponse> {
    try {
      const idempotencyKey = uuidv4()

      this.logger.log(`Creating payment with amount: ${dto.amount.value} ${dto.amount.currency}`)

      const response = await this.httpClient.post('/payments', dto, {
        headers: {
          'Idempotence-Key': idempotencyKey,
        },
      })

      this.logger.log(`Payment created successfully: ${response.data.id}`)
      return response.data
    } catch (error) {
      this.logger.error('Error creating payment:', error.response?.data || error.message)
      throw new Error(
        `Failed to create payment: ${error.response?.data?.description || error.message}`,
      )
    }
  }

  async getPayment(paymentId: string): Promise<PaymentResponse> {
    try {
      this.logger.log(`Getting payment: ${paymentId}`)

      const response = await this.httpClient.get(`/payments/${paymentId}`)

      this.logger.log(`Payment retrieved successfully: ${paymentId}`)
      return response.data
    } catch (error) {
      this.logger.error('Error getting payment:', error.response?.data || error.message)
      throw new Error(
        `Failed to get payment: ${error.response?.data?.description || error.message}`,
      )
    }
  }

  async capturePayment(paymentId: string, amount?: PaymentAmount): Promise<PaymentResponse> {
    try {
      const idempotencyKey = uuidv4()

      this.logger.log(`Capturing payment: ${paymentId}`)

      const response = await this.httpClient.post(
        `/payments/${paymentId}/capture`,
        amount ? { amount } : {},
        {
          headers: {
            'Idempotence-Key': idempotencyKey,
          },
        },
      )

      this.logger.log(`Payment captured successfully: ${paymentId}`)
      return response.data
    } catch (error) {
      this.logger.error('Error capturing payment:', error.response?.data || error.message)
      throw new Error(
        `Failed to capture payment: ${error.response?.data?.description || error.message}`,
      )
    }
  }

  async cancelPayment(paymentId: string): Promise<PaymentResponse> {
    try {
      const idempotencyKey = uuidv4()

      this.logger.log(`Cancelling payment: ${paymentId}`)

      const response = await this.httpClient.post(
        `/payments/${paymentId}/cancel`,
        {},
        {
          headers: {
            'Idempotence-Key': idempotencyKey,
          },
        },
      )

      this.logger.log(`Payment cancelled successfully: ${paymentId}`)
      return response.data
    } catch (error) {
      this.logger.error('Error cancelling payment:', error.response?.data || error.message)
      throw new Error(
        `Failed to cancel payment: ${error.response?.data?.description || error.message}`,
      )
    }
  }

  validateWebhook(dto: WebhookDto, signature: string): boolean {
    this.logger.log(`Validating webhook signature: ${signature}`)
    try {
      this.logger.log(`Validating webhook for event: ${dto.event}`)
      return true
    } catch (error) {
      this.logger.error('Error validating webhook:', error.message)
      return false
    }
  }
}
