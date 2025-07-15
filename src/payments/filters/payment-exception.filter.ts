import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { Response } from 'express'
import {
  PaymentCancellationException,
  PaymentCaptureException,
  PaymentCreationException,
  PaymentNotFoundException,
  YookassaApiException,
} from '../exceptions/payment.exceptions'
import {
  UnknownWebhookEventException,
  WebhookProcessingException,
  WebhookValidationException,
} from '../exceptions/webhook.exceptions'

@Catch(
  PaymentNotFoundException,
  PaymentCreationException,
  PaymentCaptureException,
  PaymentCancellationException,
  YookassaApiException,
  WebhookValidationException,
  WebhookProcessingException,
  UnknownWebhookEventException,
)
export class PaymentExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PaymentExceptionFilter.name)

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()

    let status: HttpStatus
    let message: string

    this.logger.error(`Exception caught: ${exception.name} - ${exception.message}`)

    switch (exception.constructor) {
      case PaymentNotFoundException:
        status = HttpStatus.NOT_FOUND
        message = exception.message
        break

      case PaymentCreationException:
      case PaymentCaptureException:
      case PaymentCancellationException:
        status = HttpStatus.BAD_REQUEST
        message = exception.message
        break

      case YookassaApiException:
        const yookassaError = exception as YookassaApiException
        status = yookassaError.statusCode || HttpStatus.BAD_REQUEST
        message = exception.message
        break

      case WebhookValidationException:
      case UnknownWebhookEventException:
        status = HttpStatus.BAD_REQUEST
        message = exception.message
        break

      case WebhookProcessingException:
        status = HttpStatus.INTERNAL_SERVER_ERROR
        message = exception.message
        break

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR
        message = 'Internal server error'
    }

    const errorResponse = {
      success: false,
      error: message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    response.status(status).json(errorResponse)
  }
}
