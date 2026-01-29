import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { promoteUserToStudent } from '@/lib/auth';

/**
 * Webhook do Asaas — recebe eventos de pagamento (PAYMENT_CONFIRMED, PAYMENT_RECEIVED).
 * Atualiza a compra em purchases e promove o usuário de "cadastrado" para "student" quando aplicável.
 *
 * URL em produção: https://reeduca-platform-web.vercel.app/api/webhooks/asaas
 * Configure no painel Asaas: Integrações → Webhooks, com authToken (ASAAS_WEBHOOK_SECRET).
 */

const EVENTOS_PAGO = ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'] as const;

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.ASAAS_WEBHOOK_SECRET || process.env.PAYMENT_WEBHOOK_SECRET;
    if (secret) {
      const token = request.headers.get('asaas-access-token');
      if (token !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await request.json();
    const event = body?.event as string | undefined;
    const payment = body?.payment;

    if (!event || !payment?.id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Só processamos eventos de pagamento confirmado/recebido
    if (!EVENTOS_PAGO.includes(event as (typeof EVENTOS_PAGO)[number])) {
      return NextResponse.json({ received: true });
    }

    const admin = createAdminClient();
    const { data: purchase, error: findError } = await admin
      .from('purchases')
      .select('id, user_id, status')
      .eq('asaas_payment_id', payment.id)
      .maybeSingle();

    if (findError) {
      console.error('[webhook asaas] Erro ao buscar compra:', findError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!purchase) {
      // Cobrança pode ser de outro sistema ou compra não registrada aqui; aceitamos para não falhar o webhook
      return NextResponse.json({ received: true });
    }

    if (purchase.status === 'paid') {
      // Idempotência: evento duplicado
      return NextResponse.json({ received: true });
    }

    const { error: updateError } = await admin
      .from('purchases')
      .update({ status: 'paid', updated_at: new Date().toISOString() } as never)
      .eq('id', purchase.id);

    if (updateError) {
      console.error('[webhook asaas] Erro ao atualizar compra:', updateError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    try {
      await promoteUserToStudent(purchase.user_id);
    } catch (e) {
      console.error('[webhook asaas] Erro ao promover usuário (não bloqueia):', e);
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('[webhook asaas] Erro inesperado:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
