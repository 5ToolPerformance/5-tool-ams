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

  it("disables adding buckets until a discipline is selected", () => {
    useEvaluationFormContext.mockReturnValue({
      availableBucketOptions: [],
      values: { disciplineId: "", buckets: [] },
      errors: {},
      addBucket: jest.fn(),
      updateBucket: jest.fn(),
      removeBucket: jest.fn(),
    });

    render(<EvaluationBucketsStep />);

    expect(
      screen.getByText(
        "Select a discipline in Basic Information to load bucket options."
      )
    ).toBeTruthy();
    expect(
      (screen.getByRole("button", { name: "Add Bucket" }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
  });

  it("shows configured bucket options for the selected discipline", () => {
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
      ],
      values: {
        disciplineId: "disc-1",
        buckets: [
          {
            id: "row-1",
            bucketId: "bucket-1",
            status: "developing",
            notes: "",
          },
        ],
      },
      errors: {},
      addBucket: jest.fn(),
      updateBucket: jest.fn(),
      removeBucket: jest.fn(),
    });

    render(<EvaluationBucketsStep />);

    expect(screen.getAllByText("Velocity").length).toBeGreaterThan(0);
  });
});
