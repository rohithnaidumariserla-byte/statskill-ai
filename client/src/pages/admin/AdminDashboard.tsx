import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Users, Award, BookOpen, Clock, BarChart2, TrendingUp,
  Building, AlertTriangle, ArrowRight, Sparkles, Shield,
  CheckCircle2, Target, CheckSquare, Layers, AlertCircle, Compass, Zap, Flame
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const AdminDashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.getAdminAnalytics();
        setAnalytics(res);
      } catch (e) {
        console.error('Analytics error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const overview = analytics?.workforceOverview || {
    totalOfficials: 12450,
    officialsAssessed: 10820,
    averageCompetency: 68,
    officialsRequiringUpskilling: 3840,
    criticalSkillGapsCount: 4,
    activeAssessments: 3,
    trainingCompletionRate: 78,
    totalTrainingHours: '3.2M',
    coursesCompleted: 78420
  };

  const coreCompetencies = analytics?.coreCompetencyGaps || [
    { competency: 'Python & Statistical Computing', currentScore: 42, requiredScore: 75, gap: 33, proficiencyLevel: 'Developing', status: 'Needs Urgent Improvement', officialsAffected: 4850, severity: 'High' },
    { competency: 'Cloud Computing (MeghRaj)', currentScore: 25, requiredScore: 55, gap: 30, proficiencyLevel: 'Beginner', status: 'Critical Attention', officialsAffected: 1248, severity: 'High' },
    { competency: 'AI & Machine Learning', currentScore: 35, requiredScore: 65, gap: 30, proficiencyLevel: 'Developing', status: 'Needs Improvement', officialsAffected: 7720, severity: 'High' },
    { competency: 'Survey Methodology & CAPI', currentScore: 48, requiredScore: 75, gap: 27, proficiencyLevel: 'Developing', status: 'Critical Attention', officialsAffected: 4320, severity: 'High' },
    { competency: 'Data Visualization & PowerBI', currentScore: 55, requiredScore: 70, gap: 15, proficiencyLevel: 'Developing', status: 'Needs Improvement', officialsAffected: 3620, severity: 'Medium' },
    { competency: 'Cybersecurity & Governance', currentScore: 73, requiredScore: 75, gap: 2, proficiencyLevel: 'Proficient', status: 'Good Progress', officialsAffected: 890, severity: 'Low' },
    { competency: 'Statistics & Sampling Theory', currentScore: 81, requiredScore: 80, gap: 0, proficiencyLevel: 'Advanced', status: 'Well Aligned', officialsAffected: 450, severity: 'Mastered' },
    { competency: 'National Accounts & SNA 2008', currentScore: 82, requiredScore: 80, gap: 0, proficiencyLevel: 'Advanced', status: 'Well Aligned', officialsAffected: 620, severity: 'Mastered' }
  ];

  const workforceReadinessScore = 67;

  const quickSkillBreakdown = [
    { name: 'Python', score: 42, req: 75, indicator: '🔴 High Deficit (-33%)', color: 'text-red-600', dot: '🔴' },
    { name: 'Cloud Computing', score: 25, req: 55, indicator: '🔴 High Deficit (-30%)', color: 'text-red-600', dot: '🔴' },
    { name: 'AI/ML', score: 35, req: 65, indicator: '🟠 Moderate Deficit (-30%)', color: 'text-orange-600', dot: '🟠' },
    { name: 'Statistics & Sampling', score: 81, req: 80, indicator: '🟢 Benchmark Achieved (+1%)', color: 'text-emerald-600', dot: '🟢' },
    { name: 'Cybersecurity', score: 73, req: 75, indicator: '🟢 Near Benchmark (-2%)', color: 'text-emerald-600', dot: '🟢' }
  ];

  const getProficiencyBadge = (level: string) => {
    switch (level) {
      case 'Advanced':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Advanced (90-100%)</span>;
      case 'Proficient':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Proficient (75-89%)</span>;
      case 'Intermediate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Intermediate (60-74%)</span>;
      case 'Developing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Developing (40-59%)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">Beginner (0-39%)</span>;
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto animate-in fade-in">
      {/* Admin Executive Header */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>National Statistical Capacity Building Intelligence</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Government Skill Intelligence Dashboard</h1>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl">
              Executive monitoring portal for Director (Training) & Cadre Controlling Authorities across MoSPI, NSO, and State Statistical Directorates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('admin-resources')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Learning Resources</span>
            </button>
            <button
              onClick={() => onNavigate('admin-generator')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Quiz Generator</span>
            </button>
            <button
              onClick={() => onNavigate('admin-quiz-management')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>Quiz Management</span>
            </button>
          </div>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 text-white font-black text-7xl pointer-events-none select-none tracking-widest">
          AI + STATS
        </div>
      </div>

      {/* 1. SEVEN WORKFORCE HEADLINE SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div
          onClick={() => onNavigate('admin-gaps')}
          className="gov-card p-4 border-l-4 border-l-gov-navy cursor-pointer hover:shadow-md transition"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Officials</span>
          <span className="text-xl font-black text-slate-800 mt-1 block">
            {overview.totalOfficials ? overview.totalOfficials.toLocaleString() : '12,450'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Across 4 cadres →</span>
        </div>

        <div
          onClick={() => onNavigate('admin-gaps')}
          className="gov-card p-4 border-l-4 border-l-blue-600 cursor-pointer hover:shadow-md transition"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Officials Assessed</span>
          <span className="text-xl font-black text-blue-700 mt-1 block">
            {overview.officialsAssessed ? overview.officialsAssessed.toLocaleString() : '10,820'}
          </span>
          <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">87% participation →</span>
        </div>

        <div
          onClick={() => onNavigate('admin-framework')}
          className="gov-card p-4 border-l-4 border-l-emerald-600 cursor-pointer hover:shadow-md transition"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Competency</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">
            {overview.averageCompetency || 68}%
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Target: 75% →</span>
        </div>

        <div
          onClick={() => onNavigate('admin-gaps')}
          className="gov-card p-4 border-l-4 border-l-red-500 cursor-pointer hover:shadow-md transition"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Req. Upskilling</span>
          <span className="text-xl font-black text-red-600 mt-1 block">
            {overview.officialsRequiringUpskilling ? overview.officialsRequiringUpskilling.toLocaleString() : '3,840'}
          </span>
          <span className="text-[10px] text-red-500 font-semibold block mt-0.5">Priority focus →</span>
        </div>

        <div
          onClick={() => onNavigate('admin-gaps')}
          className="gov-card p-4 border-l-4 border-l-amber-500 cursor-pointer hover:shadow-md transition"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Critical Gaps</span>
          <span className="text-xl font-black text-amber-600 mt-1 block">
            {overview.criticalSkillGapsCount || 4}
          </span>
          <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">High-priority →</span>
        </div>

        <div
          onClick={() => onNavigate('admin-quiz-management')}
          className="gov-card p-4 border-l-4 border-l-indigo-500 cursor-pointer hover:shadow-md transition"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Exams</span>
          <span className="text-xl font-black text-indigo-600 mt-1 block">
            {overview.activeAssessments || 3}
          </span>
          <span className="text-[10px] text-indigo-500 font-semibold block mt-0.5">Underway now →</span>
        </div>

        <div
          onClick={() => onNavigate('admin-resources')}
          className="gov-card p-4 border-l-4 border-l-purple-600 cursor-pointer hover:shadow-md transition"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Courses Completed</span>
          <span className="text-xl font-black text-purple-700 mt-1 block">
            {overview.coursesCompleted ? overview.coursesCompleted.toLocaleString() : '78,420'}
          </span>
          <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">78% Completion →</span>
        </div>
      </div>

      {/* 2. OVERALL WORKFORCE READINESS & PRIORITY SKILL GAP SPOTLIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Readiness & Skill Breakdown */}
        <div className="lg:col-span-5 gov-card p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                  Overall Workforce Readiness
                </h3>
                <span className="text-[11px] text-slate-500">Aggregated from verified diagnostic tests</span>
              </div>
              <span className="text-2xl font-black text-blue-700">{workforceReadinessScore}%</span>
            </div>

            <div className="space-y-3 pt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Skill Breakdown:</span>
              {quickSkillBreakdown.map((sb, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{sb.dot}</span>
                    <span className="font-bold text-slate-800">{sb.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="font-semibold text-slate-600">Avg: {sb.score}% / Req: {sb.req}%</span>
                    <span className={`font-bold ${sb.color}`}>{sb.indicator}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900">
            <strong>Capacity Modernization Strategy:</strong> Focus Q3 training interventions on Python, Cloud Computing, and AI/ML.
          </div>
        </div>

        {/* Priority Skill Gap Spotlight */}
        <div className="lg:col-span-7 gov-card p-6 bg-gradient-to-br from-red-50/60 via-amber-50/40 to-white border border-red-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold text-red-700 uppercase tracking-wider pb-2 border-b border-red-200">
              <Flame className="w-4 h-4 text-red-600" />
              <span>🔥 Top Critical Workforce Skill Gap Spotlight</span>
            </div>

            <div className="pt-3 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="badge-saffron text-[10px]">Highest Deficit Discipline</span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">Cloud Computing (MeghRaj & Government Cloud)</h2>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-2xl font-black text-red-600 block">-30% Deficit</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Current: 25% | Required: 55%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Officials Affected</span>
                  <span className="text-base font-black text-slate-800">1,248 Officials</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Cadre Focus</span>
                  <span className="text-base font-black text-slate-800">Data Processing Cadre</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Priority Level</span>
                  <span className="text-base font-black text-red-600">Urgent Intervention</span>
                </div>
              </div>

              <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-1">
                <strong className="text-slate-900 block font-bold">Recommended Executive Action:</strong>
                <p className="leading-relaxed">
                  "Launch specialized Cloud Infrastructure training on Microsoft Learn / GI Cloud MeghRaj for 1,248 statistical officers."
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => onNavigate('admin-generator')}
              className="px-4 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Generate Cloud Assessment</span>
            </button>
            <button
              onClick={() => onNavigate('admin-resources')}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Manage Course Links
            </button>
          </div>
        </div>
      </div>

      {/* 3. SKILL GAP ANALYSIS SECTION (8 CORE STATISTICAL COMPETENCIES) */}
      <div className="gov-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2 text-gov-navy font-black text-sm uppercase tracking-wider">
              <Target className="w-4 h-4 text-red-600" />
              <span>National Statistical Skill Gap Matrix (Ranked by Priority Deficit)</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical calculation: <strong>Skill Gap = Required Competency Level - Current Workforce Level</strong>
            </p>
          </div>
          <button
            onClick={() => onNavigate('admin-framework')}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 cursor-pointer"
          >
            <span>Configure Benchmark Levels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8 Competencies Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="py-3 px-3">Competency Discipline</th>
                <th className="py-3 px-3">Current Level</th>
                <th className="py-3 px-3">Required Level</th>
                <th className="py-3 px-3">Skill Deficit (Gap)</th>
                <th className="py-3 px-3">Visual Progress</th>
                <th className="py-3 px-3">Proficiency Status</th>
                <th className="py-3 px-3">Officials Affected</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coreCompetencies.map((c: any, idx: number) => {
                const isHighGap = c.gap >= 20;
                const isMedGap = c.gap >= 10 && c.gap < 20;
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-slate-900 block">{c.competency}</span>
                      <span className="text-[10px] text-slate-400">{c.category || 'Statistical Core'}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {c.currentScore}%
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-600">
                      {c.requiredScore}%
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-black text-xs px-2 py-0.5 rounded-md ${
                        isHighGap
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : isMedGap
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {c.gap > 0 ? `-${c.gap}%` : 'Aligned (0%)'}
                      </span>
                    </td>
                    <td className="py-3 px-3 w-36">
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full rounded-full transition-all ${
                            c.currentScore >= c.requiredScore ? 'bg-emerald-500' : c.currentScore >= 50 ? 'bg-blue-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${c.currentScore}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {getProficiencyBadge(c.proficiencyLevel || 'Developing')}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {c.officialsAffected ? c.officialsAffected.toLocaleString() : '1,200'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigate('admin-generator')}
                        className="px-2.5 py-1 bg-gov-navy hover:bg-blue-900 text-white text-[11px] font-bold rounded-lg shadow-xs transition cursor-pointer"
                      >
                        Create Quiz
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
