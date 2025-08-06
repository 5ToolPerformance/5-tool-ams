export class StringService {
  /**
   * Converts a string to title case.
   * @param str - The string to convert.
   * @returns The string in title case.
   */
  static toTitleCase(str: string) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  /**
   * Formats a lesson type string.
   * @param str - The lesson type string to format.
   * @returns The formatted lesson type string.
   */
  static formatLessonType(str: string) {
    return str
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
