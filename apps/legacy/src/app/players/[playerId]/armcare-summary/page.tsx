// app/(app)/players/[id]/armcare-summary/page.tsx
import { redirect } from "next/navigation";

export default async function PlayerArmCareSummaryPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  redirect(`/players/${playerId}/health/armcare-summary`);
}
