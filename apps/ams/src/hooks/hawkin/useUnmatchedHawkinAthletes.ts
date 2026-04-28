export function useUnmatchedHawkinAthletes() {
  return {
    athletes: [],
    isLoading: false,
    error: new Error("Hawkin automatic integration is disabled"),
    refresh: async () => undefined,
  };
}
