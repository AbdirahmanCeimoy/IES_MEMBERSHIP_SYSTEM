import { Suspense } from 'react';
import { RegisterClient } from './RegisterClient';

export const metadata = { title: 'Register - Apply for Membership' };

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterClient />
    </Suspense>
  );
}
