import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { PaymentAmount, PaymentResponse } from '../interfaces'
import { CreatePaymentDto } from '../dto'
import {
  PaymentCancellationException,
  PaymentCaptureException,
  PaymentCreationException,
  PaymentNotFoundException,
  YookassaApiException,
} from '../exceptions'

@Injectable()
export class YookassaService {
  private readonly logger = new Logger(YookassaService.name)
  private readonly httpClient: AxiosInstance
  private readonly shopId: string
  private readonly secretKey: string

  constructor(private readonly configService: ConfigService) {
    this.shopId = this.configService.get<string>('SHOP_ID') || ''
    this.secretKey = this.configService.get<string>('PAYMENTS_SECRET_KEY') || ''

    if (!this.shopId) {
      throw new Error('SHOP_ID environment variable is required')
    }

    if (!this.secretKey) {
      throw new Error('PAYMENTS_SECRET_KEY environment variable is required')
    }

    this.httpClient = axios.create({
      baseURL: this.configService.get<string>('YOOKASSA_API_URL', 'https://api.yookassa.ru/v3'),
      auth: {
        username: this.shopId,
        password: this.secretKey,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
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

      if (error.response?.status === 400) {
        throw new PaymentCreationException(
          error.response?.data?.description || 'Invalid payment data',
        )
      }

      if (error.response?.status === 401) {
        throw new YookassaApiException('Authentication failed', 401)
      }

      throw new PaymentCreationException(error.message)
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

      if (error.response?.status === 404) {
        throw new PaymentNotFoundException(paymentId)
      }

      if (error.response?.status === 401) {
        throw new YookassaApiException('Authentication failed', 401)
      }

      throw new YookassaApiException(error.message, error.response?.status)
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

      if (error.response?.status === 404) {
        throw new PaymentNotFoundException(paymentId)
      }

      if (error.response?.status === 400) {
        throw new PaymentCaptureException(
          paymentId,
          error.response?.data?.description || 'Invalid capture request',
        )
      }

      throw new PaymentCaptureException(paymentId, error.message)
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

      if (error.response?.status === 404) {
        throw new PaymentNotFoundException(paymentId)
      }

      if (error.response?.status === 400) {
        throw new PaymentCancellationException(
          paymentId,
          error.response?.data?.description || 'Invalid cancellation request',
        )
      }

      throw new PaymentCancellationException(paymentId, error.message)
    }
  }
}
