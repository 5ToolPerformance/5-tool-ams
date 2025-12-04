// components/players/armcare/ArmCareSummaryView.tsx

"use client";

import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import {
  Activity,
  BarChart3,
  Calendar,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// components/players/armcare/ArmCareSummaryView.tsx

// components/players/armcare/ArmCareSummaryView.tsx

interface ArmCareSummaryData {
  latestExam: any;
  history: {
    armScore: Array<{
      date: string;
      value: number | null;
      examType: string | null;
      examId: string;
    }>;
    totalStrength: Array<{
      date: string;
      value: number | null;
      examType: string | null;
      examId: string;
    }>;
    totalStrengthPost: Array<{
      date: string;
      value: number | null;
      examType: string | null;
      examId: string;
    }>;
  };
  stats: {
    totalExams: number;
    avgArmScore: number | null;
    avgTotalStrength: number | null;
    avgShoulderBalance: number | null;
    firstExamDate: string | null;
    lastExamDate: string | null;
  };
}

interface Props {
  playerId: string;
  data: ArmCareSummaryData;
}

export function ArmCareSummaryView({ playerId, data }: Props) {
  const { latestExam, history, stats } = data;

  // Format data for charts
  const armScoreChartData = history.armScore
    .filter((d) => d.value !== null)
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: d.value,
      type: d.examType,
    }));

  const strengthChartData = history.totalStrength
    .map((d, index) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      pre: d.value,
      post: history.totalStrengthPost[index]?.value || null,
      type: d.examType,
    }))
    .filter((d) => d.pre !== null || d.post !== null);

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">ArmCare Summary</h1>
          <p className="text-default-500">
            Comprehensive arm health metrics and trends
          </p>
        </div>
        <Chip size="sm" color="primary" variant="flat">
          {playerId}
        </Chip>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card>
          <CardBody>
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <p className="text-sm text-default-500">Total Exams</p>
            </div>
            <p className="text-2xl font-bold">{stats.totalExams}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-success" />
              <p className="text-sm text-default-500">Latest Score</p>
            </div>
            <p className="text-2xl font-bold">{latestExam.armScore || "—"}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-warning" />
              <p className="text-sm text-default-500">Avg Score</p>
            </div>
            <p className="text-2xl font-bold">
              {stats.avgArmScore ? stats.avgArmScore.toFixed(1) : "—"}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="mb-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-secondary" />
              <p className="text-sm text-default-500">Avg Strength</p>
            </div>
            <p className="text-2xl font-bold">
              {stats.avgTotalStrength
                ? `${stats.avgTotalStrength.toFixed(1)} lbs`
                : "—"}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-default-400" />
              <p className="text-sm text-default-500">Last Exam</p>
            </div>
            <p className="text-lg font-semibold">
              {new Date(stats.lastExamDate!).toLocaleDateString()}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Latest Exam Details */}
      <Card>
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Exam</h2>
            <div className="flex items-center gap-2">
              <Chip size="sm" color="primary" variant="flat">
                {latestExam.examType}
              </Chip>
              <span className="text-sm text-default-500">
                {new Date(latestExam.examDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
            <MetricCard label="Arm Score" value={latestExam.armScore} />
            <MetricCard
              label="Total Strength"
              value={latestExam.totalStrength}
              unit="lbs"
            />
            <MetricCard
              label="Shoulder Balance"
              value={latestExam.shoulderBalance}
            />
            <MetricCard label="Velo" value={latestExam.velo} />
            <MetricCard label="SVR" value={latestExam.svr} />
            <MetricCard
              label="Post Strength"
              value={latestExam.totalStrengthPost}
              unit="lbs"
            />
            <MetricCard
              label="Strength Loss"
              value={latestExam.postStrengthLoss}
              unit="lbs"
            />
            <MetricCard
              label="% Fresh"
              value={latestExam.totalPercentFresh}
              unit="%"
            />
          </div>
        </CardBody>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Arm Score Trend */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Arm Score Trend</h3>
          </CardHeader>
          <CardBody>
            {armScoreChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={armScoreChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#71717a"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#71717a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "black",
                      border: "1px solid #e4e4e7",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#0070f0"
                    strokeWidth={2}
                    dot={{ fill: "#0070f0", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-default-400">
                No arm score data available
              </div>
            )}
          </CardBody>
        </Card>

        {/* Strength Comparison */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Strength Comparison</h3>
          </CardHeader>
          <CardBody>
            {strengthChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={strengthChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#71717a"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#71717a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "black",
                      border: "1px solid #e4e4e7",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="pre" fill="#0070f0" name="Pre-Activity" />
                  <Bar dataKey="post" fill="#f5a524" name="Post-Activity" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-default-400">
                No strength data available
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | null;
  unit?: string;
}) {
  return (
    <div className="rounded-lg bg-default-50 p-3">
      <p className="mb-1 text-xs text-default-500">{label}</p>
      <p className="text-lg font-semibold">
        {value ? `${value}${unit ? ` ${unit}` : ""}` : "—"}
      </p>
    </div>
  );
}
