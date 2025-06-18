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
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    };
    
    /**
     * Fetches a user by their ID from the API.
     * @param id - The ID of the user to fetch.
     * @returns The User object if found, otherwise null.
     * @throws Error if there is an issue with the API request.
     */
    static async fetchUserById(id: string) {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    }

    /**
     * Fetches all players from the API.
     * @returns An array of Player objects.
     * @throws Error if there is an issue with the API request.
     */
    static async fetchAllPlayers() {
      const res = await fetch("/api/players");
      if (!res.ok) throw new Error("Failed to fetch players");
      return res.json();
    }

    /**
     * Fetches a player's motor preference by their ID from the API.
     * @param id - The ID of the player to fetch.
     * @returns The MotorPreferences object if found, otherwise null.
     * @throws Error if there is an issue with the API request.
     */
    static async fetchMotorPreferenceById(id: string) {
      const res = await fetch(`/api/players/${id}/motor-preference`);
      if (!res.ok) throw new Error("Failed to fetch motor preference");
      return res.json();
    }

    static async createMotorPreference(data: MotorPreferencesForm) {
      const res = await fetch(`/api/players/${data.playerId}/motor-preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create motor preference");
      return res.json();
    }
}