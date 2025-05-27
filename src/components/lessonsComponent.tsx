import { Card, CardBody, Chip } from "@heroui/react";

const LessonsSection: React.FC = () => {
  const lessons = [
    {
      id: 1,
      date: "2024-05-25",
      title: "Batting Stance Improvement",
      coach: "Coach Martinez",
      notes:
        "Great progress on stance alignment. Focus on keeping shoulders square and maintaining balance through the swing.",
      skills: ["Batting", "Stance", "Balance"],
    },
    {
      id: 2,
      date: "2024-05-22",
      title: "Fielding Fundamentals",
      coach: "Coach Johnson",
      notes:
        "Worked on glove positioning and footwork. Remember to stay low and move your feet to the ball.",
      skills: ["Fielding", "Footwork", "Glove Work"],
    },
    {
      id: 3,
      date: "2024-05-20",
      title: "Base Running Technique",
      coach: "Coach Williams",
      notes:
        "Excellent improvement in first step quickness. Continue working on reading the pitcher's moves.",
      skills: ["Base Running", "Speed", "Game Awareness"],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Lesson Notes</h2>
        <p className="text-sm text-default-600">
          {lessons.length} total lessons
        </p>
      </div>

      {lessons.map((lesson) => (
        <Card key={lesson.id}>
          <CardBody className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{lesson.title}</h3>
                  <span className="text-sm text-default-500">
                    • {lesson.date}
                  </span>
                </div>
                <p className="mb-3 text-sm text-primary">with {lesson.coach}</p>
                <p className="mb-4 text-default-700">{lesson.notes}</p>
                <div className="flex flex-wrap gap-2">
                  {lesson.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      size="sm"
                      variant="flat"
                      color="secondary"
                    >
                      {skill}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
export default LessonsSection;
