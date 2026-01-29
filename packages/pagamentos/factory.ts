import type { PaymentProvider } from './types';
import { AsaasProvider } from './providers/asaas';

export type ProviderType = 'asaas' | 'stripe' | 'mercadopago';

export class PaymentFactory {
  private static instance: PaymentProvider | null = null;

  static createProvider(type: ProviderType = 'asaas'): PaymentProvider {
    // Singleton para evitar múltiplas instâncias
    if (this.instance) return this.instance;

    const apiKey = process.env.PAYMENT_API_KEY || process.env.ASAAS_API_KEY;
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.ASAAS_WEBHOOK_SECRET;
    const isSandbox = process.env.NODE_ENV !== 'production';

    if (!apiKey) {
      throw new Error('Payment API key not configured');
    }

    switch (type) {
      case 'asaas':
        this.instance = new AsaasProvider(apiKey, webhookSecret, isSandbox);
        break;

      case 'stripe':
        // TODO: Implementar Stripe provider se necessário
        throw new Error('Stripe provider not implemented yet');

      case 'mercadopago':
        // TODO: Implementar Mercado Pago provider se necessário
        throw new Error('Mercado Pago provider not implemented yet');

      default:
        throw new Error(`Unknown payment provider: ${type}`);
    }

    return this.instance;
  }

  static getProvider(): PaymentProvider {
    if (!this.instance) {
      return this.createProvider('asaas');
    }
    return this.instance;
  }
}

// Helper para facilitar uso
export const paymentProvider = PaymentFactory.getProvider();
