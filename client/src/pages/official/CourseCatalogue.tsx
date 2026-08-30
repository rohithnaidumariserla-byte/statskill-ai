import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { CourseRecommendation } from '../../types';
import { BookOpen, Sparkles, Search, Filter, CheckCircle2, Play, AlertCircle, ExternalLink } from 'lucide-react';

export const CourseCatalogue: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseRecommendation[]>([]);
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedDiff, setSelectedDiff] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseRecommendation | null>(null);

  const fetchCourses = async () => {
    if (!user) return;
    try {
      const res = await api.getIgotCourses(user.id, {
        skill: selectedSkill,
        difficulty: selectedDiff,
        search
      });
      setCourses(res.courses || []);
    } catch (e) {
      console.error('Course fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user, selectedSkill, selectedDiff, search]);

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
    } catch (e) {
      console.error('Progress update error', e);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header & Mock API Banner */}
      <div className="gov-card p-6 bg-gradient-to-r from-white to-blue-50/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-800 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>iGOT Karmayogi Course Integration Layer</span>
            </div>
            <h1 className="text-2xl font-black text-gov-navy tracking-tight">Official Course Catalogue</h1>
            <p className="text-xs text-slate-600 mt-1">
              Courses matched directly to your skill deficits using our 6-factor AI recommendation engine.
            </p>
          </div>
        </div>

        {/* Prototype Notice Alert */}
        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Architectural Note:</strong> Simulated iGOT API integration service layer (<code>/api/igot/courses</code>). Designed for seamless live government LMS SSO and webhooks integration.
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses by skill, title, keyword (e.g. Python, Sampling, Accounts)..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex space-x-2 w-full sm:w-auto">
          <select
            value={selectedSkill}
            onChange={e => setSelectedSkill(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Skills</option>
            <option value="Python">Python</option>
            <option value="AI/ML">AI / Machine Learning</option>
            <option value="GIS">GIS Spatial Analysis</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="National Accounts">National Accounts</option>
            <option value="Data Privacy">Data Privacy</option>
          </select>

          <select
            value={selectedDiff}
            onChange={e => setSelectedDiff(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((item, idx) => (
          <div key={idx} className="gov-card overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-40 overflow-hidden">
                <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-gov-navy text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow border border-amber-400">
                  AI Match: {item.matchScore}%
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                  {item.course.provider}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-medium mb-1">
                  <span>{item.course.skill}</span>
                  <span>•</span>
                  <span>{item.course.difficulty}</span>
                  <span>•</span>
                  <span>{item.course.duration}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">{item.course.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">{item.course.description}</p>

                {/* AI Rationale */}
                <div className="p-2.5 bg-blue-50/80 rounded-lg border border-blue-100 text-[11px] text-blue-900 leading-relaxed mb-3">
                  <p><strong>Why this course?</strong> {item.reason}</p>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 space-y-2">
              {item.isEnrolled ? (
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.progress}%` }} />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateProgress(item.course.id, Math.min(100, (item.progress || 0) + 25))}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
                    >
                      {item.progress === 100 ? 'Completed' : '+25% Complete Module'}
                    </button>
                    <button
                      onClick={() => setSelectedCourse(item)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-lg transition"
                    >
                      Syllabus
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <a
                    href={item.course.externalUrl || 'https://www.kaggle.com/learn/python'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 cursor-pointer text-center"
                  >
                    <Play className="w-3 h-3 text-amber-400" />
                    <span>Start Course</span>
                    <ExternalLink className="w-3 h-3 text-blue-200" />
                  </a>
                  <button
                    onClick={() => setSelectedCourse(item)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    Details
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left animate-in fade-in">
            <div className="flex justify-between items-start">
              <div>
                <span className="badge-blue text-[10px]">{selectedCourse.course.provider}</span>
                <h2 className="text-lg font-black text-gov-navy mt-1">{selectedCourse.course.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{selectedCourse.course.description}</p>

            {/* Syllabus */}
            <div>
              <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-2">Curriculum Syllabus</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedCourse.course.syllabus?.map((topic, i) => (
                  <li key={i} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Recommendation Score Breakdown */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>AI Recommendation Breakdown (Match: {selectedCourse.matchScore}%)</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div>• Skill Gap Relevance: <strong>{selectedCourse.breakdown.skillGapWeight}% / 35%</strong></div>
                <div>• Job Cadre Relevance: <strong>{selectedCourse.breakdown.roleRelevanceWeight}% / 25%</strong></div>
                <div>• Prior Learning Path: <strong>{selectedCourse.breakdown.previousLearningWeight}% / 15%</strong></div>
                <div>• Career Progression: <strong>{selectedCourse.breakdown.careerRequirementWeight}% / 10%</strong></div>
                <div>• Department Priority: <strong>{selectedCourse.breakdown.deptPriorityWeight}% / 10%</strong></div>
                <div>• Emerging Tech Demand: <strong>{selectedCourse.breakdown.emergingDemandWeight}% / 5%</strong></div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <a
                href={selectedCourse.course.externalUrl || 'https://www.kaggle.com/learn/python'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-gov-navy hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 text-amber-400" />
                <span>Start Course on Learning Platform</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
