import { updateSession } from '@/lib/supabase/proxy';

export async function middleware(request: Request) {
  return updateSession(request as import('next/server').NextRequest);
}

export const config = {
  matcher: [
    /*
     * Todas as rotas exceto:
     * - _next/static, _next/image, favicon, assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
