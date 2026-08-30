import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { PracticeQuestion, PracticeQuizResult } from '../../types';
import { Sparkles, CheckCircle2, AlertCircle, Play, ArrowRight, Award, Trophy, RotateCcw, X, Shield } from 'lucide-react';

interface PracticeQuizModalProps {
  skillName: string;
  userId: string;
  onClose: () => void;
  onCompleted?: (result: PracticeQuizResult) => void;
}

export const PracticeQuizModal: React.FC<PracticeQuizModalProps> = ({
  skillName,
  userId,
  onClose,
  onCompleted
}) => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PracticeQuizResult | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await api.getPracticeQuestions(skillName);
        if (res.questions && res.questions.length > 0) {
          setQuestions(res.questions);
        }
      } catch (e) {
        console.error('Failed to load practice questions', e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [skillName]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (result) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await api.submitPracticeQuiz(userId, skillName, selectedAnswers);
      if (res.success && res.result) {
        setResult(res.result);
        if (onCompleted) {
          onCompleted(res.result);
        }
      }
    } catch (e) {
      console.error('Failed to submit practice quiz', e);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const canSubmit = answeredCount === questions.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                  Cadre Practice Assessment
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-semibold">
                  5 Questions
                </span>
              </div>
              <h2 className="text-sm font-black text-white">{skillName} Skill Practice</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-gov-navy border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">Generating tailored practice questions on {skillName}...</p>
            </div>
          ) : result ? (
            /* RESULTS VIEW */
            <div className="space-y-6 text-center py-2 animate-in zoom-in-95">
              <div className="inline-flex p-4 bg-emerald-50 rounded-full text-emerald-600 mb-1">
                {result.benchmarkAchieved ? (
                  <Trophy className="w-12 h-12 text-amber-500 animate-bounce" />
                ) : (
                  <Award className="w-12 h-12 text-emerald-600" />
                )}
              </div>

              <div>
                <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  result.benchmarkAchieved ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {result.benchmarkAchieved ? '🏆 Benchmark Achieved!' : '⭐ Practice Completed!'}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {result.score} / {result.totalQuestions} Correct ({result.accuracy}% Accuracy)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your verified competency in <strong>{skillName}</strong> has been updated.
                </p>
              </div>

              {/* Progress Comparison Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-4 text-center">
                <div className="p-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Previous Score</span>
                  <span className="text-lg font-black text-slate-700">{result.previousScore}%</span>
                </div>
                <div className="p-2 border-x border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Updated Score</span>
                  <span className="text-lg font-black text-blue-700">{result.newScore}%</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Growth Boost</span>
                  <span className="text-lg font-black text-emerald-600">+{result.newScore - result.previousScore}%</span>
                </div>
              </div>

              {result.benchmarkAchieved && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left flex items-start space-x-2.5">
                  <Trophy className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Cadre Benchmark Milestone Achieved</strong>
                    <span>Your score of {result.newScore}% meets or exceeds the required benchmark for your designation under national statistics standards.</span>
                  </div>
                </div>
              )}

              {/* Question Review */}
              <div className="space-y-3 text-left">
                <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">Answer Review</h4>
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={idx} className={`p-3.5 rounded-xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/40 border-red-200'}`}>
                      <div className="flex items-start space-x-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1 text-xs">
                          <p className="font-bold text-slate-800">{idx + 1}. {q.question}</p>
                          <p className="text-[11px] text-slate-600">
                            Your answer: <strong className={isCorrect ? 'text-emerald-700' : 'text-red-700'}>{q.options[userAns] || 'Unanswered'}</strong>
                          </p>
                          {!isCorrect && (
                            <p className="text-[11px] text-emerald-700">
                              Correct answer: <strong>{q.options[q.correctAnswer]}</strong>
                            </p>
                          )}
                          <p className="text-[10px] text-slate-500 pt-1 italic">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : currentQ ? (
            /* QUESTION CAROUSEL */
            <div className="space-y-5">
              {/* Stepper Header */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                <span className="font-bold text-gov-navy">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-slate-400 font-semibold">
                  {answeredCount} of {questions.length} Answered
                </span>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                  {currentQ.difficulty} • {currentQ.skill}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isSelected ? 'bg-gov-navy text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center justify-center space-x-2 pt-2">
                {questions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => setCurrentIndex(qIdx)}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      currentIndex === qIdx
                        ? 'bg-gov-navy w-6'
                        : selectedAnswers[q.id] !== undefined
                        ? 'bg-emerald-500'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-8">No practice questions available for {skillName}.</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          {result ? (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow transition"
              >
                Close & Return to Dashboard
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitting}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span>Evaluating...</span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Submit Practice Assessment</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
