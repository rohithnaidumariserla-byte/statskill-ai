import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Course } from '../../types';
import {
  BookOpen, Plus, Edit2, Trash2, ExternalLink, Sparkles,
  CheckCircle2, XCircle, Search, Filter, Shield, AlertTriangle
} from 'lucide-react';

export const AdminLearningResources: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSkill, setFilterSkill] = useState('all');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formProvider, setFormProvider] = useState('iGOT Karmayogi');
  const [formSkill, setFormSkill] = useState('Python');
  const [formDifficulty, setFormDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [formDuration, setFormDuration] = useState('8 hours');
  const [formExternalUrl, setFormExternalUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminCourses();
      if (res.courses) {
        setCourses(res.courses);
      }
    } catch (e) {
      console.error('Failed to load courses', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openAddModal = () => {
    setEditingCourse(null);
    setFormTitle('');
    setFormProvider('iGOT Karmayogi / Kaggle Learn');
    setFormSkill('Python');
    setFormDifficulty('Intermediate');
    setFormDuration('8 hours');
    setFormExternalUrl('https://www.kaggle.com/learn/python');
    setFormDescription('Comprehensive official statistics training module.');
    setShowAddModal(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setFormTitle(c.title);
    setFormProvider(c.provider);
    setFormSkill(c.skill);
    setFormDifficulty(c.difficulty);
    setFormDuration(c.duration);
    setFormExternalUrl(c.externalUrl || '');
    setFormDescription(c.description);
    setShowAddModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formExternalUrl) {
      alert('Course Title and External URL are required.');
      return;
    }

    try {
      if (editingCourse) {
        // Update
        const res = await api.updateAdminCourse(editingCourse.id, {
          title: formTitle,
          provider: formProvider,
          skill: formSkill,
          difficulty: formDifficulty,
          duration: formDuration,
          externalUrl: formExternalUrl,
          description: formDescription
        });
        if (res.success) {
          setStatusMessage({ type: 'success', text: `Course "${formTitle}" updated successfully!` });
        }
      } else {
        // Create
        const res = await api.createAdminCourse({
          title: formTitle,
          provider: formProvider,
          skill: formSkill,
          difficulty: formDifficulty,
          duration: formDuration,
          externalUrl: formExternalUrl,
          description: formDescription
        });
        if (res.success) {
          setStatusMessage({ type: 'success', text: `Course "${formTitle}" created successfully!` });
        }
      }
      setShowAddModal(false);
      fetchCourses();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save course' });
    }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"? Officials will no longer receive recommendations for this resource.`)) {
      return;
    }
    try {
      await api.deleteAdminCourse(id);
      setStatusMessage({ type: 'success', text: `Course "${title}" removed successfully.` });
      fetchCourses();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to delete course' });
    }
  };

  const handleToggleStatus = async (c: Course) => {
    const newStatus = c.status === 'inactive' ? 'active' : 'inactive';
    try {
      await api.toggleAdminCourseStatus(c.id, newStatus);
      fetchCourses();
    } catch (e) {
      console.error('Failed to toggle status', e);
    }
  };

  const filtered = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.provider.toLowerCase().includes(search.toLowerCase()) ||
                          c.skill.toLowerCase().includes(search.toLowerCase());
    const matchesSkill = filterSkill === 'all' || c.skill.toLowerCase() === filterSkill.toLowerCase();
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="badge-blue text-[10px]">Ministry Learning Resource Repository</span>
            <span className="text-xs font-semibold text-slate-400">• {courses.length} Active Courses</span>
          </div>
          <h1 className="text-2xl font-black text-gov-navy mt-1">Learning Resources & Course Matrix</h1>
          <p className="text-xs text-slate-600">
            Centrally manage approved external training courses, platform URLs, competency mappings, and iGOT integration.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center space-x-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add Learning Course</span>
        </button>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center space-x-2 ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="gov-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by course title, skill, or provider..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden font-medium"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterSkill}
            onChange={e => setFilterSkill(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-hidden"
          >
            <option value="all">All Skills</option>
            <option value="Python">Python</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="AI/ML">AI / Machine Learning</option>
            <option value="SQL">SQL</option>
            <option value="Data Visualization">Data Visualization</option>
            <option value="GIS">GIS</option>
            <option value="National Accounts">National Accounts</option>
            <option value="Data Privacy">Data Privacy</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="gov-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3.5">Course Title & Description</th>
                <th className="px-4 py-3.5">Provider</th>
                <th className="px-4 py-3.5">Skill & Level</th>
                <th className="px-4 py-3.5">Duration</th>
                <th className="px-4 py-3.5">External Resource Link</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">Loading learning repository...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">No courses match your filter criteria.</td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 leading-snug">{c.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{c.description}</div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700 whitespace-nowrap">
                      {c.provider}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="badge-blue text-[10px] mr-1.5">{c.skill}</span>
                      <span className="text-[10px] text-slate-500 font-bold">({c.difficulty})</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-600 whitespace-nowrap">
                      {c.duration}
                    </td>
                    <td className="px-4 py-3.5 max-w-[200px]">
                      {c.externalUrl ? (
                        <a
                          href={c.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 truncate"
                        >
                          <span className="truncate">{c.externalUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-red-500 font-bold">No URL attached</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          c.status === 'inactive' ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'badge-green hover:bg-emerald-200'
                        }`}
                      >
                        {c.status === 'inactive' ? 'Inactive' : 'Active'}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                          title="Edit Course"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(c.id, c.title)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-gov-navy">
                {editingCourse ? 'Edit Learning Resource' : 'Add New Learning Resource'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Python for Statistical Data Analysis"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Provider Platform *</label>
                  <input
                    type="text"
                    required
                    value={formProvider}
                    onChange={e => setFormProvider(e.target.value)}
                    placeholder="e.g. Kaggle Learn / iGOT"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mapped Skill *</label>
                  <input
                    type="text"
                    required
                    value={formSkill}
                    onChange={e => setFormSkill(e.target.value)}
                    placeholder="e.g. Python, Cloud Computing"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty Level</label>
                  <select
                    value={formDifficulty}
                    onChange={e => setFormDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={e => setFormDuration(e.target.value)}
                    placeholder="e.g. 8 hours"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Verified External Resource URL *</label>
                <input
                  type="url"
                  required
                  value={formExternalUrl}
                  onChange={e => setFormExternalUrl(e.target.value)}
                  placeholder="https://www.kaggle.com/learn/..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-1">Must be a real, working URL on Kaggle, Microsoft Learn, Google, Coursera, or UNSD.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Brief summary of skills and modules covered..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
