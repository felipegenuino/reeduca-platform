import { Button } from '@reeduca/ui';
import { GraduationCap, Users, Award, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Reeduca Fisio</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#cursos" className="text-sm font-medium hover:text-blue-600 transition">
              Cursos
            </Link>
            <Link href="#sobre" className="text-sm font-medium hover:text-blue-600 transition">
              Sobre
            </Link>
            <Link href="#contato" className="text-sm font-medium hover:text-blue-600 transition">
              Contato
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/entrar">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="sm">Começar Agora</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              <Award className="w-4 h-4" />
              Educação por Doutoras da UFSC
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Transforme sua{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                carreira
              </span>{' '}
              em Fisioterapia
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Cursos especializados em Fisioterapia Intensiva e Cardiorrespiratória com
              professoras doutoras experientes. Aprenda com quem atua na linha de frente da UTI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cursos">
                <Button size="lg" className="w-full sm:w-auto">
                  Ver Cursos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/sobre">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Conheça as Professoras
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Alunos</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <div className="text-3xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-600">Cursos</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">Avaliação</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
              <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                <div className="text-center p-8">
                  <BookOpen className="w-24 h-24 mx-auto text-blue-600 mb-4" />
                  <p className="text-gray-600">
                    Área de preview dos cursos
                    <br />
                    (imagem será adicionada)
                  </p>
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Novo curso disponível!</div>
                  <div className="text-sm text-gray-600">Mobilização Precoce em UTI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20" id="cursos">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que escolher a Reeduca?</h2>
            <p className="text-xl text-gray-600">
              Educação de excelência com foco na prática clínica
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Junte-se a centenas de fisioterapeutas que já transformaram suas carreiras
          </p>
          <Link href="/cadastro">
            <Button size="lg" variant="secondary">
              Criar Conta Gratuita
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white text-lg">Reeduca Fisio</span>
              </div>
              <p className="text-sm">
                Educação em Fisioterapia de excelência com professoras doutoras da UFSC.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Cursos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/cursos/intensiva" className="hover:text-white transition">
                    Fisioterapia Intensiva
                  </Link>
                </li>
                <li>
                  <Link href="/cursos/cardio" className="hover:text-white transition">
                    Cardiorrespiratória
                  </Link>
                </li>
                <li>
                  <Link href="/cursos/todos" className="hover:text-white transition">
                    Todos os cursos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/sobre" className="hover:text-white transition">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="hover:text-white transition">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Redes Sociais</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://instagram.com/reeduca.fisio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2026 Reeduca Fisio. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: GraduationCap,
    title: 'Professoras Doutoras',
    description:
      'Aprenda com Kelly e Katerine, fisioterapeutas doutoras com +15 anos de experiência em UTI.',
  },
  {
    icon: Users,
    title: 'Casos Clínicos Reais',
    description:
      'Estude casos reais do Hospital Universitário da UFSC e desenvolva raciocínio clínico.',
  },
  {
    icon: Award,
    title: 'Certificado Reconhecido',
    description: 'Certificados digitais com carga horária para seu desenvolvimento profissional.',
  },
];
