export class WebhookValidationException extends Error {
  constructor(message: string) {
    super(`Webhook validation failed: ${message}`)
    this.name = 'WebhookValidationException'
  }
}

export class WebhookProcessingException extends Error {
  constructor(message: string) {
    super(`Webhook processing failed: ${message}`)
    this.name = 'WebhookProcessingException'
  }
}

export class UnknownWebhookEventException extends Error {
  constructor(message: string) {
    super(`Unknown webhook event: ${message}`)
    this.name = 'UnknownWebhookEventException'
  }
}

export class WebhookSignatureException extends Error {
  constructor(message: string) {
    super(`Webhook signature error: ${message}`)
    this.name = 'WebhookSignatureException'
  }
}

export class WebhookConfigurationException extends Error {
  constructor(message: string) {
    super(`Webhook configuration error: ${message}`)
    this.name = 'WebhookConfigurationException'
  }
}

export class WebhookTimeoutException extends Error {
  constructor(message: string) {
    super(`Webhook timeout: ${message}`)
    this.name = 'WebhookTimeoutException'
  }
}
