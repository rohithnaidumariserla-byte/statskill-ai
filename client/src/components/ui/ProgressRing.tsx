import React from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 160,
  strokeWidth = 14,
  label = 'Overall Competency',
  sublabel = 'Cadre Readiness Index',
  color = '#1d4ed8'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  let ringColor = color;
  if (progress >= 80) ringColor = '#10b981';
  else if (progress >= 60) ringColor = '#1d4ed8';
  else ringColor = '#ea580c';

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background Ring */}
          <circle
            className="text-slate-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress Ring */}
          <circle
            className="transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={ringColor}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{progress}%</span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Readiness</span>
        </div>
      </div>
      {label && <h4 className="mt-3 text-sm font-semibold text-slate-800 text-center">{label}</h4>}
      {sublabel && <p className="text-xs text-slate-500 text-center">{sublabel}</p>}
    </div>
  );
};
