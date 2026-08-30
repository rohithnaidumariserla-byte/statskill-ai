import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AssessmentQuestion } from '../../types';
import {
  BrainCircuit, CheckCircle2, XCircle, ArrowRight, RotateCcw,
  Sparkles, Award, Target, HelpCircle, ShieldCheck, Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CompetencyAssessment: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [evaluated, setEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  useEffect(() => {
    const start = async () => {
      if (!user) return;
      try {
        const res = await api.startAssessment(user.id);
        setQuestions(res.questions || []);
      } catch (e) {
        console.error('Error starting assessment', e);
      } finally {
        setLoading(false);
      }
    };
    start();
  }, [user]);

  const currentQ = questions[currentIndex];

  const handleSelect = async (idx: number) => {
    if (evaluated) return;
    setSelectedOption(idx);

    try {
      const evalRes = await api.evaluateQuestion(currentQ.id, idx);
      setIsCorrect(evalRes.isCorrect);
      setExplanation(evalRes.explanation);
      setEvaluated(true);
      setAnswers(prev => ({ ...prev, [currentQ.id]: idx }));

      // Adaptive difficulty adjustment simulation
      if (evalRes.isCorrect) {
        setAdaptiveDifficulty('Hard');
      } else {
        setAdaptiveDifficulty('Medium');
      }
    } catch (e) {
      console.error('Eval error', e);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setEvaluated(false);
      setExplanation('');
    } else {
      // Submit & Generate AI Competency Report
      setLoading(true);
      try {
        const submitRes = await api.submitAssessment(user?.id || 'u-1', answers);
        setReport(submitRes);
        setCompleted(true);
        await refreshUser();
        try {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      } catch (e) {
        console.error('Submit error', e);
      } finally {
        setLoading(false);
      }
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

  if (completed && report) {
    return (
      <div className="space-y-6 text-left max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-gov-navy to-blue-900 rounded-2xl p-8 text-white shadow-xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-3 border border-amber-400">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Assessment Completed</span>
          <h1 className="text-3xl font-black mt-1">AI Competency Evaluation Report</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-lg mx-auto">
            Your statistical & technical scores have been scientifically computed and dynamically merged with your official personnel record.
          </p>

          <div className="mt-6 flex justify-center items-center space-x-6 text-left">
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center min-w-[120px]">
              <span className="text-3xl font-black text-amber-400">{report.score}%</span>
              <p className="text-[10px] text-slate-300 font-semibold uppercase">Overall Score</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-center min-w-[120px]">
              <span className="text-3xl font-black text-emerald-400">{report.correctCount}/{report.totalQuestions}</span>
              <p className="text-[10px] text-slate-300 font-semibold uppercase">Correct Answers</p>
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

        {/* Skill Breakdown */}
        <div className="gov-card p-6">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4">Competency Updates by Skill</h3>
          <div className="space-y-3">
            {report.updatedSkills?.map((sk: any) => (
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

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => onNavigate('skill-gaps')}
            className="px-5 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-xl shadow hover:bg-blue-900 transition flex items-center space-x-2"
          >
            <span>Proceed to AI Skill-Gap Analysis</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-3xl mx-auto">
      {/* Top Header with Progress */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider flex items-center space-x-1">
            <BrainCircuit className="w-3.5 h-3.5 text-orange-500" />
            <span>Adaptive Competency Engine</span>
          </span>
          <h1 className="text-lg font-black text-gov-navy">Question {currentIndex + 1} of {questions.length}</h1>
        </div>
        <div className="text-right flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">Skill: <strong>{currentQ?.skill}</strong></span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
            currentQ?.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {currentQ?.difficulty}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gov-blue h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="gov-card p-6 space-y-4">
        <p className="text-sm font-bold text-slate-900 leading-relaxed">
          {currentQ?.question}
        </p>

        {/* Options */}
        <div className="space-y-2.5 pt-2">
          {currentQ?.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';

            if (evaluated) {
              if (selectedOption === idx) {
                btnStyle = isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 'bg-red-50 border-red-500 text-red-900 font-bold';
              }
            } else if (selectedOption === idx) {
              btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={evaluated}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-start space-x-3 ${btnStyle}`}
              >
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {letter}
                </span>
                <span className="leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Evaluated Explanation Box */}
        {evaluated && (
          <div className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in ${
            isCorrect ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-red-50/80 border-red-200 text-red-900'
          }`}>
            <div className="flex items-center space-x-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correct Answer!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Incorrect</span>
                </>
              )}
            </div>
            <p className="leading-relaxed text-[11px] text-slate-700">
              <strong>Official Explanation:</strong> {explanation}
            </p>
            <p className="text-[10px] text-slate-500">Source: {currentQ.sourceRef}</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleNext}
          disabled={!evaluated}
          className="px-6 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-xl shadow hover:bg-blue-900 transition flex items-center space-x-2 disabled:opacity-50"
        >
          <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete & View Report'}</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
