type Severity = "good" | "moderate" | "severe";

interface CircularScoreProps {
  value: number;
  maxValue: number;
  title: string;
  size?: number;
  strokeWidth?: number;
  severity?: Severity;
  decimals?: number;
  animate?: boolean;
}

export function CircularScore({
  value,
  maxValue,
  title,
  size = 120,
  strokeWidth = 8,
  severity,
  decimals = 0,
  animate = true,
}: CircularScoreProps) {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);

  // Calculate circle dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = () => {
    switch (severity) {
      case "good":
        return "#10b981"; // green-500
      case "moderate":
        return "#f59e0b"; // amber-500
      case "severe":
        return "#ef4444"; // red-500
      default:
        return "#3b82f6"; // blue-500 (default)
    }
  };

  return (
    <div className="inline-flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG for circular progress */}
        <svg
          width={size}
          height={size}
          className="-rotate-90 transform"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getStrokeColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={animate ? "transition-all duration-1000 ease-out" : ""}
            style={{
              strokeDashoffset,
              transition: animate ? "stroke-dashoffset 1s ease-out" : "none",
            }}
          />
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: "rotate(0deg)" }}
        >
          <span
            className="font-bold text-gray-900 dark:text-gray-100"
            style={{
              fontSize: `${size * 0.25}px`,
            }}
          >
            {value.toFixed(decimals)}
          </span>
          <span
            className="mt-1 text-gray-500 dark:text-gray-400"
            style={{
              fontSize: `${size * 0.1}px`,
            }}
          >
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}
