import { notFound } from "next/navigation";

import { getServerSession } from "next-auth";

import LessonForm from "@/components/lesson-form/page";
import options from "@/config/auth";
import { formatDateOnly } from "@/lib/dates";
import { getNotesByUserId } from "@/lib/db/notes";
import { getPlayerInformationByUserId } from "@/lib/db/playerInformation";
import { getUserById } from "@/lib/db/users";

type PlayerPageProps = {
  params: {
    playerId: string;
  };
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { playerId } = await params;
  const user = await getUserById(playerId);
  if (!user) return notFound();

  const playerInfo = await getPlayerInformationByUserId(playerId);
  const playerNotes = await getNotesByUserId(playerId);
  const session = await getServerSession(options);

  return (
    <div className="m-4 space-y-4 rounded-md bg-slate-600 p-6">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <div>
        {["coach", "admin"].includes(session?.user?.role ?? "") && (
          <LessonForm playerId={playerId} />
        )}
      </div>
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

      {playerNotes && (
        <section className="rounded-md border p-4">
          <h1 className="text-2xl font-bold">Lessons</h1>
          {playerNotes.map((note) => (
            <div key={note.id} className="mb-4">
              <h3 className="text-xl font-semibold">
                {formatDateOnly(note.lessonDate)}
              </h3>
              <h3 className="text-lg font-light">
                Coach: {getUserById(note.coachId).then((coach) => coach.name)}
              </h3>
              <p>{note.notes}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
