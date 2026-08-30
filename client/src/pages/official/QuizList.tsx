import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Quiz, QuizDynamicStatus } from '../../types';
import {
  CheckSquare, Sparkles, Clock, Calendar, ArrowRight, Award,
  Lock, CheckCircle2, AlertCircle, Eye, Shield, Users
} from 'lucide-react';

export const QuizList: React.FC<{ onStartQuiz: (quizId: string) => void; onNavigate: (tab: string) => void }> = ({
  onStartQuiz,
  onNavigate
}) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [userAttempts, setUserAttempts] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.getQuizzes({
          role: 'official',
          userId: user?.id || 'u-1',
          includeDeleted: false
        });
        const list = res.quizzes || [];
        setQuizzes(list);

        // Check active / completed attempts for each quiz
        if (user) {
          const attemptMap: Record<string, any> = {};
          for (const q of list) {
            try {
              const attRes = await api.getActiveQuizAttempt(user.id, q.id);
              if (attRes.attempt) {
                attemptMap[q.id] = attRes.attempt;
              }
            } catch (e) {}
          }
          setUserAttempts(attemptMap);
        }
      } catch (e) {
        console.error('Quiz fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [user?.id]);

  // Format Helper for Remaining Time / Relative Deadlines
  const getTimeRemaining = (endAt?: string) => {
    if (!endAt) return null;
    const now = Date.now();
    const target = new Date(endAt).getTime();
    const diffMs = target - now;

    if (diffMs <= 0) return 'Deadline passed';

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours} hr${hours > 1 ? 's' : ''} left`;
    }
    if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} ${mins} min left`;
    }
    return `${mins} min left`;
  };

  const formatScheduleDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' IST';
    } catch (e) {
      return isoString;
    }
  };

  const filteredQuizzes = quizzes.filter(q => {
    const isCompleted = userAttempts[q.id]?.status === 'SUBMITTED' || userAttempts[q.id]?.status === 'AUTO_SUBMITTED';

    if (activeTab === 'active') return q.computedStatus === 'ACTIVE' && !isCompleted;
    if (activeTab === 'upcoming') return q.computedStatus === 'UPCOMING';
    if (activeTab === 'completed') return isCompleted;
    if (activeTab === 'closed') return q.computedStatus === 'CLOSED';
    return true;
  });

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto animate-in fade-in">
      {/* Header Banner */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-blue-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Official Cadre Certifications</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Assessments & Quizzes</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Attempt official self-evaluations and scheduled examinations. Completing assessments automatically updates your verified competency scores in cadre records.
          </p>
        </div>

        <button
          onClick={() => onNavigate('assessment')}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition whitespace-nowrap flex items-center space-x-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Adaptive Diagnostic</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        {[
          { id: 'all', label: 'All Quizzes' },
          { id: 'active', label: 'Active Now' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' },
          { id: 'closed', label: 'Closed' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
              activeTab === tab.id
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuizzes.length === 0 ? (
          <div className="md:col-span-2 py-12 text-center text-slate-500 text-xs font-semibold gov-card">
            No examinations found under this category.
          </div>
        ) : (
          filteredQuizzes.map(quiz => {
            const status = quiz.computedStatus || 'ACTIVE';
            const isActive = status === 'ACTIVE';
            const isUpcoming = status === 'UPCOMING';
            const isClosed = status === 'CLOSED';
            const attempt = userAttempts[quiz.id];
            const isCompleted = attempt?.status === 'SUBMITTED' || attempt?.status === 'AUTO_SUBMITTED';
            const remaining = getTimeRemaining(quiz.endAt);

            return (
              <div key={quiz.id} className="gov-card p-6 flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="badge-blue text-[10px] font-bold">{quiz.targetSkill}</span>
                      <span className="text-[10px] text-slate-400">• {quiz.difficulty || 'Mixed'}</span>
                    </div>

                    {/* Status Badge */}
                    {isCompleted ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        <Award className="w-3 h-3 text-purple-600" />
                        <span>Completed ({attempt.score}%)</span>
                      </span>
                    ) : isActive ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        <span>ACTIVE</span>
                      </span>
                    ) : isUpcoming ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span>UPCOMING</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>CLOSED</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-gov-navy leading-snug">{quiz.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{quiz.description}</p>

                  {/* Schedule Details Card */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] space-y-1.5 text-left">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>Start Schedule:</span>
                      </span>
                      <strong className="text-slate-800">{formatScheduleDate(quiz.startAt)}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Deadline:</span>
                      </span>
                      <strong className="text-slate-800">{formatScheduleDate(quiz.endAt)}</strong>
                    </div>

                    {/* Dynamic Countdown for Active Quizzes */}
                    {isActive && remaining && !isCompleted && (
                      <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[10.5px]">
                        <span className="text-amber-700 font-bold">Time Remaining:</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-black font-mono">
                          {remaining}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-500 flex items-center space-x-3">
                    <span>{quiz.questions?.length || 0} Questions</span>
                    <span>•</span>
                    <span>{quiz.timeLimitMinutes} mins</span>
                    <span>•</span>
                    <span>Pass: {quiz.passingScorePercentage || 60}%</span>
                  </div>

                  {/* Action Button */}
                  {isCompleted ? (
                    <button
                      onClick={() => onStartQuiz(quiz.id)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Review Result</span>
                    </button>
                  ) : isActive ? (
                    <button
                      onClick={() => onStartQuiz(quiz.id)}
                      className="px-4 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5"
                    >
                      <span>Start Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  ) : isUpcoming ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed flex items-center space-x-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Not Available Yet</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed flex items-center space-x-1"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Assessment Closed</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
