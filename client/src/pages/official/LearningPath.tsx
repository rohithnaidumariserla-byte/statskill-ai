import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { PracticeQuizModal } from '../../components/modals/PracticeQuizModal';
import {
  Compass, CheckCircle2, Lock, Play, Sparkles, BookOpen, Clock,
  ArrowRight, Target, AlertTriangle, ExternalLink, Shield, Check, Zap, Award
} from 'lucide-react';

export const LearningPath: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [learningPath, setLearningPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [practiceSkill, setPracticeSkill] = useState<string | null>(null);
  const [completingTitle, setCompletingTitle] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchPath = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.getLearningPath(user.id);
      setLearningPath(res.learningPath);
    } catch (e) {
      console.error('Path error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPath();
  }, [user]);

  const handleMarkComplete = async (courseTitle: string, skill: string) => {
    if (!user) return;
    try {
      setCompletingTitle(courseTitle);
      // Find course
      const coursesRes = await api.getAdminCourses();
      const match = coursesRes.courses?.find((c: any) =>
        c.title.toLowerCase().includes(courseTitle.toLowerCase()) ||
        courseTitle.toLowerCase().includes(c.title.toLowerCase())
      );
      const courseId = match ? match.id : 'c-1';
      await api.completeCourse(user.id, courseId);
      setNotice(`Course "${courseTitle}" marked complete! Launching 5-question mini practice assessment.`);
      await fetchPath();
      setTimeout(() => setNotice(null), 5000);
      setPracticeSkill(skill);
    } catch (e) {
      console.error('Failed to complete course', e);
    } finally {
      setCompletingTitle(null);
    }
  };

  // Modular learning roadmap steps for key competencies
  const getSubmodules = (skill: string) => {
    const s = skill.toLowerCase();
    if (s.includes('python')) {
      return ['1. Python Basics', '2. NumPy Arrays', '3. Pandas DataFrames', '4. Statistical Modeling', '5. Data Visualization', '6. Practice Assessment', '7. Reassessment'];
    }
    if (s.includes('cloud')) {
      return ['1. MeghRaj Architecture', '2. Microdata S3 Storage', '3. Zero-Trust Access', '4. Containerized APIs', '5. Disaster Recovery', '6. Practice Assessment', '7. Certification'];
    }
    if (s.includes('ai') || s.includes('machine learning')) {
      return ['1. ML Taxonomy in Stats', '2. Automated Classification (NLP)', '3. Anomaly Detection (ASI)', '4. Satellite Remote Sensing', '5. Ethical AI & Bias', '6. Practice Assessment', '7. Capstone'];
    }
    if (s.includes('gis')) {
      return ['1. QGIS Coordinate Systems', '2. Urban Frame Geo-Tagging', '3. Spatial Autocorrelation', '4. Thematic Mapping', '5. Practice Assessment'];
    }
    return ['1. Core Principles', '2. Official Methodologies', '3. Data Validation', '4. Practical Application', '5. Assessment'];
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto animate-in fade-in">
      {/* Header */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-blue-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>AI-Driven Curricular Intelligence</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Your Personalized Learning Pathway</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl">
            Sequential 4-phase modular roadmap prioritizing your highest skill gaps to fulfill <strong>{user?.designation}</strong> cadre benchmarks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold bg-white/10 text-amber-300 border border-white/20 px-3 py-1.5 rounded-xl">
            Flow: Learn → Complete → Practice → Reassess
          </span>
        </div>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {/* Rationale Callout Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 text-xs text-slate-800 space-y-1">
        <div className="flex items-center space-x-2 text-orange-800 font-bold">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span className="uppercase tracking-wider">How This Pathway Is Generated</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Courses are dynamically prioritized based on the mathematical formula: <strong>Skill Gap = Required Benchmark - Current Score</strong>. High-deficit skills are scheduled first so you can bridge critical gaps before taking cadre certification assessments.
        </p>
      </div>

      {/* 4-Phase Roadmap Steps */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-slate-200 before:z-0">
        {learningPath?.phases.map((phase: any, pIdx: number) => {
          const isPhaseDone = phase.status === 'completed';
          const isPhaseActive = phase.status === 'in_progress';
          const isPhaseLocked = phase.status === 'locked';

          return (
            <div key={pIdx} className="relative z-10 flex items-start space-x-4">
              {/* Step Circle Indicator */}
              <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-xs shrink-0 shadow-md border-2 ${
                isPhaseActive
                  ? 'bg-gov-navy text-amber-400 border-amber-400'
                  : isPhaseDone
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                <span className="text-[10px] uppercase font-bold text-slate-300">Phase</span>
                <span className="text-lg leading-tight font-black">{phase.phaseNumber}</span>
              </div>

              {/* Phase Card Content */}
              <div className={`flex-1 gov-card p-6 ${isPhaseLocked ? 'opacity-75 bg-slate-50' : 'bg-white'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-extrabold text-gov-navy">{phase.name}</h3>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isPhaseActive ? 'badge-saffron' : isPhaseDone ? 'badge-green' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isPhaseActive ? 'In Progress' : isPhaseDone ? 'Completed' : 'Locked'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{phase.theme}</p>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{phase.estimatedWeeks}</span>
                  </div>
                </div>

                {/* Courses in this phase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.courses.map((c: any, cIdx: number) => {
                    const submodules = getSubmodules(c.skill);
                    const isCompleted = c.progress === 100;
                    const hasValidUrl = !!c.externalUrl && c.externalUrl.startsWith('http');

                    return (
                      <div key={cIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500">{c.provider}</span>
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                              {c.difficulty}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{c.title}</h4>
                          <p className="text-[11px] text-slate-500">Skill: <strong>{c.skill}</strong> • {c.duration}</p>

                          {/* Modular Breakdown */}
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Curricular Roadmap Steps:</span>
                            <div className="flex flex-wrap gap-1">
                              {submodules.map((mod, mIdx) => (
                                <span key={mIdx} className="text-[9px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200">
                                  {mod}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* WHY RECOMMENDED RATIONALE */}
                          <div className="p-2.5 bg-blue-50/80 rounded-lg border border-blue-100 text-[11px] text-blue-900">
                            <strong className="block text-[10px] text-blue-950 font-bold uppercase tracking-wider mb-0.5">
                              Why Recommended:
                            </strong>
                            {c.whyReason || `Your verified competency in ${c.skill} has a detected deficit against ${user?.designation} cadre standards. Completing this training fulfills the requisite benchmark.`}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                            <span>{c.progress > 0 ? `${c.progress}% completed` : 'Not Started'}</span>
                            <button
                              onClick={() => setPracticeSkill(c.skill)}
                              className="text-blue-700 hover:text-blue-900 font-bold text-[10px] flex items-center space-x-1 cursor-pointer"
                            >
                              <Zap className="w-3 h-3 text-amber-500" />
                              <span>Practice Quiz</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            {isPhaseLocked ? (
                              <button
                                disabled
                                className="w-full py-1.5 text-xs font-bold rounded-lg bg-slate-200 text-slate-400 cursor-not-allowed flex items-center justify-center space-x-1"
                              >
                                <Lock className="w-3 h-3 text-slate-400" />
                                <span>Locked</span>
                              </button>
                            ) : (
                              <>
                                {hasValidUrl ? (
                                  <a
                                    href={c.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-gov-navy hover:bg-blue-900 text-white shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer text-center"
                                  >
                                    <Play className="w-3 h-3 text-amber-400" />
                                    <span>Start Course</span>
                                    <ExternalLink className="w-3 h-3 text-blue-200" />
                                  </a>
                                ) : (
                                  <button
                                    disabled
                                    className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-slate-200 text-slate-400 cursor-not-allowed"
                                  >
                                    Link unavailable
                                  </button>
                                )}

                                <button
                                  onClick={() => handleMarkComplete(c.title, c.skill)}
                                  disabled={completingTitle === c.title || isCompleted}
                                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center space-x-1 cursor-pointer ${
                                    isCompleted
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                  }`}
                                  title="Mark external course completed"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>{isCompleted ? 'Done ✓' : 'Complete'}</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Practice Quiz Modal */}
      {practiceSkill && user && (
        <PracticeQuizModal
          skillName={practiceSkill}
          userId={user.id}
          onClose={() => setPracticeSkill(null)}
          onCompleted={async () => {
            await fetchPath();
          }}
        />
      )}
    </div>
  );
};
