import { getLessonById } from "@/db/queries/lessons/lessonQueries";
import { PageProps } from "@/types/page";
import {
  LessonViewer,
  LessonViewerSkeleton,
} from "@/ui/features/lessons/lessonViewer";

type LessonPageProps = PageProps<{ id: string }>;

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const lessonData = await getLessonById(id);
  if (!lessonData) {
    return <LessonViewerSkeleton />;
  }
  return <LessonViewer lesson={lessonData} viewContext="player" />;
}
