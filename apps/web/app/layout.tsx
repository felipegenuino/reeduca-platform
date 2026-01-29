import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Reeduca Fisio - Educação em Fisioterapia de Excelência',
  description:
    'Plataforma de cursos, e-books e conteúdos especializados em Fisioterapia Intensiva e Cardiorrespiratória com professoras doutoras da UFSC.',
  keywords: [
    'fisioterapia',
    'cursos',
    'uti',
    'intensiva',
    'cardiorrespiratória',
    'educação continuada',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
