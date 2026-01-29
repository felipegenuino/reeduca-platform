// Payment Provider Abstract Interface
// Permite trocar facilmente entre Asaas, Stripe, Mercado Pago, etc.

export interface PaymentProvider {
  name: string;
  createPayment(data: CreatePaymentData): Promise<PaymentResponse>;
  createSubscription(data: CreateSubscriptionData): Promise<SubscriptionResponse>;
  getPayment(paymentId: string): Promise<PaymentResponse>;
  cancelPayment(paymentId: string): Promise<void>;
  refundPayment(paymentId: string): Promise<void>;
  handleWebhook(payload: any, signature?: string): Promise<WebhookEvent>;
}

export interface CreatePaymentData {
  customerId: string;
  amount: number;
  description: string;
  dueDate?: Date;
  billingType?: 'CREDIT_CARD' | 'BOLETO' | 'PIX';
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  customer?: {
    name: string;
    email: string;
    cpfCnpj: string;
    phone?: string;
  };
}

export interface CreateSubscriptionData {
  customerId: string;
  billingType: 'CREDIT_CARD' | 'BOLETO';
  value: number;
  cycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  description: string;
  nextDueDate?: Date;
}

export interface PaymentResponse {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'RECEIVED' | 'OVERDUE' | 'REFUNDED' | 'FAILED';
  amount: number;
  invoiceUrl?: string;
  pixQrCode?: string;
  boletoUrl?: string;
  dueDate?: Date;
}

export interface SubscriptionResponse {
  id: string;
  status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
  nextDueDate: Date;
  value: number;
}

export interface WebhookEvent {
  type: string;
  data: any;
}

// Payment Status Mapper
export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];
