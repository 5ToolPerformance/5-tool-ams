import { useEffect, useMemo, useState } from "react";

import { Button, Select, SelectItem } from "@heroui/react";

import LessonCard, { LessonData } from "@/components/lessons/lessonCard";
import { LESSON_TYPES } from "@/types/lessons";

interface LessonsSectionProps {
  playerId: string | number | null;
}

const LessonsSection: React.FC<LessonsSectionProps> = ({ playerId }) => {
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/players/${playerId}/lessons`);

        if (!response.ok) {
          throw new Error(`Failed to fetch lessons: ${response.statusText}`);
        }

        const data = await response.json();
        setLessons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    if (playerId) {
      fetchLessons();
    }
  }, [playerId]);

  const availableLessonTypes = useMemo(() => {
    if (!Array.isArray(lessons) || lessons.length === 0) {
      return [];
    }

    return LESSON_TYPES.filter((type) =>
      lessons.some((lesson) => lesson.type === type.value)
    );
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    if (!Array.isArray(lessons)) {
      return [];
    }

    if (selectedFilter === "all") {
      return lessons;
    }
    return lessons.filter((lesson) => lesson.type === selectedFilter);
  }, [lessons, selectedFilter]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (keys: any) => {
    setSelectedFilter(Array.from(keys)[0] as string);
  };

  const clearFilter = () => {
    setSelectedFilter("all");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Lesson Notes</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-default-500">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Lesson Notes</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-danger">Error loading lessons: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Lesson Notes</h2>

        {availableLessonTypes.length > 0 && (
          <div className="flex items-center gap-2">
            <Select
              size="sm"
              placeholder="Filter by type"
              className="w-48"
              selectedKeys={[selectedFilter]}
              onSelectionChange={handleFilterChange}
            >
              <>
                <SelectItem key="all">All Types</SelectItem>
                {availableLessonTypes.map((type) => (
                  <SelectItem key={type.value}>{type.label}</SelectItem>
                ))}
              </>
            </Select>

            {selectedFilter !== "all" && (
              <Button
                size="sm"
                variant="light"
                onPress={clearFilter}
                className="text-default-500"
              >
                Clear
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-default-600">
          {selectedFilter === "all"
            ? `${lessons.length} total lesson${lessons.length !== 1 ? "s" : ""}`
            : `${filteredLessons.length} of ${lessons.length} lessons`}
          {selectedFilter !== "all" && (
            <span className="ml-1 text-primary">
              (filtered by {selectedFilter})
            </span>
          )}
        </p>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-default-500">
            {selectedFilter === "all"
              ? "No lessons found for this player."
              : `No ${selectedFilter} lessons found for this player.`}
          </p>
        </div>
      ) : (
        filteredLessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))
      )}
    </div>
  );
};

export default LessonsSection;
