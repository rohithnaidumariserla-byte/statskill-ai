import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const TrainingRoiChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="skill" angle={-20} textAnchor="end" height={60} tick={{ fill: '#475569', fontSize: 11 }} />
          <YAxis domain={[0, 100]} unit="%" tick={{ fill: '#64748b', fontSize: 11 }} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          <Legend wrapperStyle={{ top: 0 }} />
          <Bar dataKey="beforeScore" name="Pre-Training Competency" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="afterScore" name="Post-Training Competency" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
