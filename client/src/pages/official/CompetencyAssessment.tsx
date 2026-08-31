import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api, normalizeAnswer } from '../../services/api';
import { AssessmentQuestion } from '../../types';
import {
  BrainCircuit, CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw,
  Sparkles, Award, Target, HelpCircle, ShieldCheck, Compass, AlertTriangle, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CompetencyAssessment: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [evaluatedMap, setEvaluatedMap] = useState<Record<string, { isCorrect: boolean; explanation: string }>>({});
  const [completed, setCompleted] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const answersRef = useRef(answers);
  const questionsRef = useRef(questions);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  const startNewAssessment = async () => {
    if (!user) return;
    setLoading(true);
    setCompleted(false);
    setReport(null);
    setAnswers({});
    answersRef.current = {};
    setEvaluatedMap({});
    setCurrentIndex(0);

    try {
      localStorage.removeItem(`statskill_last_assessment_report_${user.id}`);
      const res = await api.startAssessment(user.id, 'all', 5);
      const qList = res.questions || [];
      setQuestions(qList);
      questionsRef.current = qList;
    } catch (e) {
      console.error('Error starting assessment', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      // Check if previous completed report exists
      try {
        const cachedReportRaw = localStorage.getItem(`statskill_last_assessment_report_${user.id}`);
        if (cachedReportRaw) {
          const parsed = JSON.parse(cachedReportRaw);
          if (parsed && parsed.totalQuestions) {
            setReport(parsed);
            setCompleted(true);
            setLoading(false);
            return;
          }
        }
      } catch (e) {}

      await startNewAssessment();
    };

    init();
  }, [user?.id]);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentAnswer = currentQ ? answers[currentQ.id] : undefined;
  const currentEval = currentQ ? evaluatedMap[currentQ.id] : undefined;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleSelect = async (idx: number) => {
    if (!currentQ || currentEval) return;

    const updatedAnswers = { ...answersRef.current, [currentQ.id]: idx };
    answersRef.current = updatedAnswers;
    setAnswers(updatedAnswers);

    try {
      const evalRes = await api.evaluateQuestion(currentQ.id, idx);
      setEvaluatedMap(prev => ({
        ...prev,
        [currentQ.id]: {
          isCorrect: evalRes.isCorrect,
          explanation: evalRes.explanation
        }
      }));
    } catch (e) {
      console.error('Eval error', e);
    }
  };

  const handleFinalSubmit = async () => {
    if (submitting || !user) return;
    setSubmitting(true);
    setLoading(true);

    try {
      const finalAnswers = { ...answersRef.current };
      const currentQList = questionsRef.current;
      const submitRes = await api.submitAssessment(user.id, finalAnswers, currentQList);

      setReport(submitRes);
      setCompleted(true);

      if (refreshUser) {
        await refreshUser().catch(() => {});
      }

      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (e) {
      console.error('Submit error', e);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Synthesizing Adaptive Statistical Assessment...</h3>
        <p className="text-xs text-slate-500 mt-1">Calibrating item difficulty according to official cadre benchmark.</p>
      </div>
    );
  }

  // =========================================================================
  // ASSESSMENT COMPLETED & RESULTS REVIEW SCREEN
  // =========================================================================
  if (completed && report) {
    const totalQ = report.totalQuestions || 5;
    const correctQ = report.correctCount ?? 0;
    const answeredQ = report.answeredCount ?? (correctQ + (report.incorrectCount ?? 0));
    const incorrectQ = report.incorrectCount ?? Math.max(0, answeredQ - correctQ);
    const unansweredQ = report.unansweredCount ?? Math.max(0, totalQ - answeredQ);
    const scoreVal = report.score ?? Math.round((correctQ / totalQ) * 100);
    const reviewItems = report.questionResults || [];

    return (
      <div className="space-y-6 text-left max-w-4xl mx-auto animate-in fade-in">
        {/* Results Banner */}
        <div className="bg-gradient-to-r from-gov-navy to-blue-900 rounded-2xl p-8 text-white shadow-xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-3 border border-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Assessment Completed</span>
          <h1 className="text-3xl font-black mt-1">AI Competency Evaluation Report</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-lg mx-auto">
            Your statistical & technical scores have been scientifically computed and dynamically merged with your official personnel record.
          </p>

          <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-left">
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center min-w-[120px]">
              <span className="text-3xl font-black text-amber-400">{scoreVal}%</span>
              <p className="text-[10px] text-slate-300 font-semibold uppercase">Overall Score</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center min-w-[120px]">
              <span className="text-3xl font-black text-emerald-400">{correctQ}/{totalQ}</span>
              <p className="text-[10px] text-slate-300 font-semibold uppercase">Correct Answers</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center min-w-[120px]">
              <span className="text-3xl font-black text-blue-300">{answeredQ}/{totalQ}</span>
              <p className="text-[10px] text-slate-300 font-semibold uppercase">Answered</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center min-w-[120px]">
              <span className="text-3xl font-black text-red-300">{incorrectQ}</span>
              <p className="text-[10px] text-slate-300 font-semibold uppercase">Incorrect</p>
            </div>
          </div>
        </div>

        {/* AI Feedback Callout */}
        <div className="gov-card p-6 border-l-4 border-l-blue-600 space-y-2">
          <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>AI Evaluation Analysis</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{report.aiFeedback}</p>
        </div>

        {/* Question-by-Question Detailed Review */}
        {reviewItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">Question by Question Review</h3>
              <span className="text-xs font-semibold text-slate-500">
                {correctQ} Correct • {incorrectQ} Incorrect • {unansweredQ} Unanswered
              </span>
            </div>

            {reviewItems.map((qr: any, idx: number) => {
              const isUnanswered = qr.userAnswer === null || qr.userAnswer === undefined;
              const userLetter = !isUnanswered ? String.fromCharCode(65 + Number(qr.userAnswer)) : '—';
              const correctLetter = qr.correctAnswer !== undefined ? String.fromCharCode(65 + Number(qr.correctAnswer)) : 'A';
              const userOptionText = !isUnanswered && qr.options && qr.options[qr.userAnswer]
                ? `Option ${userLetter}: ${qr.options[qr.userAnswer]}`
                : 'Unanswered (0 pts)';
              const correctOptionText = qr.options && qr.options[qr.correctAnswer]
                ? `Option ${correctLetter}: ${qr.options[qr.correctAnswer]}`
                : `Option ${correctLetter}`;

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
                    <span className="font-extrabold text-xs text-slate-800">Question {idx + 1} of {totalQ}</span>
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

                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">Official Methodological Rationale: </span>
                    <span>{qr.explanation}</span>
                  </div>

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
        )}

        {/* Skill Breakdown */}
        {report.updatedSkills && report.updatedSkills.length > 0 && (
          <div className="gov-card p-6">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4">Competency Updates by Skill</h3>
            <div className="space-y-3">
              {report.updatedSkills.map((sk: any) => (
                <div key={sk.skillName} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{sk.skillName}</p>
                    <p className="text-[10px] text-slate-500">{sk.category} • Level: <strong>{sk.competencyLevel}</strong></p>
                  </div>
                  <div className="text-right">
                    <span className={`text-base font-extrabold ${sk.competencyScore >= 80 ? 'text-emerald-600' : sk.competencyScore >= 60 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {sk.competencyScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <button
            type="button"
            onClick={startNewAssessment}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center space-x-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake / New Diagnostic</span>
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => onNavigate('skill-gaps')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>View Updated Skill Gaps</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('learning-path')}
              className="px-5 py-2.5 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Go to Learning Pathway</span>
              <Compass className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ACTIVE QUESTION RENDERING
  // =========================================================================
  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto animate-in fade-in">
      {/* Header Banner */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-blue-900 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-4 h-4" />
            <span>Adaptive Cadre Competency Diagnostic</span>
          </div>
          <h1 className="text-xl font-black">Official Skill Assessment</h1>
          <p className="text-xs text-blue-200 mt-0.5">
            Calibrated items targeting verified competencies for Statistical Officers.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-blue-200 uppercase font-bold block">Progress</span>
          <span className="text-sm font-black text-amber-400">{currentIndex + 1} / {totalQuestions}</span>
        </div>
      </div>

      {/* Main Question Card */}
      {currentQ && (
        <div className="gov-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <div className="flex items-center space-x-2">
              <span className="badge-blue text-[10px]">{currentQ.skill}</span>
              <span className="badge-yellow text-[10px]">{currentQ.difficulty}</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-800 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = currentAnswer === idx;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-[11px] ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {letter}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Real-time Evaluation Card */}
          {currentEval && (
            <div className={`p-4 rounded-xl border animate-in fade-in ${
              currentEval.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
            } text-xs space-y-1.5`}>
              <div className="flex items-center space-x-2 font-bold">
                {currentEval.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-800">Correct! Official standard validated.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="text-red-800">Incorrect. Review the official rationale below.</span>
                  </>
                )}
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed pt-1">
                {currentEval.explanation}
              </p>
            </div>
          )}

          {/* Source Attribution */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Source Reference: <strong>{currentQ.sourceRef || 'MoSPI Methodology Guidelines'}</strong></span>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
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
                onClick={handleFinalSubmit}
                disabled={currentAnswer === undefined || submitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
              >
                <span>{submitting ? 'Synthesizing Report...' : 'Finalize & View AI Report'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                disabled={currentAnswer === undefined}
                className="px-5 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition disabled:opacity-50 flex items-center space-x-1 cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
