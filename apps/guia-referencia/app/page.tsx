'use client';

import { useState } from 'react';
import { Search, BookOpen, Download, Home } from 'lucide-react';

export default function GuiaReferencia() {
  const [busca, setBusca] = useState('');
  const [expandido, setExpandido] = useState<string | null>(null);

  const escalas = [
    {
      id: 'glasgow',
      nome: 'Escala de Glasgow',
      categoria: 'Nível de Consciência',
      cor: 'bg-blue-500',
      resumo: 'Avaliação do nível de consciência (3-15 pontos)',
      conteudo: `
        <strong>ABERTURA OCULAR:</strong><br/>
        4 - Espontânea<br/>
        3 - Ao comando verbal<br/>
        2 - Ao estímulo doloroso<br/>
        1 - Ausente<br/><br/>
        
        <strong>RESPOSTA VERBAL:</strong><br/>
        5 - Orientado<br/>
        4 - Confuso<br/>
        3 - Palavras inapropriadas<br/>
        2 - Sons incompreensíveis<br/>
        1 - Ausente<br/><br/>
        
        <strong>RESPOSTA MOTORA:</strong><br/>
        6 - Obedece a comandos<br/>
        5 - Localiza o estímulo<br/>
        4 - Retira o membro<br/>
        3 - Decorticação<br/>
        2 - Descerebração<br/>
        1 - Ausente<br/><br/>
        
        <strong>Classificação:</strong><br/>
        13-15: Coma Leve<br/>
        9-12: Coma Moderado<br/>
        4-8: Coma Profundo<br/>
        3: Menor Responsividade
      `,
    },
    {
      id: 'ramsay',
      nome: 'Escala de Ramsay',
      categoria: 'Sedação',
      cor: 'bg-purple-500',
      resumo: 'Avaliação do nível de sedação (1-6)',
      conteudo: `
        <strong>Grau 1:</strong> Ansioso, agitado<br/>
        <strong>Grau 2:</strong> Cooperativo, orientado, tranquilo<br/>
        <strong>Grau 3:</strong> Sonolento, atende aos comandos<br/>
        <strong>Grau 4:</strong> Dormindo, responde rapidamente ao estímulo<br/>
        <strong>Grau 5:</strong> Dormindo, responde lentamente ao estímulo<br/>
        <strong>Grau 6:</strong> Dormindo, sem resposta
      `,
    },
    {
      id: 'rass',
      nome: 'Escala de RASS',
      categoria: 'Sedação',
      cor: 'bg-indigo-500',
      resumo: 'Richmond Agitation-Sedation Scale (-5 a +4)',
      conteudo: `
        <strong>+4:</strong> Agressivo - Violento, perigoso<br/>
        <strong>+3:</strong> Muito agitado - Remove tubos/cateteres<br/>
        <strong>+2:</strong> Agitado - Movimentos sem coordenação<br/>
        <strong>+1:</strong> Inquieto - Ansioso<br/>
        <strong>0:</strong> Alerto, calmo<br/>
        <strong>-1:</strong> Sonolento (>10seg ao som)<br/>
        <strong>-2:</strong> Sedação leve (<10seg ao som)<br/>
        <strong>-3:</strong> Sedação moderada<br/>
        <strong>-4:</strong> Sedação profunda<br/>
        <strong>-5:</strong> Incapaz de ser despertado
      `,
    },
    {
      id: 'borg',
      nome: 'Escala de Borg',
      categoria: 'Respiratória',
      cor: 'bg-green-500',
      resumo: 'Avaliação da dispneia (0-10)',
      conteudo: `
        <strong>0:</strong> Nenhuma<br/>
        <strong>0,5:</strong> Muito, muito leve<br/>
        <strong>1:</strong> Muito leve<br/>
        <strong>2:</strong> Leve<br/>
        <strong>3:</strong> Moderada<br/>
        <strong>4:</strong> Pouco intensa<br/>
        <strong>5:</strong> Intensa<br/>
        <strong>7:</strong> Muito intensa<br/>
        <strong>9:</strong> Muito, muito intensa<br/>
        <strong>10:</strong> Máxima
      `,
    },
    {
      id: 'gasometria',
      nome: 'Gasometria',
      categoria: 'Valores Normais',
      cor: 'bg-red-500',
      resumo: 'Valores de referência da gasometria arterial',
      conteudo: `
        <strong>pH:</strong> 7,35 a 7,45<br/>
        <strong>PaCO₂:</strong> 35 a 45 mmHg<br/>
        <strong>PaO₂:</strong> 80 a 100 mmHg<br/>
        <strong>HCO₃:</strong> 22 a 26 mEq/L<br/>
        <strong>BE:</strong> +2 a -2 mEq/L<br/><br/>
        
        <strong>Distúrbios:</strong><br/>
        PaCO₂ < 35: Alcalose Respiratória<br/>
        PaCO₂ > 45: Acidose Respiratória<br/>
        HCO₃ < 22: Acidose Metabólica<br/>
        HCO₃ > 26: Alcalose Metabólica
      `,
    },
    {
      id: 'mrc',
      nome: 'Força Muscular (MRC)',
      categoria: 'Motora',
      cor: 'bg-teal-500',
      resumo: 'Medical Research Council - Avaliação de força',
      conteudo: `
        <strong>Movimentos avaliados:</strong><br/>
        • Abdução do ombro<br/>
        • Flexão do cotovelo<br/>
        • Extensão do punho<br/>
        • Flexão do quadril<br/>
        • Extensão do joelho<br/>
        • Dorsiflexão do tornozelo<br/><br/>
        
        <strong>Graduação:</strong><br/>
        <strong>5:</strong> Força normal<br/>
        <strong>4:</strong> Contra gravidade + resistência<br/>
        <strong>3:</strong> Contra gravidade<br/>
        <strong>2:</strong> Com eliminação da gravidade<br/>
        <strong>1:</strong> Contração visível sem movimento<br/>
        <strong>0:</strong> Nenhuma contração
      `,
    },
  ];

  const escalasFiltradas = escalas.filter(
    escala =>
      escala.nome.toLowerCase().includes(busca.toLowerCase()) ||
      escala.categoria.toLowerCase().includes(busca.toLowerCase()) ||
      escala.resumo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-primary/10 via-white to-medical-secondary/10">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-medical-primary to-medical-secondary flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Guia de Referência</h1>
                <p className="text-xs text-gray-600">Reeduca Fisio UTI</p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-medical-primary text-white rounded-lg hover:bg-medical-primary/90 transition"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar PDF</span>
            </button>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar escala... (glasgow, sedação, etc)"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-transparent"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {escalasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma escala encontrada para "{busca}"</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {escalasFiltradas.map(escala => (
              <div
                key={escala.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl ${
                  expandido === escala.id ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                {/* Card Header */}
                <button
                  onClick={() => setExpandido(expandido === escala.id ? null : escala.id)}
                  className="w-full text-left"
                >
                  <div className={`${escala.cor} px-6 py-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-bold text-lg">{escala.nome}</h3>
                        <p className="text-white/90 text-sm">{escala.categoria}</p>
                      </div>
                      <div className="text-white">
                        {expandido === escala.id ? '−' : '+'}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Card Content */}
                <div className="p-6">
                  {expandido === escala.id ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: escala.conteudo }}
                    />
                  ) : (
                    <p className="text-gray-600 text-sm">{escala.resumo}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12 print:hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2026 Reeduca Fisio - Material de referência para fisioterapeutas
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Baseado no Guia de Avaliação Fisioterapêutica Respiratória e Motora (2014)
          </p>
        </div>
      </footer>
    </div>
  );
}
