import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GapBarDataPoint {
  name: string;
  current: number;
  required: number;
  gap: number;
}

export const SkillGapBarChart: React.FC<{ data: GapBarDataPoint[] }> = ({ data }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} tick={{ fill: '#475569', fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '12px', top: 0 }} />
          <Bar dataKey="current" name="Current Score" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="required" name="Cadre Benchmark" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
