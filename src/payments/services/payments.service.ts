import { Injectable, Logger } from '@nestjs/common'
import { PaymentResponse, PaymentStatus } from '../interfaces/payment.interfaces'

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name)

  async savePayment(payment: PaymentResponse): Promise<void> {
    try {
      this.logger.log(`Saving payment: ${payment.id}`)
    } catch (error) {
      this.logger.error('Error saving payment:', error.message)
      throw error
    }
  }

  async updatePaymentStatus(paymentId: string, status: PaymentStatus): Promise<void> {
    try {
      this.logger.log(`Updating payment status: ${paymentId} -> ${status}`)
    } catch (error) {
      this.logger.error('Error updating payment status:', error.message)
      throw error
    }
  }

  async getPaymentById(paymentId: string): Promise<PaymentResponse | null> {
    try {
      this.logger.log(`Getting payment: ${paymentId}`)
      return null
    } catch (error) {
      this.logger.error('Error getting payment:', error.message)
      throw error
    }
  }

  async getAllPayments(): Promise<PaymentResponse[]> {
    try {
      this.logger.log('Getting all payments')
      return []
    } catch (error) {
      this.logger.error('Error getting all payments:', error.message)
      throw error
    }
  }
}
