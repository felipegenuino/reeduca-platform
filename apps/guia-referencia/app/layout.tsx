import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Guia de Referência Rápida - Reeduca Fisio',
  description: 'Guia de avaliação fisioterapêutica respiratória e motora para UTI',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
