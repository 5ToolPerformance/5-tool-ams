export function formatLessonDate(date: Date | string): string {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

export function getAge(birthDate: Date | string): string {
  const today = new Date();
  const birthDateObj =
    birthDate instanceof Date ? birthDate : new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const month = today.getMonth() - birthDateObj.getMonth();
  if (
    month < 0 ||
    (month === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }
  return age.toString();
}
