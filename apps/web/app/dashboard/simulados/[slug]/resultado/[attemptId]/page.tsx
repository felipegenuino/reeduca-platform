import { notFound } from 'next/navigation';
import { getAttemptResult } from '../../../actions';
import { ResultadoClient } from './ResultadoClient';

type Props = {
  params: Promise<{ slug: string; attemptId: string }>;
};

export default async function ResultadoPage({ params }: Props) {
  const { attemptId } = await params;
  const data = await getAttemptResult(attemptId);

  if (!data) notFound();

  return <ResultadoClient data={data} />;
}
