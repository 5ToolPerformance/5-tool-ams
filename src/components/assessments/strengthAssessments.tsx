"use client";

import { useForm } from "@tanstack/react-form";

const StrengthAssessmentForms = () => {
  const form = useForm({
    id: "strength-assessment-form",
    defaultValues: {
      strengthAssessment: {
        maxSquat: "",
        maxBench: "",
        maxDeadlift: "",
        bodyWeight: "",
        notes: "",
      },
      forcePlateAssessment: {
        jumpHeight: "",
        groundReactionForce: "",
        contactTime: "",
        peakPower: "",
        rateOfForceDevelopment: "",
        notes: "",
      },
    },
  });

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

  return (
    <form.Provider {...form}>
      <div className="space-y-6">
        <StrengthAssessmentForm />
        <ForcePlateAssessmentForm />
      </div>
    </form.Provider>
  );
};
