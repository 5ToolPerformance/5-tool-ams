import { Suspense } from "react";

import { getPlayerDevelopmentTabData } from "@/application/players/development";
import { DevelopmentTab } from "@/ui/features/athlete-development/DevelopmentTab";

interface DevelopmentPageProps {
  params: Promise<{ playerId: string }>;
  searchParams: Promise<{ discipline?: string }>;
}

export default async function DevelopmentPage({
  params,
  searchParams,
}: DevelopmentPageProps) {
  const { playerId } = await params;
  const { discipline } = await searchParams;
  const data = await getPlayerDevelopmentTabData(playerId, discipline);

  return (
    <Suspense fallback={<div>Loading development tab...</div>}>
      <DevelopmentTab data={data} />
    </Suspense>
  );
}
