"use client";

import React from "react";

import { useForm } from "@tanstack/react-form";
import { ChevronDown } from "lucide-react";

import { LessonCreateData } from "@/types/lessons";

// Types based on our schema
type LessonType = "strength" | "hitting" | "pitching" | "conditioning";

const LessonCreationForm = () => {
  const form = useForm<LessonCreateData>({
    defaultValues: {
      coachId: 1,
      playerId: 0,
      lessonType: "strength",
      lessonDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
      // Here you would call your API to create the lesson
      alert("Lesson created successfully! Check console for data.");
    },
  });

  // Initialize the selected lesson type from form state
  React.useEffect(() => {
    setSelectedLessonType("strength");
  }, []);

  const [selectedLessonType, setSelectedLessonType] =
    React.useState<LessonType>("strength");

  // Assessment form configurations
  const assessmentConfigs = {
    strength: ["armCare", "smfa", "forcePlate", "trueStrength"],
    hitting: ["hittingAssessment"],
    pitching: ["pitchingAssessment"], // Assuming pitching uses hitting assessments
    conditioning: ["forcePlateAssessment"],
  };

  const StrengthAssessmentForm = () => (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-blue-900">
        Strength Assessment
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <form.Field name="strengthAssessment.maxSquat">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Max Squat (lbs)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="275.00"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="strengthAssessment.maxBench">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Max Bench (lbs)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="225.00"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="strengthAssessment.maxDeadlift">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Max Deadlift (lbs)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="315.00"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="strengthAssessment.bodyWeight">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Body Weight (lbs)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="180.50"
                />
              </div>
            </div>
          )}
        </form.Field>
      </div>

      <div className="mt-4">
        <form.Field name="strengthAssessment.notes">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Assessment Notes
              </label>
              <div className="mt-2">
                <textarea
                  rows={3}
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="New PR on squat today..."
                />
              </div>
            </div>
          )}
        </form.Field>
      </div>
    </div>
  );

  const ForcePlateAssessmentForm = () => (
    <div className="rounded-lg border border-green-200 bg-green-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-green-900">
        Force Plate Assessment
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <form.Field name="forcePlateAssessment.jumpHeight">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Jump Height (inches)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="28.5"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="forcePlateAssessment.groundReactionForce">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Ground Reaction Force (N)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="2400.00"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="forcePlateAssessment.contactTime">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Contact Time (seconds)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.001"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.245"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="forcePlateAssessment.peakPower">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Peak Power (W)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="3200.00"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="forcePlateAssessment.rateOfForceDevelopment">
          {(field) => (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Rate of Force Development (N/s)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="1800.00"
                />
              </div>
            </div>
          )}
        </form.Field>
      </div>

      <div className="mt-4">
        <form.Field name="forcePlateAssessment.notes">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Assessment Notes
              </label>
              <div className="mt-2">
                <textarea
                  rows={3}
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Great improvement in explosive power..."
                />
              </div>
            </div>
          )}
        </form.Field>
      </div>
    </div>
  );

  const HittingAssessmentForm = () => (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-orange-900">
        Hitting Assessment
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <form.Field name="hittingAssessment.exitVelocity">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Exit Velocity (mph)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="95.5"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="hittingAssessment.launchAngle">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Launch Angle (degrees)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.01"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="25.5"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="hittingAssessment.spinRate">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Spin Rate (rpm)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="2200"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="hittingAssessment.distance">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Distance (feet)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="380"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="hittingAssessment.strikeZoneContact">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Strike Zone Contact (%)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  max="1"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.850"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="hittingAssessment.hardHitRate">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Hard Hit Rate (%)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  max="1"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.650"
                />
              </div>
            </div>
          )}
        </form.Field>
      </div>

      <div className="mt-4">
        <form.Field name="hittingAssessment.notes">
          {(field) => (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Assessment Notes
              </label>
              <div className="mt-2">
                <textarea
                  rows={3}
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Improved bat speed and contact quality..."
                />
              </div>
            </div>
          )}
        </form.Field>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl bg-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Create New Lesson
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill out the lesson details and complete relevant assessments based on
          the lesson type.
        </p>
      </div>

      <div
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        {/* Basic Lesson Information */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Lesson Information
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <form.Field name="playerId">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Player ID <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      required
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Enter player ID"
                    />
                  </div>
                </div>
              )}
            </form.Field>

            <form.Field name="lessonType">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Lesson Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <select
                      value={field.state.value}
                      onChange={(e) => {
                        const newValue = e.target.value as LessonType;
                        field.handleChange(newValue);
                        setSelectedLessonType(newValue);
                      }}
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="strength">Strength Training</option>
                      <option value="hitting">Hitting</option>
                      <option value="pitching">Pitching</option>
                      <option value="conditioning">Conditioning</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}
            </form.Field>

            <form.Field name="lessonDate">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Lesson Date <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              )}
            </form.Field>
          </div>

          <div className="mt-6">
            <form.Field name="notes">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Lesson Notes
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={3}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Overall lesson notes and observations..."
                    />
                  </div>
                </div>
              )}
            </form.Field>
          </div>
        </div>

        {/* Dynamic Assessment Forms */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Assessments</h2>

          {assessmentConfigs[selectedLessonType]?.includes(
            "strengthAssessment"
          ) && <StrengthAssessmentForm />}

          {assessmentConfigs[selectedLessonType]?.includes(
            "forcePlateAssessment"
          ) && <ForcePlateAssessmentForm />}

          {assessmentConfigs[selectedLessonType]?.includes(
            "hittingAssessment"
          ) && <HittingAssessmentForm />}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonCreationForm;
