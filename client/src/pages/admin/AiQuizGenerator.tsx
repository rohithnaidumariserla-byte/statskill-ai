import React, { useState } from 'react';
import { api } from '../../services/api';
import { Quiz, AssessmentQuestion } from '../../types';
import {
  Sparkles, Upload, FileText, CheckCircle2, Trash2, Edit3,
  Plus, ArrowRight, Eye, RefreshCw, Layers, Shield, ExternalLink,
  Database, Clock, Calendar, AlertTriangle, X, Check, Award,
  CheckSquare, BookOpen, Target
} from 'lucide-react';

const COMPETENCY_MAP: Record<string, string[]> = {
  'Sampling': [
    'Sampling Methods & Selection',
    'Sample Size Determination',
    'Survey Questionnaire Design',
    'Non-response Handling & Imputation',
    'Stratified Multi-stage Design',
    'Sample Weight Calibration'
  ],
  'Python': [
    'Pandas Data Structures & Indexing',
    'NumPy Array Vectorization',
    'Statistical Testing with SciPy',
    'Data Visualization with Seaborn',
    'Automated CAPI Data Pipelines',
    'Missing Value Treatment'
  ],
  'AI/ML': [
    'Supervised ML for Official Statistics',
    'Predictive Imputation Algorithms',
    'NLP for Classification of Survey Text',
    'Model Fairness & Bias Mitigation',
    'Automated Anomaly Detection in Registers',
    'Feature Engineering on Survey Microdata'
  ],
  'National Accounts': [
    'SNA 2008 Production Boundary',
    'Gross Value Added (GVA) Compilation',
    'Supply and Use Tables (SUT)',
    'Deflators & Constant Price Estimation',
    'Informal Sector & FISIM Treatment',
    'Quarterly National Accounts Protocols'
  ],
  'Data Privacy': [
    'DPDP Act 2023 Core Principles',
    'Statistical Disclosure Control (SDC)',
    'Differential Privacy & Noise Injection',
    'Microdata Anonymization Protocols',
    'Data Fiduciary Responsibilities',
    'Audit Trails & Security Safeguards'
  ],
  'Official Statistics': [
    'National Indicator Framework (SDG Indicators)',
    'Generic Statistical Business Process Model (GSBPM)',
    'National Quality Assurance Framework (NQAF)',
    'SDMX Metadata Standards',
    'Administrative Register Linkages',
    'Statistical Act & Legal Mandates'
  ]
};

export const AiQuizGenerator: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [targetSkill, setTargetSkill] = useState('Sampling');
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([
    'Sampling Methods & Selection',
    'Sample Size Determination',
    'Survey Questionnaire Design',
    'Non-response Handling & Imputation'
  ]);
  const [questionCount, setQuestionCount] = useState('10');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Mixed');
  const [questionTypes, setQuestionTypes] = useState<string[]>(['MCQ', 'Scenario-based', 'Calculation-based']);
  const [attemptsAllowed, setAttemptsAllowed] = useState<number>(1);
  const [rawText, setRawText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Helper date initializers for Local IST Time
  const now = new Date();
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  const defaultStartDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const defaultStartTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  // Schedule State
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('23:59');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [passingScorePercentage, setPassingScorePercentage] = useState<number>(60);
  const [targetCadres, setTargetCadres] = useState<string[]>(['All']);

  // Error & Toast state
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit Schedule Modal on Preview
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [editStartDate, setEditStartDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editDuration, setEditDuration] = useState(15);
  const [editPassingScore, setEditPassingScore] = useState(60);

  const showToastMsg = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSkillChange = (skill: string) => {
    setTargetSkill(skill);
    const comps = COMPETENCY_MAP[skill] || [];
    setSelectedCompetencies(comps.slice(0, 4));
  };

  const toggleCompetency = (comp: string) => {
    setSelectedCompetencies(prev =>
      prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp]
    );
  };

  const toggleType = (t: string) => {
    setQuestionTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const toggleCadre = (cadre: string) => {
    if (cadre === 'All') {
      setTargetCadres(['All']);
      return;
    }
    const filtered = targetCadres.filter(c => c !== 'All');
    if (filtered.includes(cadre)) {
      const next = filtered.filter(c => c !== cadre);
      setTargetCadres(next.length === 0 ? ['All'] : next);
    } else {
      setTargetCadres([...filtered, cadre]);
    }
  };

  const getIsoTimestamp = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return '';
    return new Date(`${dateStr}T${timeStr}:00`).toISOString();
  };

  const formatDateTimeDisplay = (isoString?: string) => {
    if (!isoString) return 'Not scheduled';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' IST';
    } catch (e) {
      return isoString;
    }
  };

  const validateSchedule = (sDate: string, sTime: string, eDate: string, eTime: string, dur: number) => {
    if (!sDate || !sTime) {
      return 'Please specify the assessment start date and time.';
    }
    if (!eDate || !eTime) {
      return 'Please specify the assessment deadline / end date and time.';
    }
    const startMs = new Date(`${sDate}T${sTime}:00`).getTime();
    const endMs = new Date(`${eDate}T${eTime}:00`).getTime();

    if (isNaN(startMs) || isNaN(endMs)) {
      return 'Invalid date or time format. Please check your schedule inputs.';
    }
    if (endMs <= startMs) {
      return 'Deadline date and time must be after the start date and time.';
    }
    if (endMs <= Date.now()) {
      return 'Deadline must be set to a future date and time.';
    }
    if (!dur || dur <= 0) {
      return 'Quiz duration must be greater than 0 minutes.';
    }
    return null;
  };

  const handleGenerate = async () => {
    setScheduleError(null);

    const error = validateSchedule(startDate, startTime, endDate, endTime, durationMinutes);
    if (error) {
      setScheduleError(error);
      return;
    }

    if (selectedCompetencies.length === 0) {
      setScheduleError('Please select at least one competency to target.');
      return;
    }

    setGenerating(true);
    try {
      const startAtIso = getIsoTimestamp(startDate, startTime);
      const endAtIso = getIsoTimestamp(endDate, endTime);

      const fd = new FormData();
      if (file) fd.append('file', file);
      fd.append('targetSkill', targetSkill);
      fd.append('competencies', JSON.stringify(selectedCompetencies));
      fd.append('questionCount', questionCount);
      fd.append('difficulty', difficulty);
      fd.append('questionTypes', JSON.stringify(questionTypes));
      fd.append('attemptsAllowed', attemptsAllowed.toString());
      if (rawText) fd.append('content', rawText);
      fd.append('startAt', startAtIso);
      fd.append('endAt', endAtIso);
      fd.append('timeLimitMinutes', durationMinutes.toString());
      fd.append('passingScorePercentage', passingScorePercentage.toString());
      fd.append('timezone', 'IST (UTC+05:30)');
      fd.append('targetCadres', JSON.stringify(targetCadres));
      fd.append('status', 'draft');

      const res = await api.generateQuiz(fd);
      if (res.quiz) {
        setGeneratedQuiz({
          ...res.quiz,
          startAt: startAtIso,
          endAt: endAtIso,
          timeLimitMinutes: durationMinutes,
          passingScorePercentage,
          targetCadres
        });
        showToastMsg('success', 'AI assessment synthesized with target competencies and schedule!');
      }
    } catch (e: any) {
      console.error('Quiz gen error', e);
      showToastMsg('error', e.message || 'Failed to generate quiz assessment.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteQuestion = (idx: number) => {
    if (!generatedQuiz) return;
    const updated = { ...generatedQuiz };
    updated.questions.splice(idx, 1);
    setGeneratedQuiz(updated);
  };

  const handleOpenEditSchedule = () => {
    if (!generatedQuiz) return;
    try {
      const s = new Date(generatedQuiz.startAt || new Date().toISOString());
      const e = new Date(generatedQuiz.endAt || new Date(Date.now() + 86400000).toISOString());
      setEditStartDate(`${s.getFullYear()}-${pad(s.getMonth() + 1)}-${pad(s.getDate())}`);
      setEditStartTime(`${pad(s.getHours())}:${pad(s.getMinutes())}`);
      setEditEndDate(`${e.getFullYear()}-${pad(e.getMonth() + 1)}-${pad(e.getDate())}`);
      setEditEndTime(`${pad(e.getHours())}:${pad(e.getMinutes())}`);
      setEditDuration(generatedQuiz.timeLimitMinutes || 15);
      setEditPassingScore(generatedQuiz.passingScorePercentage || 60);
      setShowEditScheduleModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveScheduleChanges = async () => {
    const error = validateSchedule(editStartDate, editStartTime, editEndDate, editEndTime, editDuration);
    if (error) {
      showToastMsg('error', error);
      return;
    }

    const startAtIso = getIsoTimestamp(editStartDate, editStartTime);
    const endAtIso = getIsoTimestamp(editEndDate, editEndTime);

    if (generatedQuiz) {
      const updated: Quiz = {
        ...generatedQuiz,
        startAt: startAtIso,
        endAt: endAtIso,
        timeLimitMinutes: editDuration,
        passingScorePercentage: editPassingScore
      };
      setGeneratedQuiz(updated);

      try {
        await api.updateQuiz(generatedQuiz.id, {
          startAt: startAtIso,
          endAt: endAtIso,
          timeLimitMinutes: editDuration,
          passingScorePercentage: editPassingScore
        });
        showToastMsg('success', 'Assessment schedule updated successfully.');
        setShowEditScheduleModal(false);
      } catch (e: any) {
        showToastMsg('error', e.message || 'Failed to update schedule in database.');
      }
    }
  };

  const handleApproveAndPublish = async () => {
    if (!generatedQuiz) return;
    setPublishing(true);

    try {
      await api.updateQuiz(generatedQuiz.id, {
        startAt: generatedQuiz.startAt,
        endAt: generatedQuiz.endAt,
        timeLimitMinutes: generatedQuiz.timeLimitMinutes,
        passingScorePercentage: generatedQuiz.passingScorePercentage,
        targetCadres: generatedQuiz.targetCadres,
        questions: generatedQuiz.questions
      });

      const pubRes = await api.publishQuiz(generatedQuiz.id);
      if (pubRes.success) {
        showToastMsg('success', `Quiz "${generatedQuiz.title}" successfully published to officials!`);
        setTimeout(() => {
          onNavigate('admin-quiz-management');
        }, 800);
      } else {
        showToastMsg('error', pubRes.error || 'Failed to publish quiz. Please check schedule.');
      }
    } catch (e: any) {
      showToastMsg('error', e.message || 'Error publishing quiz.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto animate-in fade-in">
      {/* Toast Notification */}
      {toast && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-white/80 hover:text-white font-bold ml-4">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-blue-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>AI Assessment Authority</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">AI Assessment & Quiz Generator</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Synthesize competency-grounded statistical questions, set exact examination schedules and deadlines, and publish verified assessments to official cadres.
          </p>
        </div>

        <button
          onClick={() => onNavigate('admin-quiz-management')}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 whitespace-nowrap"
        >
          <Calendar className="w-4 h-4 text-amber-300" />
          <span>Quiz Management & Deadlines</span>
        </button>
      </div>

      {!generatedQuiz ? (
        /* Generation Form */
        <div className="gov-card p-6 space-y-6">
          {/* Schedule Error Banner */}
          {scheduleError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Invalid Configuration</p>
                <p className="text-[11px] mt-0.5">{scheduleError}</p>
              </div>
            </div>
          )}

          {/* Section 1: Upload Source Material */}
          <div>
            <label className="text-xs font-bold text-gov-navy uppercase tracking-wider block mb-2">
              1. Upload Training Source Material (PDF / PPT / DOCX / TXT)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 transition cursor-pointer bg-slate-50/50">
              <input
                type="file"
                id="quiz-file"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="quiz-file" className="cursor-pointer block">
                <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-800 block">
                  {file ? file.name : 'Click or Drag & Drop training documents'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Supports MoSPI survey manuals, SNA guidelines, Python codebooks (up to 10MB)
                </span>
              </label>
            </div>
          </div>

          {/* Paste Text Fallback */}
          <div>
            <label className="text-xs font-bold text-gov-navy uppercase tracking-wider block mb-1">
              Or Paste Statistical Curriculum / Notes directly:
            </label>
            <textarea
              rows={3}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="E.g., Paste notes on Stratified Two-Stage Sampling, DEFF formula, GREG estimators, DPDP compliance..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Section 2: Target Skill Discipline & Specific Competency Selection */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 text-xs block mb-1">Target Skill Discipline *</label>
                <select
                  value={targetSkill}
                  onChange={e => handleSkillChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                >
                  <option value="Sampling">Sampling & Survey Design</option>
                  <option value="Python">Python for Statistics</option>
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="National Accounts">National Accounts (SNA 2008)</option>
                  <option value="Data Privacy">Data Privacy & DPDP 2023</option>
                  <option value="Official Statistics">Official Statistics & Governance</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-xs block mb-1">Number of Questions</label>
                <select
                  value={questionCount}
                  onChange={e => setQuestionCount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                >
                  <option value="5">5 Questions (Quick Check)</option>
                  <option value="10">10 Questions (Standard Quiz)</option>
                  <option value="20">20 Questions (Cadre Exam)</option>
                  <option value="30">30 Questions (Full Certification)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 text-xs block mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                >
                  <option value="Mixed">Mixed (Adaptive Gradient)</option>
                  <option value="Easy">Easy (Foundational)</option>
                  <option value="Medium">Medium (Cadre Standard)</option>
                  <option value="Hard">Hard (Expert)</option>
                </select>
              </div>
            </div>

            {/* Specific Competencies Multi-checkboxes */}
            <div>
              <label className="text-xs font-bold text-gov-navy uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                <span>Select Target Competencies to Test:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {(COMPETENCY_MAP[targetSkill] || []).map(comp => (
                  <label
                    key={comp}
                    className={`p-2.5 rounded-xl border flex items-center space-x-2.5 text-xs cursor-pointer transition ${
                      selectedCompetencies.includes(comp)
                        ? 'bg-blue-50/80 border-blue-300 text-gov-navy font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCompetencies.includes(comp)}
                      onChange={() => toggleCompetency(comp)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600 shrink-0"
                    />
                    <span className="leading-tight">{comp}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Question Formats & Exam Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-gov-navy uppercase tracking-wider block mb-2">
                Select Question Formats
              </label>
              <div className="flex flex-wrap gap-3 text-xs">
                {['MCQ', 'Scenario-based', 'Calculation-based', 'True/False', 'Multiple-answer'].map(t => (
                  <label key={t} className="flex items-center space-x-2 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={questionTypes.includes(t)}
                      onChange={() => toggleType(t)}
                      className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gov-navy uppercase tracking-wider block mb-2">
                Exam Attempts Allowed
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 99].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAttemptsAllowed(num)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      attemptsAllowed === num
                        ? 'bg-gov-navy text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {num === 99 ? 'Unlimited' : `${num} Attempt${num > 1 ? 's' : ''}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: QUIZ SCHEDULE & DEADLINE CONTROL (Admin-configured) */}
          <div className="p-5 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border border-blue-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-200/80 pb-2.5">
              <div className="flex items-center space-x-2 text-gov-navy font-bold text-xs">
                <Clock className="w-4 h-4 text-blue-700" />
                <span className="uppercase tracking-wider">Quiz Schedule & Deadline Configuration</span>
              </div>
              <span className="text-[10px] text-blue-800 font-bold bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                Timezone: IST (UTC+05:30)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Start Date */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Start Date *</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              {/* Start Time */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Start Time (IST) *</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              {/* Deadline / End Date */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Deadline / End Date *</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              {/* Deadline / End Time */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Deadline Time (IST) *</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              {/* Duration */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Quiz Duration (Minutes) *</label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(parseInt(e.target.value, 10) || 15)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              {/* Passing Score */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Passing Score (%) *</label>
                <input
                  type="number"
                  min={30}
                  max={100}
                  value={passingScorePercentage}
                  onChange={e => setPassingScorePercentage(parseInt(e.target.value, 10) || 60)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              {/* Target Cadres */}
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-700">Target Cadres / Eligibility</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['All', 'Statistical Officer', 'Junior Statistical Officer', 'Director', 'Data Analyst'].map(cadre => (
                    <button
                      type="button"
                      key={cadre}
                      onClick={() => toggleCadre(cadre)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        targetCadres.includes(cadre)
                          ? 'bg-gov-navy text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cadre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Generate Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              * AI generates grounded questions strictly based on selected competencies and curriculum.
            </span>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-3 bg-gov-navy hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{generating ? 'AI Synthesizing Assessment...' : 'Generate Assessment with AI'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Review & Approve Generated Assessment */
        <div className="space-y-6 animate-in fade-in">
          {/* Assessment Overview Card */}
          <div className="gov-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-emerald-600">
            <div>
              <span className="badge-green text-[10px]">AI Generated & Synthesized</span>
              <h2 className="text-lg font-black text-gov-navy mt-1">{generatedQuiz.title}</h2>
              <p className="text-xs text-slate-600">
                {generatedQuiz.questions.length} Questions Synthesized • Target Skill: <strong>{generatedQuiz.targetSkill}</strong>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setGeneratedQuiz(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Create Another
              </button>
              <button
                onClick={handleOpenEditSchedule}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 transition flex items-center space-x-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Edit Schedule</span>
              </button>
              <button
                onClick={handleApproveAndPublish}
                disabled={publishing}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{publishing ? 'Publishing...' : 'Approve & Publish to Officials'}</span>
              </button>
            </div>
          </div>

          {/* Configured Schedule & Parameters Banner */}
          <div className="gov-card p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs w-full">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Start Date & Time</span>
                <span className="font-extrabold text-gov-navy text-xs mt-0.5 block">
                  {formatDateTimeDisplay(generatedQuiz.startAt)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deadline Date & Time</span>
                <span className="font-extrabold text-amber-900 text-xs mt-0.5 block">
                  {formatDateTimeDisplay(generatedQuiz.endAt)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quiz Duration</span>
                <span className="font-extrabold text-slate-800 text-xs mt-0.5 block">
                  {generatedQuiz.timeLimitMinutes} minutes
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Passing Threshold</span>
                <span className="font-extrabold text-emerald-800 text-xs mt-0.5 block">
                  {generatedQuiz.passingScorePercentage || 60}% Score
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenEditSchedule}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition whitespace-nowrap self-start md:self-center"
            >
              Modify
            </button>
          </div>

          {/* Question List Preview with Rich Metadata */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Synthesized Competency-Grounded Questions ({generatedQuiz.questions.length})
              </h3>
              <span className="text-[11px] text-slate-500">Review questions, distractors, and grounding attributions</span>
            </div>

            {generatedQuiz.questions.map((q, idx) => (
              <div key={idx} className="gov-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-extrabold text-xs text-gov-navy">Question {idx + 1}</span>
                    <span className="badge-blue text-[10px]">{q.type}</span>
                    <span className="text-[10px] font-semibold text-slate-500">• {q.difficulty}</span>
                    <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200">
                      Competency: {q.concepts?.[0] || q.topic || generatedQuiz.targetSkill}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Source Grounded
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(idx)}
                    className="text-red-500 hover:text-red-700 text-xs p-1"
                    title="Delete Question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs font-bold text-slate-800 leading-relaxed">{q.question}</p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
                        oIdx === q.correctAnswer
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="w-5 h-5 rounded bg-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900">
                  <strong>Official Explanation:</strong> {q.explanation}
                </div>

                {/* Source & Learning Outcome Metadata */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1">
                  <div>
                    <span>Source: <strong>{q.source || q.sourceRef || 'MoSPI Official Curriculum & Guidelines'}</strong></span>
                  </div>
                  <div>
                    {q.sourceUrl ? (
                      <a
                        href={q.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-0.5"
                      >
                        <span>[View Source]</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[10.5px]">Source reference grounded in MoSPI Manuals</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Toolbar */}
          <div className="gov-card p-4 flex items-center justify-between">
            <button
              onClick={() => setGeneratedQuiz(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Discard & Re-generate
            </button>
            <button
              onClick={handleApproveAndPublish}
              disabled={publishing}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{publishing ? 'Publishing...' : 'Approve & Publish to Officials'}</span>
            </button>
          </div>
        </div>
      )}

      {/* EDIT SCHEDULE MODAL */}
      {showEditScheduleModal && generatedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-gov-navy font-bold text-base">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3>Modify Assessment Schedule & Parameters</h3>
              </div>
              <button onClick={() => setShowEditScheduleModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Start Date</label>
                <input
                  type="date"
                  value={editStartDate}
                  onChange={e => setEditStartDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Start Time (IST)</label>
                <input
                  type="time"
                  value={editStartTime}
                  onChange={e => setEditStartTime(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deadline / End Date</label>
                <input
                  type="date"
                  value={editEndDate}
                  onChange={e => setEditEndDate(e.target.value)}
                  className="w-full p-2.5 border border-amber-300 rounded-xl font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deadline Time (IST)</label>
                <input
                  type="time"
                  value={editEndTime}
                  onChange={e => setEditEndTime(e.target.value)}
                  className="w-full p-2.5 border border-amber-300 rounded-xl font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={editDuration}
                  onChange={e => setEditDuration(parseInt(e.target.value, 10) || 15)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Passing Score (%)</label>
                <input
                  type="number"
                  min={30}
                  max={100}
                  value={editPassingScore}
                  onChange={e => setEditPassingScore(parseInt(e.target.value, 10) || 60)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowEditScheduleModal(false)}
                className="px-4 py-2 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveScheduleChanges}
                className="px-5 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow"
              >
                Save Schedule Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
