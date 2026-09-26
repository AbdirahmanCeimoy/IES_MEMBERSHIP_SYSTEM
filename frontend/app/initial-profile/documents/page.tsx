import { Suspense } from 'react';
import { DocumentsUploadClient } from './DocumentsUploadClient';

export const metadata = { title: 'Upload Documents' };

export default function DocumentsPage() {
  return (
    <Suspense fallback={null}>
      <DocumentsUploadClient />
    </Suspense>
  );
}
