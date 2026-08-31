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
  const [deadlinePassed, setDeadlinePassed] = useState(false);

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
      case 'ADMIN_CLOSED_QUIZ':
        return 'Assessment was closed by NSSTA administrator.';
      default:
        return 'Assessment was finalized upon submission.';
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

    // Use current snapshot of answers
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
      const finalResultData = res?.attempt || res;
      setResults(finalResultData);
      setSubmitted(true);

      // Save locally to persist on refresh
      try {
        localStorage.setItem(`statskill_last_result_${quizId}_${user?.id || 'u-1'}`, JSON.stringify(finalResultData));
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

        const currentQuiz = quizRes.quiz;
        if (currentQuiz) {
          setQuiz(currentQuiz);
          setTimeLeft(attemptRes.remainingSeconds || (currentQuiz.timeLimitMinutes || 15) * 60);

          // Check if deadline has passed
          if (currentQuiz.computedStatus === 'CLOSED' || (currentQuiz.endAt && new Date(currentQuiz.endAt).getTime() < Date.now())) {
            // If user has not submitted an attempt, block starting
            if (!attemptRes.attempt || (attemptRes.attempt.status !== 'SUBMITTED' && attemptRes.attempt.status !== 'AUTO_SUBMITTED')) {
              setDeadlinePassed(true);
            }
          }
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

          userAnswersRef.current = restoredAnswers;
          setUserAnswers(restoredAnswers);
        } else {
          // Check if cached result exists
          try {
            const lastResultRaw = localStorage.getItem(`statskill_last_result_${quizId}_${user.id}`);
            if (lastResultRaw) {
              const parsed = JSON.parse(lastResultRaw);
              if (parsed) {
                isFinalizedRef.current = true;
                setResults(parsed);
                setSubmitted(true);
                return;
              }
            }
          } catch (e) {}
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
    if (submitted || loading || deadlinePassed) return;
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
  }, [submitted, loading, deadlinePassed, handleFinalSubmission]);

  // Trigger 2: Browser Back Button (popstate)
  useEffect(() => {
    if (submitted || loading || deadlinePassed) return;

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
  }, [submitted, loading, deadlinePassed, handleFinalSubmission]);

  // Trigger 3: Tab Switching / Visibility Hidden
  useEffect(() => {
    if (submitted || loading || deadlinePassed) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isFinalizedRef.current) {
        handleFinalSubmission('TAB_EXIT');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [submitted, loading, deadlinePassed, handleFinalSubmission]);

  // Trigger 4: Page Refresh / Unload
  useEffect(() => {
    if (submitted || loading || deadlinePassed) return;

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
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, [submitted, loading, deadlinePassed, quizId, user?.id]);

  // Trigger 5: Internal App Navigation Event
  useEffect(() => {
    if (submitted || loading || deadlinePassed) return;

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
  }, [submitted, loading, deadlinePassed, handleFinalSubmission, onNavigate]);

  // Real-time Answer Selector & Instant Sync
  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (submitted || isFinalizedRef.current) return;

    const updated = { ...userAnswersRef.current, [qId]: optIdx };
    userAnswersRef.current = updated;
    setUserAnswers(updated);

    try {
      localStorage.setItem(`statskill_quiz_answers_${quizId}_${user?.id || 'u-1'}`, JSON.stringify(updated));
    } catch (e) {}

    // Save to backend immediately
    if (attemptRef.current?.id) {
      api.recordQuizAnswer(attemptRef.current.id, qId, optIdx).catch(() => {});
    }
  };

  // Exit Quiz button click handler
  const handleExitQuiz = () => {
    if (!submitted && !isFinalizedRef.current && !deadlinePassed) {
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

  // Deadline Passed Notice Screen
  if (deadlinePassed && !submitted) {
    return (
      <div className="gov-card p-8 max-w-xl mx-auto text-center space-y-4 my-8">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-black text-gov-navy">Quiz Deadline Has Passed</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The scheduled submission deadline for <strong>"{quiz?.title}"</strong> was {quiz?.endAt ? new Date(quiz.endAt).toLocaleString('en-IN') : 'recently'}. This assessment is now closed for new attempts.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-xl shadow hover:bg-blue-900 transition"
        >
          Return to Quizzes
        </button>
      </div>
    );
  }

  // =========================================================================
  // FINAL RESULTS & REVIEW SCREEN
  // =========================================================================
  if (submitted && results) {
    const attemptData = results.attempt || results;
    const questionsList = quiz?.questions || [];
    const totalQuestions = attemptData.totalQuestions || questionsList.length || 1;
    const correctCount = attemptData.correctCount ?? 0;
    const incorrectCount = attemptData.incorrectCount ?? Math.max(0, (attemptData.answeredCount ?? 0) - correctCount);
    const answeredCount = attemptData.answeredCount ?? (correctCount + incorrectCount);
    const unansweredCount = attemptData.unansweredCount ?? Math.max(0, totalQuestions - answeredCount);
    const score = attemptData.score ?? Math.round((correctCount / totalQuestions) * 100);
    const isAutoSubmitted = attemptData.submissionType === 'Auto-submitted' || attemptData.status === 'AUTO_SUBMITTED';

    // Normalize question review items
    const questionReviewItems = (attemptData.questionResults && attemptData.questionResults.length > 0)
      ? attemptData.questionResults
      : questionsList.map((q) => {
          const userAns = userAnswers[q.id];
          const isAnswered = userAns !== undefined && userAns !== null;
          const isCorrect = isAnswered && Number(userAns) === q.correctAnswer;
          return {
            questionId: q.id,
            question: q.question,
            options: q.options,
            userAnswer: isAnswered ? Number(userAns) : null,
            correctAnswer: q.correctAnswer,
            isCorrect,
            explanation: q.explanation || 'Official MoSPI standard rule.',
            sourceRef: q.sourceRef || 'MoSPI Guidelines',
            source: (q as any).source || 'NSSTA Curriculum',
            sourceUrl: (q as any).sourceUrl || 'https://mospi.gov.in'
          };
        });

    return (
      <div className="space-y-6 text-left max-w-4xl mx-auto animate-in fade-in">
        {/* Auto-submission Toast Banner */}
        {isAutoSubmitted && (
          <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-xl text-amber-900 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Assessment Auto-Submitted</p>
                <p className="text-slate-600">{getSubmissionReasonText(attemptData.submissionReason)}</p>
              </div>
            </div>
            <span className="badge-yellow text-[10px] font-bold shrink-0">Auto-Finalized</span>
          </div>
        )}

        {/* Results Banner */}
        <div className="bg-gradient-to-r from-gov-navy to-blue-900 rounded-2xl p-8 text-white shadow-xl text-center relative overflow-hidden">
          <Award className="w-12 h-12 text-amber-400 mx-auto mb-2" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Official Assessment Evaluation</span>
          <h1 className="text-4xl font-black mt-1">{score}%</h1>
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
                {attemptData.submissionType || (isAutoSubmitted ? 'Auto-submitted' : 'Manual')}
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-blue-200 uppercase font-bold block">Time Taken</span>
              <span className="text-base font-black text-white">
                {formatTimeTaken(attemptData.timeSpentSeconds || ((quiz?.timeLimitMinutes || 15) * 60 - timeLeft))}
              </span>
            </div>
          </div>

          <div className="mt-4 inline-block px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-xs font-semibold">
            Competency index verified and updated in official cadre database.
          </div>
        </div>

        {/* AI Competency Feedback */}
        <div className="gov-card p-6 border-l-4 border-l-orange-500 space-y-2">
          <div className="flex items-center space-x-2 text-orange-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>AI Competency Feedback & Diagnostic</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {attemptData.aiFeedback || `Assessment completed with score ${score}%. Detailed review items are listed below.`}
          </p>
        </div>

        {/* Question by Question Review */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-gov-navy uppercase tracking-wider">Question by Question Review</h3>
            <span className="text-xs font-semibold text-slate-500">
              {correctCount} Correct • {incorrectCount} Incorrect • {unansweredCount} Unanswered
            </span>
          </div>

          {questionReviewItems.map((qr: any, idx: number) => {
            const isUnanswered = qr.userAnswer === null || qr.userAnswer === undefined;
            const userLetter = !isUnanswered ? String.fromCharCode(65 + Number(qr.userAnswer)) : '—';
            const correctLetter = qr.correctAnswer !== undefined ? String.fromCharCode(65 + Number(qr.correctAnswer)) : 'A';
            const userOptionText = !isUnanswered && qr.options && qr.options[qr.userAnswer] ? `Option ${userLetter}: ${qr.options[qr.userAnswer]}` : 'Unanswered (0 pts)';
            const correctOptionText = qr.options && qr.options[qr.correctAnswer] ? `Option ${correctLetter}: ${qr.options[qr.correctAnswer]}` : `Option ${correctLetter}`;

            return (
              <div
                key={qr.questionId || idx}
                className={`p-5 rounded-2xl border transition ${
                  qr.isCorrect
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : isUnanswered
                    ? 'bg-slate-50 border-slate-300'
                    : 'bg-red-50/50 border-red-300'
                } space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800">Question {idx + 1} of {totalQuestions}</span>
                  <span
                    className={`text-[11px] font-black px-2.5 py-1 rounded-lg flex items-center space-x-1 ${
                      qr.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : isUnanswered
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {qr.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 inline mr-1" />
                        <span>Correct (+10 pts)</span>
                      </>
                    ) : isUnanswered ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-slate-600 inline mr-1" />
                        <span>Unanswered (0 pts)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-red-700 inline mr-1" />
                        <span>Incorrect (0 pts)</span>
                      </>
                    )}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-900 leading-relaxed">{qr.question}</p>

                {/* Answer Comparisons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className={`p-2.5 rounded-xl border font-medium ${
                    qr.isCorrect
                      ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                      : isUnanswered
                      ? 'bg-slate-100 border-slate-200 text-slate-600'
                      : 'bg-red-100/60 border-red-300 text-red-950'
                  }`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Your Submitted Answer:</span>
                    <span className="font-bold">{userOptionText}</span>
                  </div>

                  <div className="p-2.5 rounded-xl border bg-blue-50/80 border-blue-200 text-blue-950 font-medium">
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75 text-blue-800">Correct Official Answer:</span>
                    <span className="font-bold">{correctOptionText}</span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900">Official Methodological Rationale: </span>
                  <span>{qr.explanation}</span>
                </div>

                {/* Source Attribution */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Source: <strong>{qr.source || qr.sourceRef || 'MoSPI National Guidelines'}</strong></span>
                  {qr.sourceUrl && (
                    <a
                      href={qr.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center space-x-1"
                    >
                      <span>[View Source Document]</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-xl shadow hover:bg-blue-900 transition flex items-center space-x-2 cursor-pointer"
          >
            <span>Return to Official Dashboard</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ACTIVE QUESTION INTERFACE
  // =========================================================================
  const questionsList = quiz?.questions || [];
  const totalQuestions = questionsList.length;
  const currentQ = questionsList[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const attemptedCount = Object.values(userAnswers).filter(v => v !== null && v !== undefined).length;

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto animate-in fade-in">
      {/* Top Exam Header with Timer */}
      <div className="gov-card p-4 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={handleExitQuiz}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center space-x-1 mb-1 cursor-pointer"
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
            type="button"
            onClick={() => handleFinalSubmission('MANUAL_SUBMISSION')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main Question Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 gov-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-extrabold text-slate-700">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <div className="flex items-center space-x-2">
              <span className="badge-blue text-[10px]">{currentQ?.skill || 'General'} • {currentQ?.difficulty || 'Medium'}</span>
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
            {currentQ?.options?.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = userAnswers[currentQ.id] === idx;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectAnswer(currentQ.id, idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-[11px] ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {letter}
                  </span>
                  <span className="leading-relaxed pt-0.5">{opt}</span>
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
              type="button"
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl disabled:opacity-40 transition cursor-pointer"
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                type="button"
                onClick={() => handleFinalSubmission('MANUAL_SUBMISSION')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Finish & Submit Exam</span>
                <CheckCircle2 className="w-4 h-4 text-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                className="px-4 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="lg:col-span-4 gov-card p-4 space-y-3">
          <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">Question Palette</h4>
          <div className="grid grid-cols-4 gap-2">
            {questionsList.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
              const isCurrent = currentIndex === idx;
              return (
                <button
                  type="button"
                  key={q.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
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
              <span>Attempted ({attemptedCount} / {totalQuestions})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></span>
              <span>Unattempted ({Math.max(0, totalQuestions - attemptedCount)})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
