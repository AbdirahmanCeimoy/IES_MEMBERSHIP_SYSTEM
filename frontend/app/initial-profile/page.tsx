import { Suspense } from 'react';
import { InitialProfileClient } from './InitialProfileClient';

export const metadata = { title: 'Initial Profile' };

export default function InitialProfilePage() {
  return (
    <Suspense fallback={null}>
      <InitialProfileClient />
    </Suspense>
  );
}
