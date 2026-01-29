import { NextResponse } from 'next/server';

/**
 * Rota de teste da API Asaas — só funciona em desenvolvimento.
 * GET /api/test-asaas → verifica se ASAAS_API_KEY está configurada e se a API responde.
 * Em produção retorna 404.
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return NextResponse.json(
      { ok: false, error: 'ASAAS_API_KEY não está definida no .env.local' },
      { status: 200 }
    );
  }

  const baseURL = 'https://sandbox.asaas.com/api/v3';
  try {
    const res = await fetch(`${baseURL}/customers?limit=1`, {
      headers: {
        'Content-Type': 'application/json',
        access_token: apiKey.trim(),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      let message = `Asaas retornou ${res.status}`;
      try {
        const data = JSON.parse(text);
        if (data.errors?.[0]?.description) message = data.errors[0].description;
      } catch {
        if (text) message = text.slice(0, 200);
      }
      return NextResponse.json({ ok: false, error: message }, { status: 200 });
    }

    return NextResponse.json({
      ok: true,
      message: 'API Asaas (sandbox) respondendo. Chave válida.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao conectar na API';
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }
}
