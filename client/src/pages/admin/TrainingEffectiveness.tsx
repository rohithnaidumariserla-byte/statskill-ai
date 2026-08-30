import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { TrainingRoiChart } from '../../components/charts/TrainingRoiChart';
import { BarChart3, TrendingUp, Award, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const TrainingEffectiveness: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAdminAnalytics();
        setData(res.trainingEffectiveness || []);
      } catch (e) {
        console.error('ROI fetch error', e);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-emerald-950 text-white shadow-xl">
        <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Institutional Capacity Building ROI</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Training Effectiveness & Competency Uplift</h1>
        <p className="text-xs text-blue-200 mt-1 max-w-2xl">
          Quantitative pre- vs. post-training evaluation measuring real-world skill uplift across iGOT micro-courses and NSSTA residential programmes.
        </p>
      </div>

      {/* ROI Chart */}
      <div className="gov-card p-6">
        <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              Pre- vs Post-Training Competency Benchmark
            </h3>
            <p className="text-[11px] text-slate-500">Average +29% to +33% measurable competency gain upon course completion</p>
          </div>
          <span className="badge-green text-[10px]">Verified Uplift</span>
        </div>

        <TrainingRoiChart data={data} />
      </div>

      {/* Detail Table */}
      <div className="gov-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">Course-Level ROI Metrics</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Training Domain / Course</th>
                <th className="py-3 px-4">Participants</th>
                <th className="py-3 px-4">Pre-Score</th>
                <th className="py-3 px-4">Post-Score</th>
                <th className="py-3 px-4">Net Uplift</th>
                <th className="py-3 px-4">Completion Rate</th>
                <th className="py-3 px-4">Drop-Off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-bold text-slate-800">{row.skill}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">{row.totalParticipants.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-500">{row.beforeScore}%</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{row.afterScore}%</td>
                  <td className="py-3 px-4">
                    <span className="badge-green text-[10px] font-black">{row.improvement}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-blue-700">{row.completionRate}%</td>
                  <td className="py-3 px-4 text-slate-400 font-medium">{row.dropOffRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
