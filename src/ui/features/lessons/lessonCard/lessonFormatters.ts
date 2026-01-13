import {
  LessonCoachData,
  LessonPlayerData,
} from "@/db/queries/lessons/lessonQueries.types";

export function formatLessonDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatLessonTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getRelativeTime(dateString: string): string {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getPlayerInitials(player: LessonPlayerData) {
  return `${player.firstName[0]}${player.lastName[0]}`.toUpperCase();
}

export function getCoachInitials(coach: LessonCoachData) {
  if (!coach.name) return "??";
  const [a, b] = coach.name.split(" ");
  return b ? `${a[0]}${b[0]}` : coach.name.slice(0, 2).toUpperCase();
}
