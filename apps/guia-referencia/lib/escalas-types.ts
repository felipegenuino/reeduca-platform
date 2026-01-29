// Dados extraídos do PDF - Guia de Avaliação Fisioterapêutica

export interface EscalaItem {
  descricao: string;
  pontuacao: number | string;
}

export interface Escala {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'consciencia' | 'sedacao' | 'respiratoria' | 'motora' | 'gasometria';
  cor: string;
  items: EscalaItem[];
  observacoes?: string;
}

export const categorias = [
  { id: 'consciencia', nome: 'Nível de Consciência', cor: 'bg-blue-500' },
  { id: 'sedacao', nome: 'Sedação', cor: 'bg-purple-500' },
  { id: 'respiratoria', nome: 'Respiratória', cor: 'bg-green-500' },
  { id: 'gasometria', nome: 'Gasometria', cor: 'bg-red-500' },
  { id: 'motora', nome: 'Motora', cor: 'bg-orange-500' },
] as const;
