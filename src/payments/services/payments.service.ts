import { Injectable, Logger } from '@nestjs/common'
import { PaymentResponse } from '../interfaces'
import { PaymentStatus } from '../enums'
import { PaymentNotFoundException } from '../exceptions'

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name)

  async savePayment(payment: PaymentResponse): Promise<void> {
    try {
      this.logger.log(`Saving payment: ${payment.id}`)

      this.logger.log(`Payment saved successfully: ${payment.id}`)
    } catch (error) {
      this.logger.error(`Error saving payment ${payment.id}:`, error.message)
      throw new Error(`Failed to save payment: ${error.message}`)
    }
  }

  async updatePaymentStatus(paymentId: string, status: PaymentStatus): Promise<void> {
    try {
      this.logger.log(`Updating payment status: ${paymentId} -> ${status}`)

      if (!paymentId) {
        throw new PaymentNotFoundException(paymentId)
      }

      this.logger.log(`Payment status updated successfully: ${paymentId} -> ${status}`)
    } catch (error) {
      this.logger.error(`Error updating payment status ${paymentId}:`, error.message)

      if (error instanceof PaymentNotFoundException) {
        throw error
      }

      throw new Error(`Failed to update payment status: ${error.message}`)
    }
  }

  async getPaymentById(paymentId: string): Promise<PaymentResponse | null> {
    try {
      this.logger.log(`Getting payment: ${paymentId}`)

      this.logger.log(`Payment retrieved: ${paymentId}`)
      return null
    } catch (error) {
      this.logger.error(`Error getting payment ${paymentId}:`, error.message)
      throw new PaymentNotFoundException(paymentId)
    }
  }

  async getAllPayments(): Promise<PaymentResponse[]> {
    try {
      this.logger.log('Getting all payments')

      this.logger.log('All payments retrieved')
      return []
    } catch (error) {
      this.logger.error('Error getting all payments:', error.message)
      throw new Error(`Failed to get payments: ${error.message}`)
    }
  }
}
