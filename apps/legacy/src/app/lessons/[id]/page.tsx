import { getLessonById } from "@/db/queries/lessons/lessonQueries";
import { PageProps } from "@/types/page";
import {
  LessonViewer,
  LessonViewerSkeleton,
} from "@/ui/features/lessons/lessonViewer";

type LessonPageProps = PageProps<{ id: string }, { playerId?: string }>;

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
  searchParams,
}: LessonPageProps) {
  const { id } = await params;
  const { playerId } = await searchParams;
  const lessonData = await getLessonById(id);
  if (!lessonData) {
    return <LessonViewerSkeleton />;
  }
  return (
    <LessonViewer lesson={lessonData} viewContext="player" playerId={playerId} />
  );
}
