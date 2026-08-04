'use client';

import dynamic from 'next/dynamic';

const LightningDesignSystemDemo = dynamic(
  () => import('@/components/LightningDesignSystemDemo').then((mod) => mod.LightningDesignSystemDemo),
  { ssr: false }
);

export function LightningDemoClient() {
  return <LightningDesignSystemDemo />;
}
