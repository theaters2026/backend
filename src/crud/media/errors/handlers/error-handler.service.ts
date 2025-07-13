import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { UploadErrorBase } from '../base/upload-error.base'

@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name)

  handleError(error: unknown, operation: string): never {
    this.logger.error(`❌ Error in ${operation}:`, error)

    if (error instanceof UploadErrorBase) {
      this.logStructuredError(error, operation)
      this.throwHttpException(error)
    }

    if (error instanceof Error) {
      this.logger.error(`Unexpected error in ${operation}: ${error.message}`, error.stack)
      throw new InternalServerErrorException(`Error in ${operation}: ${error.message}`)
    }

    this.logger.error(`Unknown error in ${operation}:`, error)
    throw new InternalServerErrorException(`Unknown error in ${operation}`)
  }

  private logStructuredError(error: UploadErrorBase, operation: string): void {
    this.logger.error(`[${error.code}] ${operation}: ${error.message}`, {
      code: error.code,
      operation,
      context: error.context,
      stack: error.stack,
    })
  }

  private throwHttpException(error: UploadErrorBase): never {
    if (error.statusCode >= 400 && error.statusCode < 500) {
      throw new BadRequestException({
        message: error.message,
        code: error.code,
        context: error.context,
      })
    }

    throw new InternalServerErrorException({
      message: error.message,
      code: error.code,
      context: error.context,
    })
  }
}
