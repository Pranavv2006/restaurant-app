import React from "react";

interface ProgressProps {
  title: string;
  value: number; 
  color?: string; 
}

const Progress: React.FC<ProgressProps> = ({ title, value, color = "blue-600" }) => {
  const safeValue = Math.min(100, Math.max(0, value)); 

  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{title}</h3>
        <span className="text-sm text-gray-800 dark:text-white">{safeValue}%</span>
      </div>

      <div
        className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`flex flex-col justify-center rounded-full overflow-hidden bg-${color} text-xs text-white text-center whitespace-nowrap transition-all duration-500 dark:bg-${color.replace(
            "600",
            "500"
          )}`}
          style={{ width: `${safeValue}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Progress;