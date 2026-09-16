import React from 'react';
import DepartmentDetailContent from './DepartmentDetailClient';

export function generateStaticParams() {
  return [
    { code: 'cse' },
    { code: 'csm' },
    { code: 'csd' },
    { code: 'ece' },
    { code: 'eee' },
    { code: 'mech' },
    { code: 'civil' },
    { code: 'mba' },
    { code: 'mca' },
  ];
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <DepartmentDetailContent code={code} />;
}
