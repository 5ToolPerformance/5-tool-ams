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
    if (!response.ok) throw new Error("Failed to fetch motor preference");
    const result = await response.json();
    return result.data;
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
}
