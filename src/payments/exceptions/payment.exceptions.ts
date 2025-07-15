export class PaymentNotFoundException extends Error {
  constructor(paymentId: string) {
    super(`Payment with id ${paymentId} not found`)
    this.name = 'PaymentNotFoundException'
  }
}

export class PaymentCreationException extends Error {
  constructor(message: string) {
    super(`Failed to create payment: ${message}`)
    this.name = 'PaymentCreationException'
  }
}

export class PaymentCaptureException extends Error {
  constructor(paymentId: string, message: string) {
    super(`Failed to capture payment ${paymentId}: ${message}`)
    this.name = 'PaymentCaptureException'
  }
}

export class PaymentCancellationException extends Error {
  constructor(paymentId: string, message: string) {
    super(`Failed to cancel payment ${paymentId}: ${message}`)
    this.name = 'PaymentCancellationException'
  }
}

export class YookassaApiException extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(`YooKassa API error: ${message}`)
    this.name = 'YookassaApiException'
  }
}
