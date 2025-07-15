export interface PaymentAmount {
  value: string
  currency: string
}

export interface PaymentConfirmation {
  type: 'redirect'
  return_url: string
  confirmation_url?: string
}

export interface PaymentResponse {
  id: string
  status: string
  amount: PaymentAmount
  confirmation?: PaymentConfirmation
  created_at: string
  description?: string
  metadata?: Record<string, any>
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export type PaymentStatus = 'pending' | 'waiting_for_capture' | 'succeeded' | 'cancelled'
