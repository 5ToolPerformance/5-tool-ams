export const assessmentRepository = {
  getPowerRating: async () => {
    try {
    } catch (error) {
      console.error(
        "[AssessmentRepo] getPowerRating - Database error: ",
        error
      );
      throw new Error("Failed to fetch assessments from the database");
    }
  },
};
