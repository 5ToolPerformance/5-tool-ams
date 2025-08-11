import { MotorPreferencesForm } from "@/types/assessments";

/**
 * ApiService is a class that provides static methods for interacting with the API.
 */
export class ApiService {
  /**
   * Fetches all users from the API.
   * @returns An array of User objects.
   * @throws Error if there is an issue with the API request.
   */
  static async fetchAllUsers() {
    const response = await fetch("/api/user");
    if (!response.ok) throw new Error("Failed to fetch users");
    const result = await response.json();
    return result.data;
  }

  /**
   * Fetches a user by their ID from the API.
   * @param id - The ID of the user to fetch.
   * @returns The User object if found, otherwise null.
   * @throws Error if there is an issue with the API request.
   */
  static async fetchUserById(id: string) {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    const result = await response.json();
    return result.data;
  }

  /**
   * Fetches all players from the API.
   * @returns An array of Player objects.
   * @throws Error if there is an issue with the API request.
   */
  static async fetchAllPlayers() {
    const response = await fetch("/api/players");
    if (!response.ok) throw new Error("Failed to fetch players");
    const result = await response.json();
    return result.data || [];
  }

  /**
   * Fetches a player's motor preference by their ID from the API.
   * @param id - The ID of the player to fetch.
   * @returns The MotorPreferences object if found, otherwise null.
   * @throws Error if there is an issue with the API request.
   */
  static async fetchMotorPreferenceById(id: string) {
    const response = await fetch(`/api/players/${id}/motor-preference`);

    if (response.ok) {
      const result = await response.json();
      return result.data;
    }

    // Handle different error statuses
    if (response.status === 404) {
      return null; // Return null for not found, allowing page to load
    }

    // Throw error for 500 and other errors
    const errorResult = await response.json();
    throw new Error(errorResult.error || "Failed to fetch motor preference");
  }

  /**
   * Creates a motor preference assessment for a player.
   * @param data - The MotorPreferencesForm object containing the assessment data.
   * @returns The created MotorPreferences object.
   * @throws Error if there is an issue with the API request.
   */
  static async createMotorPreference(data: MotorPreferencesForm) {
    const response = await fetch(
      `/api/players/${data.playerId}/motor-preference`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error("Failed to create motor preference");
    const result = await response.json();
    return result.data;
  }

  /**
   * Fetches a player and their information by their ID from the API.
   * @param id - The ID of the player to fetch.
   * @returns The Player and PlayerInformation objects if found, otherwise null.
   * @throws Error if there is an issue with the API request.
   */
  static async fetchPlayerWithInformationById(id: string) {
    const player = await fetch(`/api/players/${id}`);
    if (!player.ok) throw new Error("Failed to fetch player");
    const playerInfo = await fetch(`/api/players/${id}/player-information`);
    if (!playerInfo.ok) throw new Error("Failed to fetch player information");
    const motorPreference = await fetch(`/api/players/${id}/motor-preference`);
    if (!motorPreference.ok)
      throw new Error("Failed to fetch motor preference");
    return {
      player: await player.json(),
      playerInfo: await playerInfo.json(),
      motorPreference: await motorPreference.json(),
    };
  }

  /**
   * Fetches a lesson by its ID from the API.
   * @param id - The ID of the lesson to fetch.
   * @returns The lesson object if found, otherwise null.
   * @throws Error if there is an issue with the API request.
   */
  static async fetchLessonById(id: string) {
    const response = await fetch(`/api/lessons/${id}`);
    if (!response.ok) throw new Error("Failed to fetch lesson");
    const result = await response.json();
    return result.data;
  }

  /**
   * Fetches a lesson assessment by its ID from the API.
   * @param id - The ID of the lesson assessment to fetch.
   * @param type - The type of the lesson assessment to fetch.
   * @returns The lesson assessment object if found, otherwise null.
   * @throws Error if there is an issue with the API request.
   */
  static async fetchLessonAssessmentById(id: string, type: string) {
    const response = await fetch(`/api/assessments/${id}?type=${type}`);
    if (!response.ok) throw new Error("Failed to fetch lesson assessment");
    const result = await response.json();
    return result.data;
  }

  /**
   * Fetches lessons for a specific coach from the API.
   * @param coachId - The ID of the coach to fetch lessons for
   * @returns the lessons for the specified coach
   * @throws Error if there is an issue with the API request
   */
  static async fetchLessonsByCoachId(coachId: string) {
    const response = await fetch(`/api/lessons?coachId=${coachId}`);
    if (!response.ok) throw new Error("Failed to fetch lesson");
    const result = await response.json();
    return result.data;
  }

  /**
   * Fetches all lessons from the API.
   * @returns An array of Lesson objects.
   * @throws Error if there is an issue with the API request.
   */
  static async fetchAllLessons() {
    const response = await fetch("/api/lessons");
    if (!response.ok) throw new Error("Failed to fetch lesson");
    const result = await response.json();
    return result.data;
  }

  /**
   * Fetches assessments for a specific lesson from the API.
   * @param lessonId - The ID of the lesson to fetch assessments for
   * @returns the assessments for the specified lesson
   * @throws Error if there is an issue with the API request
   */
  static async fetchAssessmentsByLessonId(lessonId: string) {
    const response = await fetch(`/api/assessments?lessonId=${lessonId}`);
    if (!response.ok) throw new Error("Failed to fetch lesson");
    const result = await response.json();
    return result.data;
  }
}
