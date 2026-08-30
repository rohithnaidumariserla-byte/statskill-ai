import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const FutureSkillsChart: React.FC = () => {
  const data = [
    { year: '2024', ai: 25, cloud: 20, dataEng: 30, gis: 35, cyber: 40 },
    { year: '2025', ai: 38, cloud: 32, dataEng: 42, gis: 45, cyber: 50 },
    { year: '2026 (Now)', ai: 55, cloud: 48, dataEng: 58, gis: 56, cyber: 65 },
    { year: '2027 (Est)', ai: 78, cloud: 68, dataEng: 74, gis: 72, cyber: 82 },
    { year: '2028 (Est)', ai: 88, cloud: 80, dataEng: 85, gis: 80, cyber: 90 },
    { year: '2030 (Est)', ai: 96, cloud: 90, dataEng: 93, gis: 88, cyber: 95 },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorGis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 12 }} />
          <YAxis domain={[0, 100]} unit="%" tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          <Legend />
          <Area type="monotone" dataKey="ai" name="AI / ML in Statistics" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAi)" strokeWidth={2} />
          <Area type="monotone" dataKey="cloud" name="Cloud Data Pipelines" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCloud)" strokeWidth={2} />
          <Area type="monotone" dataKey="gis" name="Spatial Analytics (GIS)" stroke="#10b981" fillOpacity={1} fill="url(#colorGis)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
