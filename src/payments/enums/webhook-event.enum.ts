export enum WebhookEvent {
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_CANCELED = 'payment.canceled',
  PAYMENT_WAITING_FOR_CAPTURE = 'payment.waiting_for_capture',
  PAYMENT_PENDING = 'payment.pending',
}
