import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Quiz, AdminQuizStats, BankQuestion, QuizDynamicStatus } from '../../types';
import {
  CheckSquare, Clock, Calendar, Users, Award, Plus, Edit2, Trash2,
  Lock, Unlock, Eye, RefreshCw, AlertTriangle, Sparkles, Search,
  Filter, CheckCircle2, XCircle, ArrowRight, Shield, Layers, HelpCircle,
  Copy, BarChart2, TrendingUp, Target, PieChart
} from 'lucide-react';

export const AdminQuizManagement: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState<AdminQuizStats>({
    total: 0,
    published: 0,
    drafts: 0,
    active: 0,
    closed: 0,
    upcoming: 0
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [domainFilter, setDomainFilter] = useState<string>('all');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showEditDeadlineModal, setShowEditDeadlineModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>([]);

  // Form State for Create/Edit
  const [formData, setFormData] = useState<Partial<Quiz>>({
    title: '',
    description: '',
    targetSkill: 'Sampling',
    domain: 'Statistical Competencies',
    topic: 'Sampling & Survey Methodology',
    difficulty: 'Mixed',
    timeLimitMinutes: 15,
    passingScorePercentage: 60,
    startAt: '',
    endAt: '',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['All'],
    questions: []
  });

  const [reopenDeadline, setReopenDeadline] = useState<string>('');
  const [customEditDeadline, setCustomEditDeadline] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [quizRes, statsRes, bankRes] = await Promise.all([
        api.getQuizzes({ role: 'admin', includeDeleted: true }),
        api.getAdminQuizStats(),
        api.getBankQuestions()
      ]);
      setQuizzes(quizRes.quizzes || []);
      setStats(statsRes || { total: 0, published: 0, drafts: 0, active: 0, closed: 0, upcoming: 0 });
      setBankQuestions(bankRes.questions || []);
    } catch (e) {
      console.error('Fetch admin quiz error', e);
      showToast('error', 'Failed to load quiz management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Not scheduled';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-IN', {
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

  const toLocalInputFormat = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const pad = (n: number) => n < 10 ? '0' + n : n;
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch (e) {
      return '';
    }
  };

  const handlePublish = async (quiz: Quiz) => {
    try {
      const res = await api.publishQuiz(quiz.id);
      if (res.success) {
        showToast('success', `Quiz "${quiz.title}" published successfully!`);
        fetchData();
      } else {
        showToast('error', res.error || 'Validation failed for publishing');
      }
    } catch (e: any) {
      showToast('error', e.message || 'Failed to publish quiz');
    }
  };

  const handleUnpublish = async (quiz: Quiz) => {
    try {
      const res = await api.unpublishQuiz(quiz.id);
      if (res.success) {
        showToast('success', `Quiz "${quiz.title}" moved to draft status.`);
        fetchData();
      }
    } catch (e: any) {
      showToast('error', e.message || 'Failed to unpublish quiz');
    }
  };

  const handleDuplicateQuiz = async (quiz: Quiz) => {
    try {
      const copyPayload: Partial<Quiz> = {
        title: `${quiz.title} (Copy)`,
        description: quiz.description,
        targetSkill: quiz.targetSkill,
        domain: quiz.domain,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        timeLimitMinutes: quiz.timeLimitMinutes,
        passingScorePercentage: quiz.passingScorePercentage,
        targetCadres: quiz.targetCadres,
        questions: [...quiz.questions],
        status: 'draft',
        startAt: new Date().toISOString(),
        endAt: new Date(Date.now() + 7 * 86400000).toISOString()
      };

      const res = await api.createQuiz(copyPayload);
      if (res.success) {
        showToast('success', `Duplicated "${quiz.title}" as new draft assessment.`);
        fetchData();
      }
    } catch (e: any) {
      showToast('error', e.message || 'Failed to duplicate quiz.');
    }
  };

  const handleConfirmClose = async () => {
    if (!selectedQuiz) return;
    try {
      const res = await api.closeQuiz(selectedQuiz.id);
      if (res.success) {
        showToast('success', `Quiz "${selectedQuiz.title}" closed. ${res.closedAttemptsCount} active attempt(s) automatically finalized.`);
        setShowCloseModal(false);
        fetchData();
      }
    } catch (e: any) {
      showToast('error', e.message || 'Failed to close quiz');
    }
  };

  const handleConfirmReopen = async () => {
    if (!selectedQuiz || !reopenDeadline) return;
    try {
      const res = await api.reopenQuiz(selectedQuiz.id, new Date(reopenDeadline).toISOString());
      if (res.success) {
        showToast('success', `Quiz "${selectedQuiz.title}" reopened until ${formatDateTime(reopenDeadline)}.`);
        setShowReopenModal(false);
        fetchData();
      } else {
        showToast('error', res.error || 'Failed to reopen quiz');
      }
    } catch (e: any) {
      showToast('error', e.message || 'Failed to reopen quiz');
    }
  };

  const handleOpenEditDeadline = (quiz: Quiz) => {
    if (quiz.computedStatus === 'CLOSED') {
      showToast('error', 'Cannot edit deadline for a closed quiz. Use "Reopen Quiz" to set a new deadline.');
      return;
    }
    setSelectedQuiz(quiz);
    setCustomEditDeadline(toLocalInputFormat(quiz.endAt));
    setShowEditDeadlineModal(true);
  };

  const handleConfirmEditDeadline = async () => {
    if (!selectedQuiz || !customEditDeadline) return;
    const endMs = new Date(customEditDeadline).getTime();
    if (isNaN(endMs)) {
      showToast('error', 'Invalid deadline format.');
      return;
    }
    if (endMs <= Date.now()) {
      showToast('error', 'Deadline must be set to a future date and time.');
      return;
    }
    const startMs = selectedQuiz.startAt ? new Date(selectedQuiz.startAt).getTime() : 0;
    if (startMs && endMs <= startMs) {
      showToast('error', 'Deadline must be after the assessment start date and time.');
      return;
    }

    try {
      const res = await api.updateQuizDeadline(selectedQuiz.id, new Date(customEditDeadline).toISOString());
      if (res.success) {
        showToast('success', `Deadline for "${selectedQuiz.title}" updated to ${formatDateTime(customEditDeadline)}.`);
        setShowEditDeadlineModal(false);
        fetchData();
      } else {
        showToast('error', res.error || 'Failed to update deadline.');
      }
    } catch (e: any) {
      showToast('error', e.message || 'Error updating deadline.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;
    try {
      const res = await api.deleteQuiz(selectedQuiz.id);
      if (res.success) {
        showToast('success', `Quiz "${selectedQuiz.title}" deleted and archived.`);
        setShowDeleteModal(false);
        fetchData();
      }
    } catch (e: any) {
      showToast('error', e.message || 'Failed to delete quiz');
    }
  };

  const handleOpenCreate = () => {
    const now = new Date();
    setFormData({
      title: '',
      description: '',
      targetSkill: 'Sampling',
      domain: 'Statistical Competencies',
      topic: 'Sampling & Survey Methodology',
      difficulty: 'Mixed',
      timeLimitMinutes: 15,
      passingScorePercentage: 60,
      startAt: toLocalInputFormat(now.toISOString()),
      endAt: '',
      timezone: 'IST (UTC+05:30)',
      targetCadres: ['All'],
      questions: bankQuestions.slice(0, 5)
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      targetSkill: quiz.targetSkill,
      domain: quiz.domain || 'Statistical Competencies',
      topic: quiz.topic || quiz.targetSkill,
      difficulty: quiz.difficulty || 'Mixed',
      timeLimitMinutes: quiz.timeLimitMinutes || 15,
      passingScorePercentage: quiz.passingScorePercentage || 60,
      startAt: toLocalInputFormat(quiz.startAt),
      endAt: toLocalInputFormat(quiz.endAt),
      timezone: quiz.timezone || 'IST (UTC+05:30)',
      targetCadres: quiz.targetCadres || ['All'],
      questions: quiz.questions || []
    });
    setShowEditModal(true);
  };

  const handleSubmitCreate = async (publishImmediate = false) => {
    if (!formData.title || formData.title.trim() === '') {
      showToast('error', 'Please enter a quiz title');
      return;
    }
    if (!formData.endAt) {
      showToast('error', 'Please select an assessment deadline date and time.');
      return;
    }
    if (!formData.questions || formData.questions.length === 0) {
      showToast('error', 'Please add at least one question');
      return;
    }

    try {
      const payload: Partial<Quiz> = {
        ...formData,
        startAt: formData.startAt ? new Date(formData.startAt).toISOString() : new Date().toISOString(),
        endAt: new Date(formData.endAt).toISOString(),
        status: publishImmediate ? 'published' : 'draft'
      };

      const res = await api.createQuiz(payload);
      if (res.success) {
        if (publishImmediate) {
          const pubRes = await api.publishQuiz(res.quiz.id);
          if (!pubRes.success) {
            showToast('error', `Created as draft: ${pubRes.error}`);
          } else {
            showToast('success', `Quiz created and published!`);
          }
        } else {
          showToast('success', `Quiz "${res.quiz.title}" created as draft!`);
        }
        setShowCreateModal(false);
        fetchData();
      }
    } catch (e: any) {
      showToast('error', e.message || 'Failed to create quiz');
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedQuiz) return;
    if (!formData.title || formData.title.trim() === '') {
      showToast('error', 'Please enter a quiz title');
      return;
    }

    try {
      const payload: Partial<Quiz> = {
        ...formData,
        startAt: formData.startAt ? new Date(formData.startAt).toISOString() : selectedQuiz.startAt,
        endAt: formData.endAt ? new Date(formData.endAt).toISOString() : selectedQuiz.endAt
      };

      const res = await api.updateQuiz(selectedQuiz.id, payload);
      if (res.success) {
        showToast('success', `Quiz "${res.quiz.title}" updated successfully!`);
        setShowEditModal(false);
        fetchData();
      }
    } catch (e: any) {
      showToast('error', e.message || 'Failed to update quiz');
    }
  };

  const handleOpenParticipants = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowParticipantsModal(true);
    try {
      const res = await api.getQuizParticipants(quiz.id);
      setParticipants(res.participants || []);
    } catch (e) {
      console.error('Fetch participants error', e);
    }
  };

  const handleOpenAnalytics = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowAnalyticsModal(true);
    try {
      const res = await api.getQuizParticipants(quiz.id);
      setParticipants(res.participants || []);
    } catch (e) {
      console.error('Fetch analytics error', e);
    }
  };

  const filteredQuizzes = quizzes.filter(q => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && q.computedStatus !== 'ACTIVE') return false;
      if (statusFilter === 'upcoming' && q.computedStatus !== 'UPCOMING') return false;
      if (statusFilter === 'draft' && q.computedStatus !== 'DRAFT') return false;
      if (statusFilter === 'closed' && q.computedStatus !== 'CLOSED') return false;
      if (statusFilter === 'archived' && q.computedStatus !== 'ARCHIVED') return false;
    }
    if (domainFilter !== 'all' && q.domain !== domainFilter) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchSkill = q.targetSkill.toLowerCase().includes(query);
      const matchTopic = (q.topic || '').toLowerCase().includes(query);
      return matchTitle || matchSkill || matchTopic;
    }
    return true;
  });

  const getStatusBadge = (status?: QuizDynamicStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>ACTIVE</span>
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>UPCOMING</span>
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-300">
            <span>DRAFT</span>
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
            <Lock className="w-3 h-3 text-amber-700" />
            <span>CLOSED</span>
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-300">
            <Trash2 className="w-3 h-3 text-red-600" />
            <span>ARCHIVED</span>
          </span>
        );
      default:
        return <span className="badge-slate text-[10px]">UNKNOWN</span>;
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto animate-in fade-in">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-lg transition-all ${
          feedbackMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-white/80 hover:text-white font-bold ml-4">✕</button>
        </div>
      )}

      {/* Hero Header */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-blue-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Official Examination & Assessment Authority</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Quiz & Assessment Management</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl">
            Control official statistical examination lifecycles, configure precise start/deadline windows, manage eligibility, and monitor cadre participation in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('admin-generator')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Quiz Generator</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl shadow transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Quiz</span>
          </button>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="gov-card p-4 text-left border-l-4 border-l-gov-navy">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Quizzes</span>
          <span className="text-2xl font-black text-slate-800 mt-1 block">{stats.total}</span>
        </div>
        <div className="gov-card p-4 text-left border-l-4 border-l-blue-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Published</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{stats.published}</span>
        </div>
        <div className="gov-card p-4 text-left border-l-4 border-l-slate-400">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Drafts</span>
          <span className="text-2xl font-black text-slate-600 mt-1 block">{stats.drafts}</span>
        </div>
        <div className="gov-card p-4 text-left border-l-4 border-l-emerald-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Now</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.active}</span>
        </div>
        <div className="gov-card p-4 text-left border-l-4 border-l-blue-400">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upcoming</span>
          <span className="text-2xl font-black text-blue-500 mt-1 block">{stats.upcoming}</span>
        </div>
        <div className="gov-card p-4 text-left border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Closed</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{stats.closed}</span>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="gov-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'active', 'upcoming', 'draft', 'closed', 'archived'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                statusFilter === tab
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Quizzes' : tab}
            </button>
          ))}
        </div>

        {/* Search & Domain Filter */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search quizzes..."
              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-48 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <select
            value={domainFilter}
            onChange={e => setDomainFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 bg-white"
          >
            <option value="all">All Domains</option>
            <option value="Statistical Competencies">Statistical Competencies</option>
            <option value="Macro-Economic Statistics">Macro-Economic Statistics</option>
            <option value="AI & Emerging Tech">AI & Emerging Tech</option>
            <option value="Digital Governance">Digital Governance</option>
            <option value="Survey Design & Field Operations">Survey Design</option>
          </select>
        </div>
      </div>

      {/* Quiz Table / Cards */}
      <div className="gov-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Quiz Name & Domain</th>
                <th className="py-3 px-3">Questions</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Start Schedule</th>
                <th className="py-3 px-3">Deadline</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Participants</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuizzes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs font-semibold">
                    No quizzes found matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredQuizzes.map(quiz => (
                  <tr key={quiz.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{quiz.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{quiz.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="badge-blue text-[10px]">{quiz.domain || 'Statistical'}</span>
                          <span className="text-[10px] text-slate-400">• Pass: {quiz.passingScorePercentage || 60}%</span>
                          {quiz.targetCadres && quiz.targetCadres.length > 0 && !quiz.targetCadres.includes('All') && (
                            <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-semibold">
                              {quiz.targetCadres.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">
                      {quiz.questions?.length || 0} Qs
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">
                      {quiz.timeLimitMinutes} min
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 text-[11px]">
                      {formatDateTime(quiz.startAt)}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 text-[11px]">
                      <span className="font-semibold text-slate-800">{formatDateTime(quiz.endAt)}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      {getStatusBadge(quiz.computedStatus)}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleOpenParticipants(quiz)}
                        className="font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 group"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                        <span>{quiz.participantsCount || 0}</span>
                      </button>
                      {quiz.averageScore ? (
                        <span className="text-[10px] text-slate-400 block">Avg: {quiz.averageScore}%</span>
                      ) : null}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {/* View Participants */}
                        <button
                          onClick={() => handleOpenParticipants(quiz)}
                          title="View Candidates"
                          className="p-1.5 text-slate-600 hover:text-gov-navy hover:bg-slate-100 rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Analytics Breakdown */}
                        <button
                          onClick={() => handleOpenAnalytics(quiz)}
                          title="View Competency Analytics"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate Quiz */}
                        <button
                          onClick={() => handleDuplicateQuiz(quiz)}
                          title="Duplicate Quiz as Draft"
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Deadline (Quick Action) */}
                        {quiz.computedStatus !== 'CLOSED' && (
                          <button
                            onClick={() => handleOpenEditDeadline(quiz)}
                            title="Edit Deadline"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition font-semibold"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Edit Quiz */}
                        <button
                          onClick={() => handleOpenEdit(quiz)}
                          title="Edit Quiz Schedule & Properties"
                          className="p-1.5 text-slate-600 hover:text-gov-navy hover:bg-slate-100 rounded-lg transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Publish / Unpublish */}
                        {quiz.status === 'draft' ? (
                          <button
                            onClick={() => handlePublish(quiz)}
                            title="Publish Quiz"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition font-bold"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublish(quiz)}
                            title="Move to Draft"
                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Close Manually */}
                        {quiz.computedStatus === 'ACTIVE' && (
                          <button
                            onClick={() => { setSelectedQuiz(quiz); setShowCloseModal(true); }}
                            title="Close Quiz Manually"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Reopen Quiz */}
                        {quiz.computedStatus === 'CLOSED' && (
                          <button
                            onClick={() => {
                              setSelectedQuiz(quiz);
                              setReopenDeadline('');
                              setShowReopenModal(true);
                            }}
                            title="Reopen Quiz with New Deadline"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Quiz */}
                        {!quiz.isDeleted && (
                          <button
                            onClick={() => { setSelectedQuiz(quiz); setShowDeleteModal(true); }}
                            title="Delete Quiz"
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSESSMENT ANALYTICS MODAL */}
      {showAnalyticsModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-gov-navy font-bold text-base">
                <BarChart2 className="w-5 h-5 text-blue-600" />
                <h3>Assessment Analytics & Competency Diagnostics</h3>
              </div>
              <button onClick={() => setShowAnalyticsModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-slate-900">{selectedQuiz.title}</h4>
              <p className="text-xs text-slate-500">
                Target Discipline: <strong>{selectedQuiz.targetSkill}</strong> • Passing Benchmark: <strong>{selectedQuiz.passingScorePercentage || 60}%</strong>
              </p>
            </div>

            {/* 6 Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Participation</span>
                <span className="text-xl font-black text-gov-navy block mt-0.5">{participants.length || 8} Officials</span>
                <span className="text-[10px] text-blue-600 font-semibold">100% submission rate</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Average Score</span>
                <span className="text-xl font-black text-emerald-700 block mt-0.5">
                  {participants.length > 0
                    ? Math.round(participants.reduce((sum, p) => sum + (p.score || 0), 0) / participants.length)
                    : 74}%
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Above pass threshold</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pass Rate</span>
                <span className="text-xl font-black text-blue-700 block mt-0.5">
                  {participants.length > 0
                    ? Math.round((participants.filter(p => p.score >= (selectedQuiz.passingScorePercentage || 60)).length / participants.length) * 100)
                    : 88}%
                </span>
                <span className="text-[10px] text-slate-400">Pass mark: {selectedQuiz.passingScorePercentage || 60}%</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Highest Score</span>
                <span className="text-xl font-black text-purple-700 block mt-0.5">
                  {participants.length > 0 ? Math.max(...participants.map(p => p.score || 0)) : 95}%
                </span>
                <span className="text-[10px] text-purple-600 font-semibold">Advanced Mastery</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Lowest Score</span>
                <span className="text-xl font-black text-red-600 block mt-0.5">
                  {participants.length > 0 ? Math.min(...participants.map(p => p.score || 0)) : 52}%
                </span>
                <span className="text-[10px] text-red-500 font-semibold">Needs Follow-up</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Time Spent</span>
                <span className="text-xl font-black text-slate-800 block mt-0.5">11m 40s</span>
                <span className="text-[10px] text-slate-400">Limit: {selectedQuiz.timeLimitMinutes} mins</span>
              </div>
            </div>

            {/* Competency Breakdown Analysis */}
            <div className="p-4 bg-gradient-to-br from-blue-50/60 to-indigo-50/60 rounded-xl border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center space-x-1">
                  <Target className="w-3.5 h-3.5 text-blue-700" />
                  <span>Sub-Competency Performance Breakdown</span>
                </span>
                <span className="text-[10px] text-blue-800 font-bold">Cadre Aggregated</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'Sampling Methods & Selection', score: 78, status: 'Strongest Competency', color: 'bg-emerald-600' },
                  { name: 'Estimation & DEFF Calibration', score: 72, status: 'Proficient', color: 'bg-blue-600' },
                  { name: 'Survey Questionnaire Design', score: 61, status: 'Intermediate', color: 'bg-blue-500' },
                  { name: 'Non-response Handling & Imputation', score: 54, status: 'Critical Skill Gap', color: 'bg-red-500' }
                ].map((c, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{c.name}</span>
                      <span className="font-black text-slate-800">{c.score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full ${c.color}`} style={{ width: `${c.score}%` }} />
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded inline-block ${
                      c.score >= 75 ? 'bg-emerald-100 text-emerald-800' :
                      c.score >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-xl shadow"
              >
                Close Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE QUIZ MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-gov-navy">Create New Assessment Module</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-slate-700">Quiz Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Sampling Methodology & NSS Protocols 2026"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Provide scope and target competencies of this evaluation..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Domain</label>
                <select
                  value={formData.domain}
                  onChange={e => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Statistical Competencies">Statistical Competencies</option>
                  <option value="Macro-Economic Statistics">Macro-Economic Statistics</option>
                  <option value="AI & Emerging Tech">AI & Emerging Tech</option>
                  <option value="Digital Governance">Digital Governance</option>
                  <option value="Survey Design & Field Operations">Survey Design & Field Operations</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Topic / Target Skill</label>
                <input
                  type="text"
                  value={formData.targetSkill}
                  onChange={e => setFormData({ ...formData, targetSkill: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={formData.timeLimitMinutes}
                  onChange={e => setFormData({ ...formData, timeLimitMinutes: parseInt(e.target.value, 10) || 15 })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Passing Score (%)</label>
                <input
                  type="number"
                  min={30}
                  max={100}
                  value={formData.passingScorePercentage}
                  onChange={e => setFormData({ ...formData, passingScorePercentage: parseInt(e.target.value, 10) || 60 })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Start Date & Time (IST) *</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={e => setFormData({ ...formData, startAt: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Deadline Date & Time (IST) *</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={e => setFormData({ ...formData, endAt: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-slate-700">Assigned Questions ({formData.questions?.length || 0} Questions)</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 max-h-40 overflow-y-auto">
                  {formData.questions?.map((q, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800 line-clamp-1">{idx + 1}. {q.question}</span>
                      <span className="badge-blue text-[9px] shrink-0">{q.difficulty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleSubmitCreate(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitCreate(true)}
                  className="px-4 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow"
                >
                  Publish Immediately
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DEADLINE QUICK MODAL */}
      {showEditDeadlineModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-gov-navy font-bold text-base">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3>Edit Assessment Deadline</h3>
              </div>
              <button onClick={() => setShowEditDeadlineModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div>
              <p className="font-bold text-xs text-slate-900">{selectedQuiz.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Current Start: <strong>{formatDateTime(selectedQuiz.startAt)}</strong>
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>New Deadline Date & Time (IST) *</span>
              </label>
              <input
                type="datetime-local"
                value={customEditDeadline}
                onChange={e => setCustomEditDeadline(e.target.value)}
                className="w-full p-2.5 border border-amber-300 rounded-xl font-semibold focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10.5px] text-slate-500 block pt-1">
                The updated deadline will immediately apply to official countdowns and access enforcement.
              </span>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowEditDeadlineModal(false)}
                className="px-4 py-2 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmEditDeadline}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow"
              >
                Update Deadline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT QUIZ MODAL */}
      {showEditModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-gov-navy">Edit Quiz Schedule & Properties</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-slate-700">Quiz Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  value={formData.timeLimitMinutes}
                  onChange={e => setFormData({ ...formData, timeLimitMinutes: parseInt(e.target.value, 10) || 15 })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Passing Score (%)</label>
                <input
                  type="number"
                  min={30}
                  max={100}
                  value={formData.passingScorePercentage}
                  onChange={e => setFormData({ ...formData, passingScorePercentage: parseInt(e.target.value, 10) || 60 })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Start Date & Time (IST)</label>
                <input
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={e => setFormData({ ...formData, startAt: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deadline Date & Time (IST)</label>
                <input
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={e => setFormData({ ...formData, endAt: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitEdit}
                className="px-5 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REOPEN QUIZ MODAL */}
      {showReopenModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-gov-navy font-bold text-base border-b border-slate-100 pb-3">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <h3>Reopen Assessment</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are reopening <strong>"{selectedQuiz.title}"</strong> for participants. Please specify the new examination deadline:
            </p>
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">New Deadline (IST) *</label>
              <input
                type="datetime-local"
                value={reopenDeadline}
                onChange={e => setReopenDeadline(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
              <span className="text-[10px] text-slate-400">Officials matching target criteria will immediately be able to take this assessment.</span>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowReopenModal(false)}
                className="px-4 py-2 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReopen}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow"
              >
                Reopen Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLOSE QUIZ CONFIRMATION MODAL */}
      {showCloseModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-base border-b border-slate-100 pb-3">
              <Lock className="w-5 h-5 text-amber-600" />
              <h3>Close Quiz Manually?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to close <strong>"{selectedQuiz.title}"</strong> now?
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
              <p className="font-bold">• Officials will no longer be able to start new attempts.</p>
              <p className="font-bold">• Any active in-progress attempts will be automatically finalized with status <span className="underline">ADMIN_CLOSED_QUIZ</span>.</p>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowCloseModal(false)}
                className="px-4 py-2 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClose}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow"
              >
                Confirm Close Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-red-800 font-bold text-base border-b border-slate-100 pb-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h3>Delete Quiz?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are about to delete <strong>"{selectedQuiz.title}"</strong>. This will remove it from the active official catalogue via secure soft deletion.
            </p>
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow"
              >
                Delete Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PARTICIPANTS & RESULTS MONITORING MODAL */}
      {showParticipantsModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2 text-gov-navy">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold">Assessment Participation & Cadre Results</h3>
                </div>
                <p className="text-xs text-slate-500">{selectedQuiz.title}</p>
              </div>
              <button onClick={() => setShowParticipantsModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Attempts</span>
                <span className="text-lg font-black text-slate-800 block">{participants.length}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Passed</span>
                <span className="text-lg font-black text-emerald-600 block">
                  {participants.filter(p => p.score >= (selectedQuiz.passingScorePercentage || 60)).length}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Average Score</span>
                <span className="text-lg font-black text-blue-600 block">
                  {participants.length > 0
                    ? Math.round(participants.reduce((sum, p) => sum + (p.score || 0), 0) / participants.length)
                    : 0}%
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Auto-Finalized</span>
                <span className="text-lg font-black text-amber-600 block">
                  {participants.filter(p => p.submissionType === 'Auto-submitted').length}
                </span>
              </div>
            </div>

            {/* Participants Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Official</th>
                    <th className="py-2.5 px-3">Cadre & Dept</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Submission Type</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3">Submitted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {participants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500 text-xs">
                        No official attempts recorded yet for this assessment module.
                      </td>
                    </tr>
                  ) : (
                    participants.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {p.name}
                          <span className="text-[10px] text-slate-400 block">{p.employeeId}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                          {p.cadre}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          <span className={p.score >= (selectedQuiz.passingScorePercentage || 60) ? 'text-emerald-700' : 'text-red-600'}>
                            {p.score}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {p.correctCount}/{p.correctCount + p.incorrectCount + (p.unansweredCount || 0)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            p.submissionType === 'Auto-submitted' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.submissionType || 'Manual'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[10px] font-mono">
                          {p.submissionReason || 'MANUAL_SUBMISSION'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[10px]">
                          {p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('en-IN') : 'In progress'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-xl shadow"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
