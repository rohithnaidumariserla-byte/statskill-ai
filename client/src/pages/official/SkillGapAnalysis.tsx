import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { GapAnalysisReport } from '../../types';
import { RadarCompetencyChart } from '../../components/charts/RadarCompetencyChart';
import { SkillGapBarChart } from '../../components/charts/SkillGapBarChart';
import { PracticeQuizModal } from '../../components/modals/PracticeQuizModal';
import {
  Target, Sparkles, AlertTriangle, CheckCircle2, ArrowRight,
  Compass, BookOpen, Layers, ShieldCheck, Award, Trophy, TrendingUp, Zap
} from 'lucide-react';

export const SkillGapAnalysis: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [report, setReport] = useState<GapAnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [practiceSkill, setPracticeSkill] = useState<string | null>(null);

  const fetchGaps = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.getSkillGaps(user.id);
      setReport(res);
    } catch (e) {
      console.error('Error fetching gaps', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps();
  }, [user]);

  const radarData = report?.gaps.map(g => ({
    subject: g.skillName,
    current: g.currentScore,
    required: g.requiredScore,
    fullMark: 100
  })) || [];

  const barData = report?.gaps.map(g => ({
    name: g.skillName,
    current: g.currentScore,
    required: g.requiredScore,
    gap: g.gap
  })) || [];

  const getProficiencyBadge = (score: number) => {
    if (score >= 90) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Advanced (90-100%)</span>;
    if (score >= 75) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Proficient (75-89%)</span>;
    if (score >= 60) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Intermediate (60-74%)</span>;
    if (score >= 40) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Developing (40-59%)</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">Beginner (0-39%)</span>;
  };

  // Simulated initial scores for historical tracking
  const getInitialScore = (skillName: string, currentScore: number) => {
    const s = skillName.toLowerCase();
    if (s.includes('python')) return 30;
    if (s.includes('cloud')) return 18;
    if (s.includes('ai')) return 25;
    if (s.includes('sampling')) return 68;
    if (s.includes('survey')) return 72;
    if (s.includes('visualization')) return 40;
    return Math.max(15, currentScore - 15);
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto animate-in fade-in">
      {/* Header Banner */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-blue-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="w-4 h-4 text-red-400" />
            <span>National Cadre Benchmarking Engine</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">AI Skill Gap Diagnostics & Analytics</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl">
            Empirical calculation: <strong>Skill Gap = Required Competency - Current Competency</strong> for <strong>{report?.roleTitle || user?.designation}</strong>.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onNavigate('learning-path')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>View Personalized Learning Path</span>
          </button>
        </div>
      </div>

      {/* AI Diagnostic Explanation Box */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 text-xs text-blue-950 leading-relaxed shadow-xs">
        <div className="flex items-center space-x-1.5 font-bold text-gov-navy mb-1">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>AI Diagnostic Assessment & Growth Rationale</span>
        </div>
        <p>{report?.aiExplanation || `Based on your profile as ${user?.designation}, your largest competency deficits are in Digital & Python tools. Closing these gaps will empower CAPI automation and modern data registry management.`}</p>
      </div>

      {/* Visual Charts: Radar + Gap Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 gov-card p-6">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-2">Competency Radar Overlay</h3>
          <p className="text-[11px] text-slate-500 mb-4">Blue area denotes your verified proficiency; red outline is target cadre benchmark.</p>
          <RadarCompetencyChart data={radarData} />
        </div>

        <div className="lg:col-span-6 gov-card p-6">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-2">Current vs Required Scores</h3>
          <p className="text-[11px] text-slate-500 mb-4">Empirical breakdown of competency deficit per discipline.</p>
          <SkillGapBarChart data={barData} />
        </div>
      </div>

      {/* Detailed Skill Gap Matrix Table */}
      <div className="gov-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">Skill Improvement & Gap Matrix</h3>
            <p className="text-[11px] text-slate-500">Track progress over time: Initial vs Current vs Required benchmark</p>
          </div>
          <span className="text-[11px] text-slate-500 font-bold">{report?.gaps.length || 8} Competencies Evaluated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Competency Name</th>
                <th className="py-3 px-3">Initial</th>
                <th className="py-3 px-3">Current Score</th>
                <th className="py-3 px-3">Required Benchmark</th>
                <th className="py-3 px-3">Improvement</th>
                <th className="py-3 px-3">Remaining Gap</th>
                <th className="py-3 px-3">Proficiency Level</th>
                <th className="py-3 px-3">Milestone Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report?.gaps.map((g, idx) => {
                const initial = getInitialScore(g.skillName, g.currentScore);
                const improvement = Math.max(0, g.currentScore - initial);
                const remainingGap = Math.max(0, g.requiredScore - g.currentScore);
                const isAchieved = g.currentScore >= g.requiredScore;

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{g.skillName}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{g.category || 'Statistical'}</div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-500">{initial}%</td>
                    <td className="py-3.5 px-3 font-extrabold text-blue-700">{g.currentScore}%</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{g.requiredScore}%</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-600">
                      +{improvement}%
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`font-black text-xs px-2 py-0.5 rounded ${
                        remainingGap >= 20 ? 'bg-red-100 text-red-700' :
                        remainingGap >= 10 ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {remainingGap > 0 ? `-${remainingGap}% Deficit` : '0% (Aligned)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {getProficiencyBadge(g.currentScore)}
                    </td>
                    <td className="py-3.5 px-3">
                      {isAchieved ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1 w-fit">
                          <Trophy className="w-3 h-3 text-amber-600" />
                          <span>Benchmark Achieved</span>
                        </span>
                      ) : remainingGap >= 25 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                          HIGH PRIORITY
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          MEDIUM PRIORITY
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setPracticeSkill(g.skillName)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-xs transition flex items-center space-x-1 cursor-pointer"
                          title="Take 5-Question Practice Assessment"
                        >
                          <Zap className="w-3 h-3 text-amber-300" />
                          <span>Practice</span>
                        </button>
                        {remainingGap > 0 && (
                          <button
                            onClick={() => onNavigate('learning-path')}
                            className="px-2.5 py-1 bg-gov-navy hover:bg-blue-900 text-white text-[11px] font-bold rounded-lg shadow-xs transition cursor-pointer"
                          >
                            Course
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practice Quiz Modal */}
      {practiceSkill && user && (
        <PracticeQuizModal
          skillName={practiceSkill}
          userId={user.id}
          onClose={() => setPracticeSkill(null)}
          onCompleted={async () => {
            await fetchGaps();
          }}
        />
      )}
    </div>
  );
};
