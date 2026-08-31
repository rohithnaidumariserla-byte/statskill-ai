import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { CourseRecommendation } from '../../types';
import {
  BookOpen, Sparkles, Search, Filter, CheckCircle2, Play,
  AlertCircle, ExternalLink, ChevronDown, ChevronUp, X,
  Info, Clock, Award, Users, Layers, ShieldCheck
} from 'lucide-react';

export const CourseCatalogue: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseRecommendation[]>([]);
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedDiff, setSelectedDiff] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal & Expansion States
  const [selectedCourse, setSelectedCourse] = useState<CourseRecommendation | null>(null);
  const [activeModal, setActiveModal] = useState<'details' | 'syllabus' | 'why' | null>(null);
  const [expandedWhyCards, setExpandedWhyCards] = useState<Record<string, boolean>>({});

  const fetchCourses = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.getIgotCourses(user.id, {
        skill: selectedSkill,
        difficulty: selectedDiff,
        search
      });
      setCourses(res?.courses || []);
    } catch (e) {
      console.error('Course fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user?.id, selectedSkill, selectedDiff, search]);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    try {
      await api.enrollIgotCourse(user.id, courseId);
      await fetchCourses();
      if (selectedCourse && selectedCourse.course.id === courseId) {
        setSelectedCourse({ ...selectedCourse, isEnrolled: true, progress: 0 });
      }
    } catch (e) {
      console.error('Enroll error', e);
    }
  };

  const handleUpdateProgress = async (courseId: string, newProgress: number) => {
    if (!user) return;
    try {
      await api.updateIgotProgress(user.id, courseId, newProgress);
      await fetchCourses();
      if (selectedCourse && selectedCourse.course.id === courseId) {
        setSelectedCourse({ ...selectedCourse, progress: newProgress });
      }
    } catch (e) {
      console.error('Progress update error', e);
    }
  };

  const openModal = (course: CourseRecommendation, type: 'details' | 'syllabus' | 'why') => {
    setSelectedCourse(course);
    setActiveModal(type);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setActiveModal(null);
  };

  const toggleWhyCard = (courseId: string) => {
    setExpandedWhyCards(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="gov-card p-6 bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/40 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-800 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>iGOT Karmayogi & NSSTA Official Course Integration Layer</span>
            </div>
            <h1 className="text-2xl font-black text-gov-navy tracking-tight">Official Course Catalogue</h1>
            <p className="text-xs text-slate-600 mt-1">
              Explore capacity-building courses aligned directly to your cadre competencies using our 6-factor AI recommendation engine.
            </p>
          </div>
        </div>

        {/* Architectural Note */}
        <div className="mt-4 p-3.5 bg-blue-50/90 rounded-xl border border-blue-200/80 text-xs text-blue-900 flex items-center space-x-2.5 shadow-xs">
          <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
          <span>
            <strong>AI Recommendation Active:</strong> Courses are prioritized based on your real-time skill gaps, designation benchmarks (Statistical Officer SSS), and upcoming digital census demands.
          </span>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses by skill, title, keyword (e.g. Python, Sampling, Accounts, PowerBI)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
          />
        </div>

        <div className="flex space-x-2 w-full sm:w-auto">
          <select
            value={selectedSkill}
            onChange={e => setSelectedSkill(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none shadow-xs cursor-pointer"
          >
            <option value="all">All Skills ({courses.length})</option>
            <option value="Python">Python</option>
            <option value="AI/ML">AI / Machine Learning</option>
            <option value="GIS">GIS Spatial Analysis</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="SQL">SQL & Database</option>
            <option value="Data Visualization">Data Visualization</option>
            <option value="National Accounts">National Accounts</option>
            <option value="Sampling">Sampling & Surveys</option>
            <option value="Data Privacy">Data Privacy (DPDP)</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>

          <select
            value={selectedDiff}
            onChange={e => setSelectedDiff(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none shadow-xs cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-gov-navy border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-bold text-slate-600">Loading official courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="gov-card p-12 text-center text-slate-500">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No courses match your filter criteria</h3>
          <p className="text-xs mt-1 text-slate-500">Try adjusting your search query or selecting "All Skills".</p>
          <button
            type="button"
            onClick={() => { setSelectedSkill('all'); setSelectedDiff('all'); setSearch(''); }}
            className="mt-4 px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-xl shadow cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((item) => {
            const courseId = item.course?.id || `c-${Math.random()}`;
            const isExpanded = !!expandedWhyCards[courseId];
            const whyText = item.whyReason || item.reason || 'Directly aligned with your official cadre skill development roadmap.';
            const syllabusCount = item.course?.syllabus?.length || 0;

            return (
              <div key={courseId} className="gov-card overflow-hidden flex flex-col justify-between hover:shadow-lg transition duration-200 border border-slate-200">
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={item.course?.thumbnail || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'}
                      alt={item.course?.title || 'Course'}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 bg-gov-navy/95 backdrop-blur-xs text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md border border-amber-400 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Match: {item.matchScore ?? 90}%</span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 bg-slate-900/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm shadow">
                      {item.course?.provider || 'iGOT Karmayogi'}
                    </div>
                    {item.priorityLevel && (
                      <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow uppercase tracking-wider">
                        {item.priorityLevel}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    {/* Meta info */}
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                      <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{item.course?.skill || 'General'}</span>
                      <span>•</span>
                      <span>{item.course?.difficulty || 'Intermediate'}</span>
                      <span>•</span>
                      <span>{item.course?.duration || '8 hours'}</span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
                      {item.course?.title || 'Course Title'}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                      {item.course?.description || 'Learn comprehensive statistical methods and official data frameworks.'}
                    </p>

                    {/* "Why this course?" Interactive Expandable Accordion */}
                    <div className="rounded-xl border border-blue-200/90 bg-blue-50/70 overflow-hidden mb-3 transition">
                      <button
                        type="button"
                        onClick={() => toggleWhyCard(courseId)}
                        className="w-full p-2.5 flex items-center justify-between text-left text-xs font-bold text-blue-900 hover:bg-blue-100/70 transition cursor-pointer"
                        title="Click to view AI reasoning"
                      >
                        <div className="flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span>Why this course?</span>
                        </div>
                        <div className="flex items-center space-x-1 text-[11px] text-blue-700">
                          <span className="font-semibold">{isExpanded ? 'Hide' : 'Explain'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 text-[11px] text-slate-700 leading-relaxed border-t border-blue-200/60 animate-in fade-in space-y-2">
                          <p>{whyText}</p>
                          <button
                            type="button"
                            onClick={() => openModal(item, 'why')}
                            className="inline-flex items-center space-x-1 text-[10px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                          >
                            <Info className="w-3 h-3" />
                            <span>View 6-Factor AI Scoring Breakdown</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 space-y-2">
                  {item.isEnrolled ? (
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                        <span>Course Progress</span>
                        <span className="text-emerald-700">{item.progress ?? 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, item.progress ?? 0)}%` }}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateProgress(courseId, Math.min(100, (item.progress || 0) + 25))}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                        >
                          {item.progress === 100 ? '✓ Completed' : '+25% Complete Module'}
                        </button>
                        <button
                          type="button"
                          onClick={() => openModal(item, 'syllabus')}
                          className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                          title="View Course Syllabus"
                        >
                          Syllabus ({syllabusCount})
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <a
                        href={item.course?.externalUrl || 'https://www.kaggle.com/learn/python'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleEnroll(courseId)}
                        className="flex-1 py-2.5 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 cursor-pointer text-center"
                      >
                        <Play className="w-3.5 h-3.5 text-amber-400" />
                        <span>Start Course</span>
                        <ExternalLink className="w-3 h-3 text-blue-200" />
                      </a>
                      <button
                        type="button"
                        onClick={() => openModal(item, 'syllabus')}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                        title="View Course Syllabus"
                      >
                        Syllabus
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal(item, 'details')}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                        title="View Full Details"
                      >
                        Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SYLLABUS MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'syllabus' && selectedCourse && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left animate-in fade-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {selectedCourse.course?.provider || 'iGOT Karmayogi'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {selectedCourse.course?.duration || '8 hours'} • {selectedCourse.course?.difficulty || 'Intermediate'}
                  </span>
                </div>
                <h2 className="text-base font-black text-gov-navy">
                  {selectedCourse.course?.title} — Curriculum Syllabus
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Syllabus Modules List */}
            <div>
              <p className="text-xs text-slate-600 mb-3">
                Structured learning units aligned with official MoSPI statistical methodology and operational standards:
              </p>

              {selectedCourse.course?.syllabus && selectedCourse.course.syllabus.length > 0 ? (
                <ul className="space-y-2.5">
                  {selectedCourse.course.syllabus.map((topic, i) => (
                    <li
                      key={i}
                      className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:bg-blue-50/40 transition"
                    >
                      <span className="w-6 h-6 rounded-lg bg-gov-navy text-amber-300 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                        {i + 1}
                      </span>
                      <div className="flex-1 text-xs">
                        <p className="font-bold text-slate-800">{topic}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Module {i + 1} • Interactive exercises, official datasets & practical coding verification.
                        </p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">Syllabus details will be available soon.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    The academy curriculum committee is reviewing this module sequence.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close
              </button>
              <a
                href={selectedCourse.course?.externalUrl || 'https://www.kaggle.com/learn/python'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleEnroll(selectedCourse.course.id)}
                className="px-5 py-2 bg-gov-navy hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>Start Course</span>
                <ExternalLink className="w-3 h-3 text-blue-200" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FULL DETAILS MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'details' && selectedCourse && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-left animate-in fade-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div className="space-y-1 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {selectedCourse.course?.provider || 'iGOT Karmayogi'}
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    {selectedCourse.course?.skillCategory || 'Technical'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ⭐ {selectedCourse.course?.rating ?? 4.8} / 5.0
                  </span>
                </div>
                <h2 className="text-lg font-black text-gov-navy mt-1">
                  {selectedCourse.course?.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Duration</p>
                <p className="text-xs font-bold text-slate-800">{selectedCourse.course?.duration || '8 hours'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Layers className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Difficulty</p>
                <p className="text-xs font-bold text-slate-800">{selectedCourse.course?.difficulty || 'Intermediate'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Users className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Officials Enrolled</p>
                <p className="text-xs font-bold text-slate-800">{selectedCourse.course?.enrolledCount?.toLocaleString() || '1,420+'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <Sparkles className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <p className="text-[10px] text-slate-500 font-semibold uppercase">AI Match Score</p>
                <p className="text-xs font-black text-gov-navy">{selectedCourse.matchScore ?? 90}%</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">Course Overview</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedCourse.course?.description}
              </p>
            </div>

            {/* "Why this course?" AI Explanation */}
            <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-xs space-y-2.5">
              <h4 className="font-bold text-blue-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>AI Recommendation Rationale & Breakdown</span>
              </h4>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {selectedCourse.whyReason || selectedCourse.reason || 'Identified as a critical competency builder for official statistical responsibilities.'}
              </p>

              {/* 6-Factor Breakdown Grid */}
              <div className="pt-2 border-t border-blue-200/80 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                <div>• Skill Gap Relevance: <strong className="text-blue-950">{selectedCourse.breakdown?.skillGapWeight ?? 35}% / 35%</strong></div>
                <div>• Job Cadre Relevance: <strong className="text-blue-950">{selectedCourse.breakdown?.roleRelevanceWeight ?? 25}% / 25%</strong></div>
                <div>• Prior Learning Path: <strong className="text-blue-950">{selectedCourse.breakdown?.previousLearningWeight ?? 15}% / 15%</strong></div>
                <div>• Career Progression: <strong className="text-blue-950">{selectedCourse.breakdown?.careerRequirementWeight ?? 10}% / 10%</strong></div>
                <div>• Department Priority: <strong className="text-blue-950">{selectedCourse.breakdown?.deptPriorityWeight ?? 10}% / 10%</strong></div>
                <div>• Emerging Tech Demand: <strong className="text-blue-950">{selectedCourse.breakdown?.emergingDemandWeight ?? 5}% / 5%</strong></div>
              </div>
            </div>

            {/* Curriculum Syllabus Preview */}
            <div>
              <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-2">Curriculum Modules</h4>
              {selectedCourse.course?.syllabus && selectedCourse.course.syllabus.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedCourse.course.syllabus.map((topic, i) => (
                    <li key={i} className="flex items-center space-x-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-medium text-slate-800">{topic}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-100">
                  Syllabus details will be available soon.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close
              </button>
              <a
                href={selectedCourse.course?.externalUrl || 'https://www.kaggle.com/learn/python'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleEnroll(selectedCourse.course.id)}
                className="px-6 py-2.5 bg-gov-navy hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>Start Course on Learning Platform</span>
                <ExternalLink className="w-3 h-3 text-blue-200" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: WHY THIS COURSE MODAL */}
      {/* ========================================================================= */}
      {activeModal === 'why' && selectedCourse && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left animate-in fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <div>
                  <h2 className="text-base font-black text-gov-navy">AI Recommendation Engine Analysis</h2>
                  <p className="text-[11px] text-slate-500">{selectedCourse.course?.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-900">Total Match Score</span>
                <span className="text-base font-black text-gov-navy">{selectedCourse.matchScore ?? 90}%</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                {selectedCourse.whyReason || selectedCourse.reason || 'High alignment with required cadre competencies.'}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">6-Factor Weighting Breakdown</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>Skill Gap Deficit ({selectedCourse.breakdown?.skillGapWeight ?? 35}%)</span>
                    <span className="text-slate-500">Weight: 35%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${((selectedCourse.breakdown?.skillGapWeight ?? 35) / 35) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>Cadre Role Requirement ({selectedCourse.breakdown?.roleRelevanceWeight ?? 25}%)</span>
                    <span className="text-slate-500">Weight: 25%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${((selectedCourse.breakdown?.roleRelevanceWeight ?? 25) / 25) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>Prior Training Progression ({selectedCourse.breakdown?.previousLearningWeight ?? 15}%)</span>
                    <span className="text-slate-500">Weight: 15%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${((selectedCourse.breakdown?.previousLearningWeight ?? 15) / 15) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>Career Advancement Fit ({selectedCourse.breakdown?.careerRequirementWeight ?? 10}%)</span>
                    <span className="text-slate-500">Weight: 10%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-600 h-full rounded-full" style={{ width: `${((selectedCourse.breakdown?.careerRequirementWeight ?? 10) / 10) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>Department Priority ({selectedCourse.breakdown?.deptPriorityWeight ?? 10}%)</span>
                    <span className="text-slate-500">Weight: 10%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${((selectedCourse.breakdown?.deptPriorityWeight ?? 10) / 10) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>Emerging Technology Demand ({selectedCourse.breakdown?.emergingDemandWeight ?? 5}%)</span>
                    <span className="text-slate-500">Weight: 5%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: `${((selectedCourse.breakdown?.emergingDemandWeight ?? 5) / 5) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
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
