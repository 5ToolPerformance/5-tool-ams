import { notFound } from "next/navigation";

import { getPlayerInformationByUserId } from "@/lib/db/playerInformation";
import { getUserById } from "@/lib/db/users";

export default async function PlayerPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUserById(params.id);
  if (!user) return notFound();

  const playerInfo = await getPlayerInformationByUserId(params.id);

  return (
    <div className="m-4 space-y-4 rounded-md bg-slate-600 p-6">
      <h1 className="text-2xl font-bold">{user.name}</h1>

      <section className="rounded-md border p-4">
        <h2 className="text-xl font-semibold">Basic Info</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </section>

      {playerInfo && (
        <section className="rounded-md border p-4">
          <h2 className="text-xl font-semibold">Player Information</h2>
          <p>
            <strong>Position:</strong> {playerInfo.position}
          </p>
          <p>
            <strong>Weight:</strong> {playerInfo.weight}
          </p>
          <p>
            <strong>Height:</strong> {playerInfo.height}
          </p>
        </section>
      )}
    </div>
  );
}
