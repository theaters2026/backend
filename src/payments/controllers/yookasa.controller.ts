import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PaymentsService, WebhookService, YookassaService } from '../services'
import { CapturePaymentDto, CreatePaymentDto, GetPaymentDto, WebhookDto } from '../dto'
import { ApiResponse as IApiResponse } from '../interfaces'
import { PaymentStatus } from '../enums'
import { Public } from 'src/common/decorators'
import { PaymentExceptionFilter } from '../filters'

@ApiTags('Payments')
@Controller('payments')
@UseFilters(PaymentExceptionFilter)
export class YookassaController {
  private readonly logger = new Logger(YookassaController.name)

  constructor(
    private readonly yookassaService: YookassaService,
    private readonly paymentsService: PaymentsService,
    private readonly webhookService: WebhookService,
  ) {}

  @Public()
  @Post('create')
  @ApiOperation({ summary: 'Create a new payment in YooKassa' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  @ApiBody({ type: CreatePaymentDto })
  async createPayment(@Body() dto: CreatePaymentDto): Promise<IApiResponse> {
    this.logger.log('Creating new payment')

    const payment = await this.yookassaService.createPayment(dto)
    await this.paymentsService.savePayment(payment)

    return {
      success: true,
      data: payment,
    }
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get payment information' })
  @ApiParam({ name: 'id', description: 'Payment ID', type: String })
  @ApiResponse({ status: 200, description: 'Payment information retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPayment(@Param() params: GetPaymentDto): Promise<IApiResponse> {
    this.logger.log(`Getting payment: ${params.id}`)

    const payment = await this.yookassaService.getPayment(params.id)

    return {
      success: true,
      data: payment,
    }
  }

  @Post(':id/capture')
  @ApiOperation({ summary: 'Capture payment' })
  @ApiParam({ name: 'id', description: 'Payment ID', type: String })
  @ApiBody({ type: CapturePaymentDto, required: false })
  @ApiResponse({ status: 200, description: 'Payment captured successfully' })
  @ApiResponse({ status: 400, description: 'Payment capture error' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async capturePayment(
    @Param() params: GetPaymentDto,
    @Body() dto?: CapturePaymentDto,
  ): Promise<IApiResponse> {
    this.logger.log(`Capturing payment: ${params.id}`)

    const payment = await this.yookassaService.capturePayment(params.id, dto?.amount)
    await this.paymentsService.updatePaymentStatus(params.id, PaymentStatus.SUCCEEDED)

    return {
      success: true,
      data: payment,
    }
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel payment' })
  @ApiParam({ name: 'id', description: 'Payment ID', type: String })
  @ApiResponse({ status: 200, description: 'Payment cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Payment cancellation error' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async cancelPayment(@Param() params: GetPaymentDto): Promise<IApiResponse> {
    this.logger.log(`Cancelling payment: ${params.id}`)

    const payment = await this.yookassaService.cancelPayment(params.id)
    await this.paymentsService.updatePaymentStatus(params.id, PaymentStatus.CANCELLED)

    return {
      success: true,
      data: payment,
    }
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Handle webhook notifications from YooKassa' })
  @ApiBody({ type: WebhookDto })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid signature or webhook data' })
  async handleWebhook(
    @Body() dto: WebhookDto,
    @Headers('x-yookassa-signature') signature: string,
  ): Promise<IApiResponse> {
    this.logger.log(`Received webhook: ${dto.event}`)

    await this.webhookService.processWebhook(dto, signature)

    return { success: true }
  }
}
