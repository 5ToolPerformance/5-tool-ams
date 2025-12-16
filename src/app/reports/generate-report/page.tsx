"use client";

import { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@heroui/react";

import { FormattedReport } from "@/components/reports/FormattedReports";
import { PlayerSelector } from "@/components/ui/PlayerSelector";
import { useLessonReportByPlayerId } from "@/hooks";

const LESSON_COUNT_OPTIONS = [
  { value: "5", label: "Last 5 lessons" },
  { value: "10", label: "Last 10 lessons" },
  { value: "15", label: "Last 15 lessons" },
  { value: "20", label: "Last 20 lessons" },
  { value: "25", label: "Last 25 lessons" },
];

export default function PlayerSummaryReportPage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [lessonCount, setLessonCount] = useState<number>(10);
  const [shouldFetch, setShouldFetch] = useState(false);

  // Only fetch when user clicks generate
  const { reportData, isLoading, error } = useLessonReportByPlayerId(
    shouldFetch ? selectedPlayerId : "",
    lessonCount
  );

  const handleGenerateReport = () => {
    if (selectedPlayerId) {
      setShouldFetch(true);
    }
  };

  const handleReset = () => {
    setShouldFetch(false);
    setSelectedPlayerId("");
    setLessonCount(10);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Player Summary Report</h1>
        <p className="text-default-500">
          Generate a comprehensive report of recent lessons and assessments for
          any player
        </p>
      </div>

      {!shouldFetch ? (
        <Card className="max-w-2xl">
          <CardHeader>
            <h2 className="text-xl font-semibold">Report Configuration</h2>
          </CardHeader>
          <CardBody className="gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Player
              </label>
              <PlayerSelector
                selectedPlayerId={selectedPlayerId || null}
                onPlayerSelect={(id) => setSelectedPlayerId(id || "")}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Number of Lessons
              </label>
              <Select
                placeholder="Select lesson count"
                selectedKeys={[lessonCount.toString()]}
                onChange={(e) => setLessonCount(parseInt(e.target.value, 10))}
              >
                {LESSON_COUNT_OPTIONS.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>

            <Button
              color="primary"
              size="lg"
              isDisabled={!selectedPlayerId}
              onPress={handleGenerateReport}
              className="w-full"
            >
              Generate Report
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <Button variant="flat" onPress={handleReset}>
              ← Back to Configuration
            </Button>
            <Button
              color="primary"
              onPress={handlePrint}
              isDisabled={isLoading || !!error}
            >
              Print / Save as PDF
            </Button>
          </div>

          {isLoading && (
            <Card>
              <CardBody className="py-12 text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-default-500">Loading report data...</p>
              </CardBody>
            </Card>
          )}

          {error && (
            <Card className="border-2 border-danger">
              <CardBody>
                <p className="mb-2 font-semibold text-danger">
                  Error loading report
                </p>
                <p className="text-sm text-default-600">
                  {error.message || "Unknown error occurred"}
                </p>
              </CardBody>
            </Card>
          )}

          {!isLoading && !error && reportData && (
            <FormattedReport data={reportData} />
          )}
        </div>
      )}
    </div>
  );
}
