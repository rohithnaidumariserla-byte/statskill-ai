import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { BankQuestion, BankStats } from '../../types';
import {
  Database, Search, Filter, Plus, Trash2, Edit3, CheckCircle2,
  AlertCircle, ExternalLink, Sparkles, RefreshCw, Eye, Tag,
  Layers, Check, X, Shield, BookOpen
} from 'lucide-react';

export const QuestionBankPage: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [stats, setStats] = useState<BankStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');

  // Generation Modal
  const [showGenModal, setShowGenModal] = useState(false);
  const [genSubject, setGenSubject] = useState('Sampling');
  const [genCount, setGenCount] = useState(10);
  const [genDifficulty, setGenDifficulty] = useState('Mixed');
  const [generating, setGenerating] = useState(false);

  // Edit/View Modal
  const [selectedQ, setSelectedQ] = useState<BankQuestion | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<BankQuestion>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      if (search) filters.search = search;
      if (subject !== 'all') filters.subject = subject;
      if (difficulty !== 'all') filters.difficulty = difficulty;
      if (type !== 'all') filters.type = type;
      if (status !== 'all') filters.status = status;

      const [qRes, sRes] = await Promise.all([
        api.getBankQuestions(filters),
        api.getBankStats()
      ]);
      setQuestions(qRes.questions || []);
      setStats(sRes);
    } catch (e) {
      console.error('Error fetching question bank data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [subject, difficulty, type, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleToggleApprove = async (id: string) => {
    try {
      const res = await api.approveBankQuestion(id);
      if (res.question) {
        setQuestions(prev => prev.map(q => q.id === id ? res.question : q));
      }
    } catch (e) {
      console.error('Error updating approval status', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this question from the official Question Bank?')) return;
    try {
      await api.deleteBankQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
      if (selectedQ?.id === id) setSelectedQ(null);
    } catch (e) {
      console.error('Error deleting question', e);
    }
  };

  const handleBatchGenerate = async () => {
    setGenerating(true);
    try {
      await api.generateBankQuestions({
        targetSkill: genSubject,
        questionCount: genCount,
        difficulty: genDifficulty
      });
      setShowGenModal(false);
      await fetchData();
    } catch (e) {
      console.error('Batch gen error', e);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedQ) return;
    try {
      const res = await api.updateBankQuestion(selectedQ.id, editForm);
      if (res.question) {
        setQuestions(prev => prev.map(q => q.id === selectedQ.id ? res.question : q));
        setSelectedQ(res.question);
        setEditMode(false);
      }
    } catch (e) {
      console.error('Error updating question', e);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4 text-amber-400" />
            <span>Central Assessment Repository ⭐</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Official Question Bank</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl">
            Curated repository of validated statistical competency MCQs, scenario cases, and calculation items with authoritative source attributions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowGenModal(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Batch Synthesize MCQs</span>
          </button>
        </div>
      </div>

      {/* Stats KPI Ribbon */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="gov-card p-4 border-l-4 border-l-blue-600">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Items</span>
            <h3 className="text-xl font-black text-slate-900 mt-1">{stats.totalQuestions}</h3>
          </div>
          <div className="gov-card p-4 border-l-4 border-l-emerald-600">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Approved Items</span>
            <h3 className="text-xl font-black text-emerald-700 mt-1">{stats.approvedQuestions}</h3>
          </div>
          <div className="gov-card p-4 border-l-4 border-l-amber-500">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Pending Review</span>
            <h3 className="text-xl font-black text-amber-600 mt-1">{stats.pendingQuestions}</h3>
          </div>
          <div className="gov-card p-4 border-l-4 border-l-purple-600">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Unique Concepts</span>
            <h3 className="text-xl font-black text-purple-700 mt-1">{stats.uniqueConceptsCount}</h3>
          </div>
          <div className="gov-card p-4 border-l-4 border-l-cyan-600">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Subjects</span>
            <h3 className="text-xl font-black text-cyan-700 mt-1">{stats.subjectsCount}</h3>
          </div>
          <div className="gov-card p-4 border-l-4 border-l-indigo-600">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Disciplines</span>
            <h3 className="text-xl font-black text-indigo-700 mt-1">{stats.topicsCount}</h3>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="gov-card p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by question text, explanation, concept, or official source..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Subjects</option>
              <option value="Statistics">Statistics & Sampling</option>
              <option value="Python">Python for Statistics</option>
              <option value="SQL">SQL & National Registers</option>
              <option value="AI/ML">AI & Machine Learning</option>
              <option value="GIS">GIS & Spatial Analytics</option>
              <option value="National Accounts">National Accounts (SNA)</option>
              <option value="Data Privacy">Data Privacy (DPDP)</option>
            </select>

            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Formats</option>
              <option value="Conceptual">Conceptual</option>
              <option value="Application">Application</option>
              <option value="Scenario-based">Scenario-based</option>
              <option value="Calculation-based">Calculation-based</option>
              <option value="Comparison">Comparison</option>
              <option value="Interpretation">Interpretation</option>
              <option value="Data-based">Data-based</option>
              <option value="True/False">True/False</option>
              <option value="Case-based">Case-based</option>
            </select>

            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>

            <button
              type="button"
              onClick={fetchData}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              title="Refresh repository"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Questions Listing */}
      {loading ? (
        <div className="gov-card p-12 text-center">
          <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-600 font-semibold">Querying Central Question Bank Repository...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="gov-card p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No questions found matching criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search filters or click "Batch Synthesize MCQs" to generate new unique items.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Showing {questions.length} Question Items
            </span>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const letter = String.fromCharCode(65 + q.correctAnswer);
              return (
                <div
                  key={q.id}
                  className="gov-card p-5 hover:border-blue-300 transition space-y-3 relative group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="badge-blue text-[10px]">{q.subject || q.skill}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                        q.difficulty === 'Medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        {q.type}
                      </span>
                      {q.status === 'approved' ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
                          Pending
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <button
                        onClick={() => { setSelectedQ(q); setEditMode(false); }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg font-semibold transition flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleToggleApprove(q.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg font-semibold transition"
                      >
                        {q.status === 'approved' ? 'Revoke' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctAnswer;
                      const optLetter = String.fromCharCode(65 + oIdx);
                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-lg border flex items-start space-x-2 ${
                            isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded font-bold text-[10px] flex items-center justify-center shrink-0 ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {optLetter}
                          </span>
                          <span className="leading-tight text-[11.5px]">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Source & Attribution Strip */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-700">Source:</span>
                      <span>{q.source || q.sourceRef || 'MoSPI Guidelines'}</span>
                      {q.sourceUrl && (
                        <a
                          href={q.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-0.5 ml-1"
                        >
                          <span>[View Source]</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-[10.5px]">
                      {q.concepts && q.concepts.length > 0 && (
                        <span className="text-slate-400">Concept: <strong>{q.concepts[0]}</strong></span>
                      )}
                      <span className="text-slate-400">Usage: <strong>{q.usageCount || 0} times</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Batch Generation Modal */}
      {showGenModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Batch Synthesize Questions with AI</h3>
              </div>
              <button onClick={() => setShowGenModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Discipline</label>
                <select
                  value={genSubject}
                  onChange={e => setGenSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Sampling">Sampling & Survey Design</option>
                  <option value="Python">Python for Statistics</option>
                  <option value="SQL">SQL for National Registers</option>
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="GIS">GIS & Spatial Autocorrelation</option>
                  <option value="National Accounts">National Accounts (SNA 2008)</option>
                  <option value="Data Privacy">Data Privacy (DPDP Act 2023)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Batch Count</label>
                  <select
                    value={genCount}
                    onChange={e => setGenCount(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={30}>30 Questions</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Difficulty Distribution</label>
                  <select
                    value={genDifficulty}
                    onChange={e => setGenDifficulty(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Mixed">Mixed (Adaptive)</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed">
                <strong>AI Pipeline Active</strong>: Questions will be synthesized from authoritative sources (UNSD, MoSPI, Python Docs), filtered for semantic duplicates (cosine similarity &lt; 0.82), option randomized, and saved into the Question Bank.
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowGenModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchGenerate}
                disabled={generating}
                className="px-5 py-2 bg-gov-navy hover:bg-blue-900 text-white rounded-xl font-bold text-xs shadow flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{generating ? 'Synthesizing...' : 'Synthesize Questions'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View / Edit Modal */}
      {selectedQ && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="badge-blue text-[10px]">{selectedQ.subject || selectedQ.skill}</span>
                <span className="badge-green text-[10px]">{selectedQ.difficulty}</span>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">{selectedQ.type}</span>
              </div>
              <button onClick={() => setSelectedQ(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Question Text</span>
                <p className="font-bold text-slate-900 text-sm leading-relaxed">{selectedQ.question}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Options Matrix</span>
                <div className="space-y-1.5">
                  {selectedQ.options.map((opt, oIdx) => {
                    const isCorrect = oIdx === selectedQ.correctAnswer;
                    const letter = String.fromCharCode(65 + oIdx);
                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-lg border text-xs flex items-start space-x-2 ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded font-bold text-[10px] flex items-center justify-center shrink-0 ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {letter}
                        </span>
                        <span>{opt} {isCorrect && '✓ (Correct Option)'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Technical Explanation</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-xs">
                  {selectedQ.explanation}
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">Source: </span>
                  <span className="text-slate-600">{selectedQ.source || selectedQ.sourceRef}</span>
                </div>
                {selectedQ.sourceUrl && (
                  <a
                    href={selectedQ.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900 font-bold flex items-center space-x-1"
                  >
                    <span>View Official Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => handleToggleApprove(selectedQ.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                  selectedQ.status === 'approved'
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {selectedQ.status === 'approved' ? 'Mark as Pending' : 'Approve Question'}
              </button>

              <button
                onClick={() => setSelectedQ(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
