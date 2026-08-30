import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Target, AlertTriangle, Users, ArrowRight, Sparkles } from 'lucide-react';

export const AdminSkillGaps: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminGaps = async () => {
      try {
        const res = await api.getAdminSkillGaps();
        setGaps(res.organizationGaps || []);
      } catch (e) {
        console.error('Admin gaps error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminGaps();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-blue-900 text-white shadow-lg">
        <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
          <Target className="w-4 h-4" />
          <span>Organization-Wide Capacity Diagnostic</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Workforce Skill Gap Analysis</h1>
        <p className="text-xs text-blue-200 mt-1 max-w-2xl">
          Aggregated competency deficit across all 12,450 officials in India's official statistical system. Directs institutional training resource allocation for NSSTA and iGOT Karmayogi.
        </p>
      </div>

      {/* Severity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gaps.map((gap, idx) => (
          <div key={idx} className="gov-card p-6 flex flex-col justify-between space-y-4 border-t-4 border-t-red-500">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  {gap.gapPercent}% National Deficit
                </span>
                <span className="text-xs text-slate-400 font-semibold">{gap.cadre}</span>
              </div>

              <h3 className="text-base font-bold text-gov-navy leading-snug">{gap.skill}</h3>

              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Impacted Personnel:</span>
                <span className="font-extrabold text-slate-800 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>{gap.affectedOfficials.toLocaleString()} Officials</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('admin-generator')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Generate Target Assessment</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
