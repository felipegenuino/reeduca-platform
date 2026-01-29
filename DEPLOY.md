# Deploy em produção (VPS + domínio)

Use este checklist quando subir a VPS e tiver o domínio pronto.

---

## 1. Supabase (projeto PROD)

- **Authentication** → **URL Configuration**
  - **Site URL**: `https://seu-dominio.com`
  - **Redirect URLs** (adicione):
    - `https://seu-dominio.com/auth/callback`
    - `https://seu-dominio.com/auth/reset-password` (opcional)

---

## 2. Variáveis de ambiente na VPS

Use as credenciais do projeto **PROD** (não as do DEV). Exemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-prod
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```

(O restante — Asaas, etc. — conforme você já tem no `.env.prod`.)

---

## 3. DNS

- Apontar o domínio para o IP da VPS:
  - **Registro A**: `seu-dominio.com` → IP da VPS
  - Ou **CNAME** se usar subdomínio (ex.: `app.seu-dominio.com`)

---

## 4. Resumo

| Onde | O que fazer |
|------|-------------|
| Supabase PROD | Site URL + Redirect URLs com `https://seu-dominio.com` |
| VPS / app | Env vars do PROD + `NEXT_PUBLIC_SITE_URL=https://seu-dominio.com` |
| DNS | A ou CNAME apontando para a VPS |

Depois disso, login, callback e reset de senha devem funcionar em produção.
