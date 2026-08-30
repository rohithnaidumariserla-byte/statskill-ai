import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RadarDataPoint {
  subject: string;
  current: number;
  required: number;
  fullMark: number;
}

export const RadarCompetencyChart: React.FC<{ data: RadarDataPoint[] }> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
          <Radar name="Current Competency" dataKey="current" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.4} />
          <Radar name="Role Required Benchmark" dataKey="required" stroke="#ea580c" fill="#ea580c" fillOpacity={0.15} strokeDasharray="3 3" />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
