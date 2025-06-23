'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@heroui/react';

const ArmCareAssessmentViewer = dynamic(
  () => import('./armCareComponent').then((mod) => mod.ArmCareAssessmentViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Skeleton className="h-8 w-48 rounded-lg mb-4" />
        <Skeleton className="h-6 w-full rounded-lg mb-2" />
        <Skeleton className="h-6 w-5/6 rounded-lg mb-2" />
        <Skeleton className="h-6 w-4/6 rounded-lg" />
      </div>
    ),
  }
);

export default ArmCareAssessmentViewer;
