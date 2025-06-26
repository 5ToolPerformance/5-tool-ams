import { LessonPageComponent } from "@/components/lessons/LessonPage";

type LessonPageProps = {
  params: {
    id: string;
  };
};

export default async function LessonPage({ params }: LessonPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  return <LessonPageComponent lessonId={id} />;
}
