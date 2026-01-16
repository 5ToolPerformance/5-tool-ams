// app/players/[playerId]/performance/page.tsx
import { redirect } from "next/navigation";

export default function PerformancePage({
  params,
}: {
  params: { playerId: string };
}) {
  redirect(`/players/${params.playerId}/performance/strength`);
}
