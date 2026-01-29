import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function EntrarPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
