import { notFound } from 'next/navigation';
import { getQuizSetBySlug, getAttemptInProgress } from '../../actions';
import { QuizRunner } from './QuizRunner';

type Props = { params: Promise<{ slug: string }> };

export default async function FazerSimuladoPage({ params }: Props) {
  const { slug } = await params;
  const set = await getQuizSetBySlug(slug);
  if (!set) notFound();

  const attempt = await getAttemptInProgress(set.id);

  return (
    <div className="space-y-6">
      <QuizRunner set={set} attempt={attempt} />
    </div>
  );
}
