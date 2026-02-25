import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: ReactNode;
  color?: "blue" | "orange" | "green" | "red" | "purple" | "cyan" | "pink";
  animated?: boolean;
}

export const StatsCard = ({
  title,
  value,
  change,
  icon,
  color = "blue",
  animated = true,
}: StatsCardProps) => {
  const colorClasses = {
    blue: {
      bg: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200/50 dark:border-blue-800/50",
      icon: "bg-blue-500",
    },
    orange: {
      bg: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200/50 dark:border-orange-800/50",
      icon: "bg-orange-500",
    },
    green: {
      bg: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200/50 dark:border-green-800/50",
      icon: "bg-green-500",
    },
    red: {
      bg: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200/50 dark:border-red-800/50",
      icon: "bg-red-500",
    },
    purple: {
      bg: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200/50 dark:border-purple-800/50",
      icon: "bg-purple-500",
    },
    cyan: {
      bg: "from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-200/50 dark:border-cyan-800/50",
      icon: "bg-cyan-500",
    },
    pink: {
      bg: "from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
      text: "text-pink-600 dark:text-pink-400",
      border: "border-pink-200/50 dark:border-pink-800/50",
      icon: "bg-pink-500",
    },
  };

  const currentColor = colorClasses[color];

  return (
    <div
      className={`
      relative overflow-hidden bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl border ${
        currentColor.border
      } 
      p-4 sm:p-6 hover:shadow-2xl hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 group
      min-w-0 w-full
      ${animated ? "hover:-translate-y-0.5 sm:hover:-translate-y-1" : ""}
    `}
    >
      {/* Background Pattern */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${currentColor.bg} opacity-30`}
      />
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-linear-to-br from-white/10 to-transparent rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1 sm:mb-2 tracking-wide uppercase truncate">
              {title}
            </p>
            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0">
              <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {value}
              </p>
              {change && (
                <div className="flex items-center space-x-1">
                  {change.type === "increase" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-bold ${
                      change.type === "increase"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {Math.abs(change.value)}%
                  </span>
                </div>
              )}
            </div>
            {change && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                vs last month
              </p>
            )}
          </div>

          {icon && (
            <div
              className={`
              relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${currentColor.icon} 
              flex items-center justify-center text-white shadow-lg shrink-0
              group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
            `}
            >
              {icon}
              <div className="absolute inset-0 rounded-2xl bg-white/20 group-hover:bg-white/30 transition-colors" />
            </div>
          )}
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-linear-to-r from-transparent via-white/10 to-transparent group-hover:animate-pulse pointer-events-none" />
    </div>
  );
};
