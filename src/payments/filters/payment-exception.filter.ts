import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  PaymentCancellationException,
  PaymentCaptureException,
  PaymentCreationException,
  PaymentNotFoundException,
  UnknownWebhookEventException,
  WebhookProcessingException,
  WebhookValidationException,
  YookassaApiException,
} from '../exceptions'

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
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

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

    response.status(status).send(errorResponse)
  }
}
