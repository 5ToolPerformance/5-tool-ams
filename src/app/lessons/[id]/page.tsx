import { LessonPageComponent } from "@/components/lessons/LessonPage";
import { PageProps } from "@/types/page";

type LessonPageProps = PageProps<{ id: string }>;

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  return <LessonPageComponent lessonId={id} />;
}
