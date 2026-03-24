import { render, screen } from "@testing-library/react";

import { EvaluationBucketsStep } from "@/ui/features/development/forms/evaluation/EvaluationBucketsStep";

const useEvaluationFormContext = jest.fn();

jest.mock(
  "@/ui/features/development/forms/evaluation/EvaluationFormProvider",
  () => ({
    useEvaluationFormContext: () => useEvaluationFormContext(),
  })
);

describe("EvaluationBucketsStep", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("prompts for a discipline before loading buckets", () => {
    useEvaluationFormContext.mockReturnValue({
      availableBucketOptions: [],
      values: { disciplineId: "", buckets: [] },
      errors: {},
      updateBucket: jest.fn(),
    });

    render(<EvaluationBucketsStep />);

    expect(
      screen.getByText(
        "Select a discipline in Basic Information to load bucket options."
      )
    ).toBeTruthy();
  });

  it("renders each configured bucket with all status choices", () => {
    useEvaluationFormContext.mockReturnValue({
      availableBucketOptions: [
        {
          id: "bucket-1",
          disciplineId: "disc-1",
          key: "velo",
          label: "Velocity",
          description: "Fastball velocity",
          sortOrder: 1,
          active: true,
        },
        {
          id: "bucket-2",
          disciplineId: "disc-1",
          key: "command",
          label: "Command",
          description: "Strike quality",
          sortOrder: 2,
          active: true,
        },
      ],
      values: {
        disciplineId: "disc-1",
        buckets: [
          {
            id: "row-1",
            bucketId: "bucket-1",
            status: "strength",
            notes: "",
          },
          {
            id: "row-2",
            bucketId: "bucket-2",
            status: "",
            notes: "",
          },
        ],
      },
      errors: {},
      updateBucket: jest.fn(),
    });

    render(<EvaluationBucketsStep />);

    expect(screen.getByText("Velocity")).toBeTruthy();
    expect(screen.getByText("Command")).toBeTruthy();
    expect(screen.getAllByRole("radio", { name: "Strength" })).toHaveLength(2);
    expect(screen.getAllByRole("radio", { name: "Developing" })).toHaveLength(2);
    expect(screen.getAllByRole("radio", { name: "Constraint" })).toHaveLength(2);
    expect(screen.getAllByRole("radio", { name: "Not Relevant" })).toHaveLength(2);
  });
});
