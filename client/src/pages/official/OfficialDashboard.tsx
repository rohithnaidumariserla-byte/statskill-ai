import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { CourseRecommendation, GapAnalysisReport, Quiz } from '../../types';
import { getTimeBasedGreeting } from '../../utils/timeUtils';
import { PracticeQuizModal } from '../../components/modals/PracticeQuizModal';
import {
  Sparkles, Target, Compass, BookOpen, GraduationCap,
  Flame, Clock, CheckCircle2, ArrowRight, AlertTriangle, Play,
  CheckSquare, Award, Shield, AlertCircle, ExternalLink, ChevronDown, ChevronUp,
  Trophy, Star, Zap, Check
} from 'lucide-react';

export const OfficialDashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [gapReport, setGapReport] = useState<GapAnalysisReport | null>(null);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [activeQuizzes, setActiveQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState<string>(getTimeBasedGreeting());
  const [expandedRecIdx, setExpandedRecIdx] = useState<number | null>(null);
  const [practiceSkill, setPracticeSkill] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [gapsRes, recsRes, quizRes] = await Promise.all([
        api.getSkillGaps(user.id),
        api.getRecommendations(user.id),
        api.getQuizzes({ role: 'official' })
      ]);
      setGapReport(gapsRes);
      setRecommendations(recsRes.recommendations || []);
      setActiveQuizzes(quizRes.quizzes || []);
    } catch (e) {
      console.error('Error loading dashboard', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleMarkCourseCompleted = async (courseId: string, courseTitle: string, skillName: string) => {
    if (!user) return;
    try {
      setCompletingId(courseId);
      const res = await api.completeCourse(user.id, courseId);
      if (res.success) {
        setCompletionNotice(`Course "${courseTitle}" marked completed! Ready for mini practice assessment.`);
        await loadData();
        setTimeout(() => setCompletionNotice(null), 5000);
        // Automatically offer practice quiz
        setPracticeSkill(skillName);
      }
    } catch (e) {
      console.error('Failed to complete course', e);
    } finally {
      setCompletingId(null);
    }
  };

  const overallScore = gapReport?.overallCompetency || 72;

  const getProficiencyLabel = (score: number) => {
    if (score >= 90) return { label: 'Advanced', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    if (score >= 75) return { label: 'Proficient', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (score >= 60) return { label: 'Intermediate', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 40) return { label: 'Developing', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { label: 'Beginner', color: 'bg-red-100 text-red-800 border-red-200' };
  };

  const prof = getProficiencyLabel(overallScore);
  const topGaps = gapReport?.gaps.filter(g => g.severity === 'High' || g.severity === 'Medium') || [];
  const primaryGap = topGaps[0] || {
    skillName: 'Python',
    currentScore: 42,
    requiredScore: 75,
    gap: 33
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto animate-in fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gov-navy to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Statistical Workforce Intelligence Active</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">{greeting}, {user?.name || 'Official'}</h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Continuous competency benchmarking and adaptive learning pathways for <strong>{user?.designation}</strong> cadre standards.
          </p>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 text-white font-black text-6xl pointer-events-none select-none tracking-wider">
          <span>AI + STATS</span>
        </div>
      </div>

      {completionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{completionNotice}</span>
          </div>
          <button
            onClick={() => setCompletionNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. YOUR WORKFORCE SKILL PROFILE STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Competency Card */}
        <div className="gov-card p-4 border-l-4 border-l-gov-navy flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overall Competency</span>
            <span className="text-2xl font-black text-gov-navy mt-0.5 block">{overallScore}%</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">{prof.label} Level</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Skill Gaps Card */}
        <div
          onClick={() => onNavigate('skill-gaps')}
          className="gov-card p-4 border-l-4 border-l-amber-500 flex items-center justify-between cursor-pointer hover:border-amber-400 transition"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skill Gaps Detected</span>
            <span className="text-2xl font-black text-amber-600 mt-0.5 block">{topGaps.length || 3} Deficits</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Click to analyze →</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Assessments Card */}
        <div
          onClick={() => onNavigate('quizzes')}
          className="gov-card p-4 border-l-4 border-l-blue-600 flex items-center justify-between cursor-pointer hover:border-blue-400 transition"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Assessments</span>
            <span className="text-2xl font-black text-blue-700 mt-0.5 block">{activeQuizzes.length || 2} Pending</span>
            <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Cadre Evaluations</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Recommended Learning Card */}
        <div
          onClick={() => onNavigate('learning-path')}
          className="gov-card p-4 border-l-4 border-l-purple-600 flex items-center justify-between cursor-pointer hover:border-purple-400 transition"
        >
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Learning</span>
            <span className="text-2xl font-black text-purple-700 mt-0.5 block">{recommendations.length || 4} Courses</span>
            <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">iGOT & Kaggle Modules</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
            <Compass className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. CRITICAL SKILL GAP SPOTLIGHT BANNER */}
      <div className="gov-card p-6 bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-white border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="badge-saffron text-[10px]">HIGH PRIORITY CADRE GAP</span>
            <span className="text-[11px] font-bold text-red-600">-{primaryGap.gap}% Deficit</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">
            {primaryGap.skillName} • Current: <strong>{primaryGap.currentScore}%</strong> / Required: <strong>{primaryGap.requiredScore}%</strong>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Skill Gap = Required ({primaryGap.requiredScore}%) - Current ({primaryGap.currentScore}%) = <strong>{primaryGap.gap}% Deficit</strong>. Completing this training fulfills the requisite benchmark for <strong>{user?.designation}</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setPracticeSkill(primaryGap.skillName)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Practice Quiz (5 Qs)</span>
          </button>
          <button
            onClick={() => onNavigate('learning-path')}
            className="px-4 py-2.5 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Learning Path</span>
          </button>
        </div>
      </div>

      {/* 3. MY SKILL READINESS BREAKDOWN */}
      <div className="gov-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              My Skill Readiness & Competency Benchmarks
            </h3>
            <p className="text-[11px] text-slate-500">
              Formula: Skill Gap = Required Competency - Current Competency
            </p>
          </div>
          <button onClick={() => onNavigate('skill-gaps')} className="text-xs text-blue-600 hover:text-blue-800 font-bold">
            Full Gap Matrix →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gapReport?.gaps.slice(0, 6).map((g, idx) => {
            const hasGap = g.gap > 0;
            const priorityBadge = g.gap >= 25 ? 'bg-red-100 text-red-800 border-red-200' :
                                  g.gap >= 10 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                  'bg-emerald-100 text-emerald-800 border-emerald-200';
            const priorityText = g.gap >= 25 ? 'HIGH PRIORITY' : g.gap >= 10 ? 'MEDIUM PRIORITY' : 'LOW PRIORITY / MASTERED';

            return (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{g.skillName}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{g.category}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${priorityBadge}`}>
                    {priorityText}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-700">Current: {g.currentScore}%</span>
                    <span className="text-slate-500">Required: {g.requiredScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all ${
                        g.currentScore >= g.requiredScore ? 'bg-emerald-500' : g.currentScore >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, g.currentScore)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500 pt-0.5">
                    <span>{hasGap ? `-${g.gap}% Deficit` : '🏆 Benchmark Achieved'}</span>
                    <button
                      onClick={() => setPracticeSkill(g.skillName)}
                      className="text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <Zap className="w-3 h-3 text-amber-500 inline" />
                      <span>Take Practice Quiz</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TARGETED LEARNING RECOMMENDATIONS WITH EXPLAINABLE AI ACCORDION */}
      <div className="gov-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              Explainable AI Learning Recommendations
            </h3>
            <p className="text-[11px] text-slate-500">Learn on reputable external platforms → Return → Mark Complete → Take Practice Assessment</p>
          </div>
          <button onClick={() => onNavigate('learning-path')} className="text-xs text-blue-600 hover:text-blue-800 font-bold">
            View Full Pathway →
          </button>
        </div>

        <div className="space-y-3.5">
          {recommendations.slice(0, 3).map((rec, idx) => {
            const isExpanded = expandedRecIdx === idx;
            const hasValidUrl = !!rec.course.externalUrl && rec.course.externalUrl.startsWith('http');
            const isCompleted = rec.progress === 100 || rec.isEnrolled && rec.progress === 100;

            return (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 transition">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {rec.course.skill}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        rec.priorityLevel === 'HIGH PRIORITY' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rec.priorityLevel || 'HIGH PRIORITY'}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">• {rec.course.duration}</span>
                      <span className="text-[10px] font-semibold text-slate-400">• {rec.course.provider}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{rec.course.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{rec.course.description}</p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 self-start">
                    {/* START COURSE BUTTON */}
                    {hasValidUrl ? (
                      <a
                        href={rec.course.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Play className="w-3 h-3 text-amber-400" />
                        <span>Start Course</span>
                        <ExternalLink className="w-3 h-3 text-blue-200" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="px-3.5 py-2 bg-slate-200 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed"
                      >
                        Course link unavailable
                      </button>
                    )}

                    {/* MARK COMPLETED BUTTON */}
                    <button
                      onClick={() => handleMarkCourseCompleted(rec.course.id, rec.course.title, rec.course.skill)}
                      disabled={completingId === rec.course.id || isCompleted}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Check className="w-3 h-3 text-white" />
                      <span>{isCompleted ? 'Completed ✓' : completingId === rec.course.id ? 'Updating...' : 'Mark as Completed'}</span>
                    </button>

                    {/* PRACTICE QUIZ BUTTON */}
                    <button
                      onClick={() => setPracticeSkill(rec.course.skill)}
                      className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition flex items-center space-x-1 cursor-pointer"
                      title="Take 5-Question Practice Assessment"
                    >
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Practice Quiz</span>
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE EXPLAINABLE AI ACCORDION */}
                <div className="pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setExpandedRecIdx(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-900 transition py-1"
                  >
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      <span>🎯 Why this recommendation?</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 p-3.5 bg-blue-50/90 rounded-xl border border-blue-100 text-xs text-blue-950 space-y-2 animate-in fade-in">
                      <p className="font-semibold leading-relaxed">
                        {rec.whyReason || `Your ${rec.course.skill} competency is ${rec.gap || 33} percentage points below the required benchmark for your role.`}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-600">
                        <div>• Cadre Benchmark: <strong>{rec.requiredScore || 75}%</strong></div>
                        <div>• Your Verified Score: <strong>{rec.currentScore || 42}%</strong></div>
                        <div>• Calculated Gap: <strong>{rec.gap || 33}% Deficit</strong></div>
                        <div>• Skill Gap Relevance: <strong>{rec.breakdown.skillGapWeight}% / 35%</strong></div>
                        <div>• Role Specificity: <strong>{rec.breakdown.roleRelevanceWeight}% / 25%</strong></div>
                        <div>• AI Confidence Match: <strong>{rec.matchScore}%</strong></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. PROFESSIONAL GOVERNMENT CADRE ACHIEVEMENTS STRIP */}
      <div className="gov-card p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-gov-navy font-bold text-xs">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="uppercase tracking-wider">Professional Capacity Building Badges</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">MoSPI Cadre Standards</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-center space-y-1">
            <Trophy className="w-6 h-6 text-amber-600 mx-auto" />
            <div className="text-[11px] font-bold text-amber-900">Benchmark Achieved</div>
            <div className="text-[10px] text-slate-500">Sampling & Survey Design</div>
          </div>
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-center space-y-1">
            <BookOpen className="w-6 h-6 text-blue-600 mx-auto" />
            <div className="text-[11px] font-bold text-blue-900">Course Completed</div>
            <div className="text-[10px] text-slate-500">Modern Data Viz PowerBI</div>
          </div>
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center space-y-1">
            <Target className="w-6 h-6 text-emerald-600 mx-auto" />
            <div className="text-[11px] font-bold text-emerald-900">Skill Gap Reduced</div>
            <div className="text-[10px] text-slate-500">+15% Python Growth</div>
          </div>
          <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl text-center space-y-1">
            <Flame className="w-6 h-6 text-orange-600 mx-auto" />
            <div className="text-[11px] font-bold text-orange-900">Learning Streak</div>
            <div className="text-[10px] text-slate-500">4 Active Weeks</div>
          </div>
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-center space-y-1">
            <Star className="w-6 h-6 text-purple-600 mx-auto" />
            <div className="text-[11px] font-bold text-purple-900">Assessment Master</div>
            <div className="text-[10px] text-slate-500">3 Certifications</div>
          </div>
        </div>
      </div>

      {/* 6. PRACTICE QUIZ MODAL */}
      {practiceSkill && user && (
        <PracticeQuizModal
          skillName={practiceSkill}
          userId={user.id}
          onClose={() => setPracticeSkill(null)}
          onCompleted={async () => {
            await loadData();
          }}
        />
      )}
    </div>
  );
};
