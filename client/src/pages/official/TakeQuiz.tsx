import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Quiz, QuizAttempt, QuizSubmissionReason } from '../../types';
import {
  CheckSquare, Clock, ArrowRight, ArrowLeft, Award,
  Sparkles, CheckCircle2, XCircle, RotateCcw, AlertTriangle, ExternalLink, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TakeQuiz: React.FC<{ quizId: string; onBack: () => void; onNavigate: (tab: string) => void }> = ({
  quizId,
  onBack,
  onNavigate
}) => {
  const { user, refreshUser } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins default
  const [loading, setLoading] = useState(true);

  const isSubmittingRef = useRef(false);
  const isFinalizedRef = useRef(false);
  const userAnswersRef = useRef(userAnswers);
  const attemptRef = useRef(attempt);
  const quizRef = useRef(quiz);
  const timeLeftRef = useRef(timeLeft);

  // Keep refs in sync
  useEffect(() => {
    userAnswersRef.current = userAnswers;
  }, [userAnswers]);

  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);

  useEffect(() => {
    quizRef.current = quiz;
  }, [quiz]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Format Helper for Time Taken
  const formatTimeTaken = (seconds: number) => {
    const safeSec = Math.max(0, seconds || 0);
    const m = Math.floor(safeSec / 60);
    const s = safeSec % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  const getSubmissionReasonText = (reason?: string) => {
    switch (reason) {
      case 'TIMER_EXPIRED':
        return 'Time limit reached. Assessment was automatically submitted.';
      case 'NAVIGATION_AWAY':
        return 'You navigated away from the active assessment before manual submission.';
      case 'BROWSER_BACK':
        return 'Browser Back button was clicked during the active assessment.';
      case 'PAGE_REFRESH':
        return 'Page was refreshed/reloaded during the active assessment.';
      case 'TAB_EXIT':
        return 'You switched away from the active assessment tab.';
      case 'BROWSER_CLOSE':
        return 'Browser window or tab was closed during the assessment.';
      case 'SESSION_INTERRUPTED':
        return 'Session was interrupted and automatically secured.';
      default:
        return 'Assessment was automatically finalized upon leaving.';
    }
  };

  // Central Idempotent Submission Handler
  const handleFinalSubmission = useCallback(async (
    reason: QuizSubmissionReason = 'MANUAL_SUBMISSION',
    callback?: () => void
  ) => {
    if (isSubmittingRef.current || isFinalizedRef.current) {
      if (callback) callback();
      return;
    }
    isSubmittingRef.current = true;

    const answersToSubmit = { ...userAnswersRef.current };
    const curAttempt = attemptRef.current;
    const curQuiz = quizRef.current;
    const isAuto = reason !== 'MANUAL_SUBMISSION';
    const submissionType: 'Manual' | 'Auto-submitted' = isAuto ? 'Auto-submitted' : 'Manual';
    const totalDuration = (curQuiz?.timeLimitMinutes || 15) * 60;
    const timeSpent = Math.max(1, totalDuration - timeLeftRef.current);

    try {
      const res = await api.submitQuiz(
        quizId,
        user?.id || 'u-1',
        answersToSubmit,
        submissionType,
        reason,
        curAttempt?.id,
        timeSpent
      );

      isFinalizedRef.current = true;
      setResults(res);
      setSubmitted(true);

      // Clean local storage cache
      try {
        localStorage.removeItem(`statskill_quiz_answers_${quizId}_${user?.id || 'u-1'}`);
      } catch (e) {}

      if (refreshUser) {
        await refreshUser().catch(() => {});
      }

      if (reason === 'MANUAL_SUBMISSION') {
        try {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }

      if (callback) {
        callback();
      }
    } catch (e) {
      console.error('Final submission error:', e);
      if (callback) callback();
    } finally {
      isSubmittingRef.current = false;
      setLoading(false);
    }
  }, [quizId, user?.id, refreshUser]);

  // Initial Load: Fetch Quiz and Start/Recover Attempt
  useEffect(() => {
    let isMounted = true;

    const initializeQuiz = async () => {
      if (!user) return;
      try {
        const [quizRes, attemptRes] = await Promise.all([
          api.getQuizById(quizId),
          api.startQuizAttempt(quizId, user.id)
        ]);

        if (!isMounted) return;

        if (quizRes.quiz) {
          setQuiz(quizRes.quiz);
          setTimeLeft((quizRes.quiz.timeLimitMinutes || 15) * 60);
        }

        if (attemptRes.attempt) {
          const att = attemptRes.attempt;
          setAttempt(att);

          // If attempt is already submitted, show results directly
          if (att.status === 'SUBMITTED' || att.status === 'AUTO_SUBMITTED') {
            isFinalizedRef.current = true;
            setResults(att);
            setSubmitted(true);
            return;
          }

          // Restore previously saved answers
          let restoredAnswers = att.answers || {};
          try {
            const cached = localStorage.getItem(`statskill_quiz_answers_${quizId}_${user.id}`);
            if (cached) {
              restoredAnswers = { ...restoredAnswers, ...JSON.parse(cached) };
            }
          } catch (e) {}

          setUserAnswers(restoredAnswers);
        }
      } catch (e) {
        console.error('Fetch quiz error', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeQuiz();
    return () => {
      isMounted = false;
    };
  }, [quizId, user?.id]);

  // Trigger 1: Timer Countdown
  useEffect(() => {
    if (submitted || loading) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmission('TIMER_EXPIRED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, loading, handleFinalSubmission]);

  // Trigger 2: Browser Back Button (popstate)
  useEffect(() => {
    if (submitted || loading) return;

    window.history.pushState({ quizActive: true }, '', window.location.href);

    const handlePopState = () => {
      if (!isFinalizedRef.current) {
        handleFinalSubmission('BROWSER_BACK');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [submitted, loading, handleFinalSubmission]);

  // Trigger 3: Tab Switching / Visibility Hidden
  useEffect(() => {
    if (submitted || loading) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isFinalizedRef.current) {
        handleFinalSubmission('TAB_EXIT');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [submitted, loading, handleFinalSubmission]);

  // Trigger 4: Page Refresh / Unload (beforeunload & pagehide with sendBeacon)
  useEffect(() => {
    if (submitted || loading) return;

    const handleBeforeUnload = () => {
      if (!isFinalizedRef.current) {
        try {
          localStorage.setItem(
            `statskill_quiz_answers_${quizId}_${user?.id || 'u-1'}`,
            JSON.stringify(userAnswersRef.current)
          );
        } catch (e) {}

        const payload = JSON.stringify({
          quizId,
          userId: user?.id || 'u-1',
          userAnswers: userAnswersRef.current,
          submissionType: 'Auto-submitted',
          submissionReason: 'PAGE_REFRESH',
          attemptId: attemptRef.current?.id,
          timeSpentSeconds: Math.max(1, (quizRef.current?.timeLimitMinutes || 15) * 60 - timeLeftRef.current)
        });

        if (navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/quiz/attempt/submit', blob);
        } else {
          fetch('/api/quiz/attempt/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true
          }).catch(() => {});
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, [submitted, loading, quizId, user?.id]);

  // Trigger 5: Internal App Navigation Event
  useEffect(() => {
    if (submitted || loading) return;

    const handleInternalNavigate = (e: any) => {
      const targetTab = e.detail?.newTab;
      if (!isFinalizedRef.current) {
        handleFinalSubmission('NAVIGATION_AWAY', () => {
          if (targetTab) onNavigate(targetTab);
        });
      }
    };

    window.addEventListener('statskill:navigate-away', handleInternalNavigate);
    return () => {
      window.removeEventListener('statskill:navigate-away', handleInternalNavigate);
    };
  }, [submitted, loading, handleFinalSubmission, onNavigate]);

  // Real-time Answer Selector & Instant Persistence
  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (submitted || isFinalizedRef.current) return;

    setUserAnswers(prev => {
      const updated = { ...prev, [qId]: optIdx };
      try {
        localStorage.setItem(`statskill_quiz_answers_${quizId}_${user?.id || 'u-1'}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Save to backend immediately
    if (attemptRef.current?.id) {
      api.recordQuizAnswer(attemptRef.current.id, qId, optIdx).catch(() => {});
    }
  };

  // Exit Quiz button click handler
  const handleExitQuiz = () => {
    if (!submitted && !isFinalizedRef.current) {
      handleFinalSubmission('NAVIGATION_AWAY', onBack);
    } else {
      onBack();
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-600 font-semibold">Initializing Secure Examination Protocol...</p>
      </div>
    );
  }

  // Final Results Screen
  if (submitted && results) {
    const totalQuestions = results.totalQuestions || quiz?.questions.length || 10;
    const correctCount = results.correctCount || 0;
    const incorrectCount = results.incorrectCount || 0;
    const answeredCount = correctCount + incorrectCount;
    const unansweredCount = results.unansweredCount ?? Math.max(0, totalQuestions - answeredCount);
    const isAutoSubmitted = results.submissionType === 'Auto-submitted' || results.status === 'AUTO_SUBMITTED';

    return (
      <div className="space-y-6 text-left max-w-4xl mx-auto animate-in fade-in">
        {/* Auto-submission Toast Banner */}
        {isAutoSubmitted && (
          <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-xl text-amber-900 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Assessment Auto-Submitted</p>
                <p className="text-slate-600">{getSubmissionReasonText(results.submissionReason)}</p>
              </div>
            </div>
            <span className="badge-yellow text-[10px] font-bold shrink-0">Auto-Finalized</span>
          </div>
        )}

        {/* Results Banner */}
        <div className="bg-gradient-to-r from-gov-navy to-blue-900 rounded-2xl p-8 text-white shadow-xl text-center relative overflow-hidden">
          <Award className="w-12 h-12 text-amber-400 mx-auto mb-2" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Official Assessment Evaluation</span>
          <h1 className="text-4xl font-black mt-1">{results.score}%</h1>
          <p className="text-sm font-bold text-blue-100 mt-1">
            {correctCount} / {totalQuestions} Correct
          </p>

          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mt-5 text-left">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">Answered</span>
              <span className="text-base font-black text-white">{answeredCount} / {totalQuestions}</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">Unanswered</span>
              <span className="text-base font-black text-white">{unansweredCount}</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">Submission</span>
              <span className={`text-xs font-black inline-block mt-0.5 px-2 py-0.5 rounded ${isAutoSubmitted ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'}`}>
                {results.submissionType || (isAutoSubmitted ? 'Auto-submitted' : 'Manual')}
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">Time Taken</span>
              <span className="text-base font-black text-white">
                {formatTimeTaken(results.timeSpentSeconds || ((quiz?.timeLimitMinutes || 15) * 60 - timeLeft))}
              </span>
            </div>
          </div>

          {/* Submission Reason Details */}
          {isAutoSubmitted && (
            <div className="mt-4 p-3 bg-amber-400/20 border border-amber-400/30 rounded-xl max-w-xl mx-auto text-xs text-amber-200 flex items-center justify-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                <strong>Reason:</strong> {getSubmissionReasonText(results.submissionReason)}
              </span>
            </div>
          )}

          <div className="mt-4 inline-block px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-xs font-semibold">
            Competency index updated to <strong>{results.updatedSkill?.competencyScore || results.score}%</strong> in official cadre record.
          </div>
        </div>

        {/* AI Competency Feedback */}
        <div className="gov-card p-6 border-l-4 border-l-orange-500 space-y-2">
          <div className="flex items-center space-x-2 text-orange-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>AI Competency Feedback & Diagnostic</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{results.aiFeedback}</p>
        </div>

        {/* Question Review */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-gov-navy uppercase tracking-wider">Question by Question Review</h3>
            <span className="text-xs font-semibold text-slate-500">{correctCount} Correct • {incorrectCount} Incorrect • {unansweredCount} Unanswered</span>
          </div>

          {results.questionResults?.map((qr: any, idx: number) => {
            const isUnanswered = qr.userAnswer === null || qr.userAnswer === undefined;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  qr.isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : isUnanswered
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-red-50/40 border-red-200'
                } space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">Question {idx + 1}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      qr.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : isUnanswered
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {qr.isCorrect ? 'Correct' : isUnanswered ? 'Unanswered (0 pts)' : 'Incorrect'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800">{qr.question}</p>

                <p className="text-[11px] text-slate-600">
                  <strong>Explanation:</strong> {qr.explanation}
                </p>

                {/* Source Attribution */}
                <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10.5px] text-slate-500">
                  <span>Source: <strong>{qr.source || qr.sourceRef || 'MoSPI Guidelines'}</strong></span>
                  {qr.sourceUrl && (
                    <a
                      href={qr.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-0.5"
                    >
                      <span>[View Source]</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5 inline" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-xl shadow hover:bg-blue-900 transition flex items-center space-x-2"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quiz?.questions[currentIndex];

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Top Exam Header with Timer */}
      <div className="gov-card p-4 flex items-center justify-between">
        <div>
          <button
            onClick={handleExitQuiz}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center space-x-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Quizzes</span>
          </button>
          <h2 className="text-base font-extrabold text-gov-navy">{quiz?.title}</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Real-time Save Indicator */}
          <div className="hidden sm:flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Answers Saved</span>
          </div>

          {/* Timer Display */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl font-mono text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <button
            onClick={() => handleFinalSubmission('MANUAL_SUBMISSION')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main Question Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 gov-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500">Question {currentIndex + 1} of {quiz?.questions.length}</span>
            <div className="flex items-center space-x-2">
              <span className="badge-blue text-[10px]">{currentQ?.skill} • {currentQ?.difficulty}</span>
              {currentQ?.type && (
                <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  {currentQ.type}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm font-bold text-slate-900 leading-relaxed">
            {currentQ?.question}
          </p>

          <div className="space-y-2.5 pt-2">
            {currentQ?.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = userAnswers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(currentQ.id, idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {letter}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Source Attribution */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-700">Source:</span>
              <span>{currentQ?.source || currentQ?.sourceRef || 'MoSPI Guidelines'}</span>
              {currentQ?.sourceUrl && (
                <a
                  href={currentQ.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-0.5 ml-1.5"
                >
                  <span>[View Source]</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                </a>
              )}
            </div>
            {currentQ?.concepts && currentQ.concepts.length > 0 && (
              <span className="text-slate-400 text-[10px]">Concept: <strong>{currentQ.concepts[0]}</strong></span>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl disabled:opacity-40 transition"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentIndex(prev => Math.min((quiz?.questions.length || 1) - 1, prev + 1))}
              disabled={currentIndex === (quiz?.questions.length || 1) - 1}
              className="px-4 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition flex items-center space-x-1"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="lg:col-span-4 gov-card p-4 space-y-3">
          <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">Question Palette</h4>
          <div className="grid grid-cols-4 gap-2">
            {quiz?.questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
              const isCurrent = currentIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`py-2 rounded-lg text-xs font-bold border transition ${
                    isCurrent
                      ? 'border-blue-600 bg-blue-600 text-white shadow'
                      : isAnswered
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></span>
              <span>Attempted ({Object.values(userAnswers).filter(v => v !== null && v !== undefined).length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></span>
              <span>Unattempted ({Math.max(0, (quiz?.questions.length || 0) - Object.values(userAnswers).filter(v => v !== null && v !== undefined).length)})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
