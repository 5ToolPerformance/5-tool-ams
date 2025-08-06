/**
 * Service for date and time related operations.
 */
export class DateTimeService {
  /**
   * Formats a date to a human-readable string.
   * @param date - The date to format
   * @returns The formatted date string
   */
  static formatLessonDate(date: Date | string): string {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);

      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
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

  /**
   * Calculates the age based on a birthdate.
   * @param birthDate - The birthdate to calculate age from
   * @returns The age as a string
   */
  static getAge(birthDate: Date | string): string {
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
}
