import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { YookassaService } from '../services/yookassa.service'
import { PaymentsService } from '../services/payments.service'
import { CreatePaymentDto } from '../dto/create-payment.dto'
import { CapturePaymentDto } from '../dto/capture-payment.dto'
import { GetPaymentDto } from '../dto/get-payment.dto'
import { WebhookDto } from '../dto/webhook.dto'
import { ApiResponse as IApiResponse } from '../interfaces/payment.interfaces'
import { Public } from 'src/common/decorators'

@ApiTags('payments')
@Controller('payments')
export class YookassaController {
  private readonly logger = new Logger(YookassaController.name)

  constructor(
    private readonly yookassaService: YookassaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Public()
  @Post('create')
  @ApiOperation({ summary: 'Create a new payment in YooKassa' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiBody({ type: CreatePaymentDto })
  @UsePipes(new ZodValidationPipe(CreatePaymentDto.schema))
  async createPayment(@Body() dto: CreatePaymentDto): Promise<IApiResponse> {
    try {
      this.logger.log('Creating new payment')

      const payment = await this.yookassaService.createPayment(dto)
      await this.paymentsService.savePayment(payment)

      return {
        success: true,
        data: payment,
      }
    } catch (error) {
      this.logger.error('Error creating payment:', error.message)
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get payment information' })
  @ApiParam({ name: 'id', description: 'Payment ID', type: String })
  @ApiResponse({ status: 200, description: 'Payment information retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPayment(@Param() params: GetPaymentDto): Promise<IApiResponse> {
    try {
      this.logger.log(`Getting payment: ${params.id}`)

      const payment = await this.yookassaService.getPayment(params.id)

      return {
        success: true,
        data: payment,
      }
    } catch (error) {
      this.logger.error('Error getting payment:', error.message)
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      )
    }
  }

  @Post(':id/capture')
  @ApiOperation({ summary: 'Capture payment' })
  @ApiParam({ name: 'id', description: 'Payment ID', type: String })
  @ApiBody({ type: CapturePaymentDto, required: false })
  @ApiResponse({ status: 200, description: 'Payment captured successfully' })
  @ApiResponse({ status: 400, description: 'Payment capture error' })
  @UsePipes(new ZodValidationPipe(CapturePaymentDto.schema))
  async capturePayment(
    @Param() params: GetPaymentDto,
    @Body() dto?: CapturePaymentDto,
  ): Promise<IApiResponse> {
    try {
      this.logger.log(`Capturing payment: ${params.id}`)

      const payment = await this.yookassaService.capturePayment(params.id, dto?.amount)
      await this.paymentsService.updatePaymentStatus(params.id, 'succeeded')

      return {
        success: true,
        data: payment,
      }
    } catch (error) {
      this.logger.error('Error capturing payment:', error.message)
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel payment' })
  @ApiParam({ name: 'id', description: 'Payment ID', type: String })
  @ApiResponse({ status: 200, description: 'Payment cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Payment cancellation error' })
  async cancelPayment(@Param() params: GetPaymentDto): Promise<IApiResponse> {
    try {
      this.logger.log(`Cancelling payment: ${params.id}`)

      const payment = await this.yookassaService.cancelPayment(params.id)
      await this.paymentsService.updatePaymentStatus(params.id, 'cancelled')

      return {
        success: true,
        data: payment,
      }
    } catch (error) {
      this.logger.error('Error cancelling payment:', error.message)
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle webhook notifications from YooKassa' })
  @ApiBody({ type: WebhookDto })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid signature' })
  @UsePipes(new ZodValidationPipe(WebhookDto.schema))
  async handleWebhook(
    @Body() dto: WebhookDto,
    @Headers('x-yookassa-signature') signature: string,
  ): Promise<IApiResponse> {
    try {
      this.logger.log(`Received webhook: ${dto.event}`)

      const isValid = this.yookassaService.validateWebhook(dto, signature)

      if (!isValid) {
        throw new HttpException(
          {
            success: false,
            error: 'Invalid signature',
          },
          HttpStatus.BAD_REQUEST,
        )
      }

      switch (dto.event) {
        case 'payment.succeeded':
          await this.paymentsService.updatePaymentStatus(dto.object.id, 'succeeded')
          break
        case 'payment.canceled':
          await this.paymentsService.updatePaymentStatus(dto.object.id, 'cancelled')
          break
        default:
          this.logger.warn(`Unknown webhook event: ${dto.event}`)
      }

      return { success: true }
    } catch (error) {
      this.logger.error('Error handling webhook:', error.message)

      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
