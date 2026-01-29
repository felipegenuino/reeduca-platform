import axios, { AxiosInstance } from 'axios';
import type {
  PaymentProvider,
  CreatePaymentData,
  CreateSubscriptionData,
  PaymentResponse,
  SubscriptionResponse,
  WebhookEvent,
} from './types';

export class AsaasProvider implements PaymentProvider {
  public readonly name = 'asaas';
  private client: AxiosInstance;
  private apiKey: string;
  private webhookSecret?: string;

  constructor(apiKey: string, webhookSecret?: string, sandbox = true) {
    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;

    const baseURL = sandbox
      ? 'https://sandbox.asaas.com/api/v3'
      : 'https://www.asaas.com/api/v3';

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        access_token: this.apiKey,
      },
    });
  }

  async createPayment(data: CreatePaymentData): Promise<PaymentResponse> {
    try {
      const payload: any = {
        customer: data.customerId,
        billingType: data.billingType || 'CREDIT_CARD',
        value: data.amount,
        dueDate: data.dueDate
          ? new Date(data.dueDate).toISOString().split('T')[0]
          : undefined,
        description: data.description,
      };

      // Se for cartão de crédito, adicionar dados do cartão
      if (data.billingType === 'CREDIT_CARD' && data.creditCard) {
        payload.creditCard = {
          holderName: data.creditCard.holderName,
          number: data.creditCard.number.replace(/\s/g, ''),
          expiryMonth: data.creditCard.expiryMonth,
          expiryYear: data.creditCard.expiryYear,
          ccv: data.creditCard.ccv,
        };
        payload.creditCardHolderInfo = {
          name: data.customer?.name || data.creditCard.holderName,
          email: data.customer?.email,
          cpfCnpj: data.customer?.cpfCnpj,
          postalCode: '00000000', // Pode ser melhorado
          addressNumber: '0',
          phone: data.customer?.phone || '0000000000',
        };
      }

      const response = await this.client.post('/payments', payload);

      return this.mapPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Asaas createPayment error:', error.response?.data || error.message);
      throw new Error(`Payment creation failed: ${error.response?.data?.errors?.[0]?.description || error.message}`);
    }
  }

  async createSubscription(data: CreateSubscriptionData): Promise<SubscriptionResponse> {
    try {
      const payload = {
        customer: data.customerId,
        billingType: data.billingType,
        value: data.value,
        cycle: data.cycle,
        description: data.description,
        nextDueDate: data.nextDueDate
          ? new Date(data.nextDueDate).toISOString().split('T')[0]
          : undefined,
      };

      const response = await this.client.post('/subscriptions', payload);

      return {
        id: response.data.id,
        status: response.data.status,
        nextDueDate: new Date(response.data.nextDueDate),
        value: response.data.value,
      };
    } catch (error: any) {
      console.error('Asaas createSubscription error:', error.response?.data || error.message);
      throw new Error(`Subscription creation failed: ${error.message}`);
    }
  }

  async getPayment(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await this.client.get(`/payments/${paymentId}`);
      return this.mapPaymentResponse(response.data);
    } catch (error: any) {
      console.error('Asaas getPayment error:', error.response?.data || error.message);
      throw new Error(`Failed to get payment: ${error.message}`);
    }
  }

  async cancelPayment(paymentId: string): Promise<void> {
    try {
      await this.client.delete(`/payments/${paymentId}`);
    } catch (error: any) {
      console.error('Asaas cancelPayment error:', error.response?.data || error.message);
      throw new Error(`Payment cancellation failed: ${error.message}`);
    }
  }

  async refundPayment(paymentId: string): Promise<void> {
    try {
      await this.client.post(`/payments/${paymentId}/refund`);
    } catch (error: any) {
      console.error('Asaas refundPayment error:', error.response?.data || error.message);
      throw new Error(`Payment refund failed: ${error.message}`);
    }
  }

  async handleWebhook(payload: any, signature?: string): Promise<WebhookEvent> {
    // TODO: Implementar validação de assinatura do webhook
    // if (this.webhookSecret && signature) {
    //   const isValid = this.validateWebhookSignature(payload, signature);
    //   if (!isValid) throw new Error('Invalid webhook signature');
    // }

    return {
      type: payload.event,
      data: payload.payment || payload.subscription || payload,
    };
  }

  // Helper para mapear resposta do Asaas para nosso formato
  private mapPaymentResponse(asaasPayment: any): PaymentResponse {
    return {
      id: asaasPayment.id,
      status: this.mapStatus(asaasPayment.status),
      amount: asaasPayment.value,
      invoiceUrl: asaasPayment.invoiceUrl,
      pixQrCode: asaasPayment.pixQrCodeUrl,
      boletoUrl: asaasPayment.bankSlipUrl,
      dueDate: asaasPayment.dueDate ? new Date(asaasPayment.dueDate) : undefined,
    };
  }

  private mapStatus(
    asaasStatus: string
  ): 'PENDING' | 'CONFIRMED' | 'RECEIVED' | 'OVERDUE' | 'REFUNDED' | 'FAILED' {
    const statusMap: Record<string, PaymentResponse['status']> = {
      PENDING: 'PENDING',
      CONFIRMED: 'CONFIRMED',
      RECEIVED: 'RECEIVED',
      OVERDUE: 'OVERDUE',
      REFUNDED: 'REFUNDED',
      REFUND_REQUESTED: 'REFUNDED',
      CHARGEBACK_REQUESTED: 'FAILED',
      CHARGEBACK_DISPUTE: 'FAILED',
      AWAITING_CHARGEBACK_REVERSAL: 'FAILED',
      DUNNING_REQUESTED: 'FAILED',
      DUNNING_RECEIVED: 'FAILED',
      AWAITING_RISK_ANALYSIS: 'PENDING',
    };

    return statusMap[asaasStatus] || 'PENDING';
  }

  // Helper para criar cliente Asaas
  async createCustomer(data: {
    name: string;
    email: string;
    cpfCnpj: string;
    phone?: string;
  }): Promise<string> {
    try {
      const response = await this.client.post('/customers', {
        name: data.name,
        email: data.email,
        cpfCnpj: data.cpfCnpj,
        mobilePhone: data.phone,
      });

      return response.data.id;
    } catch (error: any) {
      console.error('Asaas createCustomer error:', error.response?.data || error.message);
      throw new Error(`Customer creation failed: ${error.message}`);
    }
  }
}
