import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FutureSkillsChart } from '../../components/charts/FutureSkillsChart';
import {
  TrendingUp, Sparkles, AlertCircle, Compass, Award,
  Shield, BrainCircuit, Target, CheckCircle2, ArrowRight, Zap
} from 'lucide-react';

export const FutureSkillsPrediction: React.FC = () => {
  const [futureSkills, setFutureSkills] = useState<any[]>([]);

  useEffect(() => {
    const fetchFuture = async () => {
      try {
        const res = await api.getAdminAnalytics();
        setFutureSkills(res.futureSkills || []);
      } catch (e) {
        console.error('Future fetch error', e);
      }
    };
    fetchFuture();
  }, []);

  const futureProjections2027 = [
    {
      skill: 'AI-Assisted Statistical Analysis',
      expectedDemand: 'High',
      currentReadiness: 42,
      futureNeed: 80,
      predictedGap: 38,
      status: 'Critical Modernization Priority',
      recommendedAction: 'Large Language Model & Automated Synthesis Training for Official Registries'
    },
    {
      skill: 'Advanced Data Visualization & Storytelling',
      expectedDemand: 'High',
      currentReadiness: 55,
      futureNeed: 75,
      predictedGap: 20,
      status: 'High Demand',
      recommendedAction: 'Official Statistical Dashboards with PowerBI & WebGL Dissemination'
    },
    {
      skill: 'Machine Learning for Official Statistics',
      expectedDemand: 'High',
      currentReadiness: 34,
      futureNeed: 65,
      predictedGap: 31,
      status: 'Emerging Frontier',
      recommendedAction: 'Predictive Imputation & Microdata ML Pipelines'
    },
    {
      skill: 'Statistical Programming & Python Vectorization',
      expectedDemand: 'High',
      currentReadiness: 46,
      futureNeed: 78,
      predictedGap: 32,
      status: 'Immediate Priority',
      recommendedAction: 'Python for Statistical Modeling & Big Data Bootcamps'
    },
    {
      skill: 'Automated Data Quality & NQAF Auditing',
      expectedDemand: 'Medium',
      currentReadiness: 62,
      futureNeed: 85,
      predictedGap: 23,
      status: 'Standard Practice',
      recommendedAction: 'National Quality Assurance Framework (NQAF) Automated Rules'
    },
    {
      skill: 'AI-Assisted Survey Analysis & CAPI Optimization',
      expectedDemand: 'High',
      currentReadiness: 40,
      futureNeed: 82,
      predictedGap: 42,
      status: 'Transformative',
      recommendedAction: 'Real-time Field Error Detection & Paradata Intelligence'
    }
  ];

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto animate-in fade-in">
      {/* Hero Header */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy via-slate-900 to-purple-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>AI Predictive Horizon Scanning (2026 – 2030)</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Workforce Future Skills Prediction & Analytics</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl">
            Simulated econometric forecasting projecting emerging competencies, workforce readiness deficits, and targeted training investments.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold bg-white/10 text-purple-200 border border-white/20 px-3 py-1.5 rounded-xl">
            AI-Generated Projection Model (Estimates)
          </span>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start space-x-2.5">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Methodological Note:</strong> Predictions represent AI-assisted econometric projections based on UN statistical guidelines, MoSPI digitization roadmap, and emerging CAPI standards. Values are indicative planning estimates for NSSTA training design.
        </p>
      </div>

      {/* 1. FUTURE SKILLS 2027 MATRIX TABLE */}
      <div className="gov-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              Workforce-Level Future Skill Requirements (2027 Projections)
            </h3>
            <p className="text-[11px] text-slate-500">Current Workforce Readiness vs Projected Institutional Demand</p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Target Year: 2027</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Discipline / Skill</th>
                <th className="py-3 px-3">Expected Demand</th>
                <th className="py-3 px-3">Current Readiness</th>
                <th className="py-3 px-3">Future Need (2027)</th>
                <th className="py-3 px-3">Predicted Gap</th>
                <th className="py-3 px-3">Visual Deficit</th>
                <th className="py-3 px-4">Recommended Training Investment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {futureProjections2027.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.skill}
                    <span className="block text-[10px] text-purple-700 font-semibold">{item.status}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                      {item.expectedDemand} Demand
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-800">
                    {item.currentReadiness}%
                  </td>
                  <td className="py-3.5 px-3 font-bold text-blue-700">
                    {item.futureNeed}%
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-red-100 text-red-700">
                      -{item.predictedGap}% Deficit
                    </span>
                  </td>
                  <td className="py-3.5 px-3 w-36">
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                        <div className="bg-blue-600 h-2" style={{ width: `${item.currentReadiness}%` }} />
                        <div className="bg-red-400 h-2" style={{ width: `${item.predictedGap}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400">
                        <span>Current: {item.currentReadiness}%</span>
                        <span>Need: {item.futureNeed}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 text-[11px]">
                    <strong>{item.recommendedAction}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. PREDICTION CHART */}
      <div className="gov-card p-6">
        <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              Projected 5-Year Competency Growth Trajectory
            </h3>
            <p className="text-[11px] text-slate-500">Adoption velocity modeling across official statistical cadres</p>
          </div>
          <span className="badge-purple text-[10px]">AI Forecast Model</span>
        </div>

        <FutureSkillsChart />
      </div>

      {/* 3. STRATEGIC JUSTIFICATION CARDS */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
          Strategic Justification & Institutional Demand Drivers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {futureSkills.map((sk, idx) => (
            <div key={idx} className="gov-card p-5 space-y-3 border-l-4 border-l-purple-600 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{sk.skillName}</span>
                  <span className="badge-purple text-[10px]">{sk.growthRate} Growth</span>
                </div>
                <p className="text-[11px] font-semibold text-purple-700 mb-2">{sk.status} • {sk.category}</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 block mb-1">Why is this important for MoSPI?</strong>
                  {sk.reasoning}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>Priority: <strong className="text-purple-900">{sk.strategicPriority}</strong></span>
                <span>Predicted 2030 Index: <strong className="text-slate-900">{sk.predictedDemand2030}/100</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
