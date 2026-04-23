// app/players/[playerId]/performance/page.tsx
import { redirect } from "next/navigation";

export default async function PerformancePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  redirect(`/players/${playerId}/performance/strength`);
}
