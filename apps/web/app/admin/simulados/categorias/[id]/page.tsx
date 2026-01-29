import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { EditCategoryForm } from '../components/EditCategoryForm';
import { Button } from '@reeduca/ui';
import { ArrowLeft } from 'lucide-react';

type ProfileRow = { id: string; role: string };

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (!(profile as ProfileRow) || (profile as ProfileRow).role !== 'admin') {
    notFound();
  }

  const admin = createAdminClient();
  const { data: category, error } = await admin
    .from('quiz_categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !category) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/simulados/categorias">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Editar categoria
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            {category.name}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 max-w-xl">
        <EditCategoryForm
          id={id}
          initialName={category.name}
          initialSlug={category.slug}
          initialDescription={category.description ?? ''}
          initialSortOrder={category.sort_order}
        />
      </div>
    </div>
  );
}
