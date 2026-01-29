import { fetchUsers } from './actions';
import { UsersTable } from './components/UsersTable';
import { UsersFilters } from './components/UsersFilters';

export default async function PessoasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; role?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const result = await fetchUsers({
    page,
    search: params.q,
    role: params.role,
    subscriptionStatus: params.status,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
          Pessoas
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
          Gerencie usuários, papéis e assinaturas.
        </p>
      </div>

      <UsersFilters
        currentSearch={params.q}
        currentRole={params.role}
        currentStatus={params.status}
      />

      <UsersTable
        users={result.users}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
      />
    </div>
  );
}
