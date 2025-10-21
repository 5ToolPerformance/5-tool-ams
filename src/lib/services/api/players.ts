/**
 * PlayerRepository is a service that provides access to player data
 * through the Database.
 */
export const playerRepository = {
  /**
   * Fetches all players from the database.
   * @returns An array of Player objects.
   */
  fetchPlayers: () => {
    return fetch("/api/players").then((res) => res.json());
  },
};
