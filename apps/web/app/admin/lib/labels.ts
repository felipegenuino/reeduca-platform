export function roleLabel(role: string): string {
  const labels: Record<string, string> = {
    cadastrado: 'Cadastrado',
    student: 'Aluno',
    instructor: 'Instrutor',
    admin: 'Administrador',
  };
  return labels[role] ?? role;
}

export function subscriptionLabel(status: string | null): string {
  if (!status) return 'Sem assinatura';
  const labels: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    trial: 'Teste',
  };
  return labels[status] ?? status;
}

export function roleBadgeVariant(role: string) {
  switch (role) {
    case 'admin':
      return 'default' as const;
    case 'instructor':
      return 'secondary' as const;
    case 'student':
      return 'outline' as const;
    case 'cadastrado':
      return 'outline' as const;
    default:
      return 'outline' as const;
  }
}

export function statusBadgeVariant(status: string | null) {
  switch (status) {
    case 'active':
      return 'success' as const;
    case 'inactive':
      return 'destructive' as const;
    case 'trial':
      return 'warning' as const;
    default:
      return 'outline' as const;
  }
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}
