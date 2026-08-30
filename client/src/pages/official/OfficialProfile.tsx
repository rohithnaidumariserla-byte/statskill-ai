import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, Skill, UserSkill, GapAnalysisReport } from '../../types';
import {
  UserCheck, BookOpen, GraduationCap, Award, Save, Sparkles,
  Plus, CheckCircle2, Target, AlertTriangle, ArrowRight, Compass,
  Flame, Clock, ShieldCheck
} from 'lucide-react';

export const OfficialProfile: React.FC<{ onStartAssessment: () => void; onNavigate?: (tab: string) => void }> = ({
  onStartAssessment,
  onNavigate
}) => {
  const { user, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState<Partial<User>>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>>({});
  const [gapReport, setGapReport] = useState<GapAnalysisReport | null>(null);
  const [activeCategory, setActiveCategory] = useState<'Statistical' | 'Technical' | 'Digital Governance' | 'Behavioural & Managerial'>('Statistical');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ ...user });
    }
    const loadProfileData = async () => {
      try {
        const [allSkillsRes, userProfRes, gapsRes] = await Promise.all([
          api.getAllSkills(),
          user ? api.getProfile(user.id) : Promise.resolve({ skills: [] }),
          user ? api.getSkillGaps(user.id) : Promise.resolve(null)
        ]);
        setSkills(allSkillsRes.skills || []);
        setGapReport(gapsRes);

        const skillMap: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'> = {};
        if (userProfRes.skills) {
          userProfRes.skills.forEach((us: UserSkill) => {
            skillMap[us.skillName] = us.competencyLevel;
          });
        }
        setUserSkills(skillMap);
      } catch (e) {
        console.error('Error loading skills', e);
      }
    };
    loadProfileData();
  }, [user]);

  const handleLevelChange = (skillName: string, level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setUserSkills(prev => ({
      ...prev,
      [skillName]: level
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const skillPayload = Object.keys(userSkills).map(name => {
        const lvl = userSkills[name];
        let score = 40;
        if (lvl === 'Intermediate') score = 70;
        if (lvl === 'Advanced') score = 90;
        return {
          skillName: name,
          competencyLevel: lvl,
          competencyScore: score
        };
      });

      await api.updateProfile(user.id, {
        ...profileData,
        skills: skillPayload
      });

      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Save error', e);
    } finally {
      setSaving(false);
    }
  };

  const categories = ['Statistical', 'Technical', 'Digital Governance', 'Behavioural & Managerial'] as const;
  const filteredSkills = skills.filter(s => s.category === activeCategory);

  const getProficiencyLabel = (score: number) => {
    if (score >= 90) return { label: 'Advanced', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    if (score >= 75) return { label: 'Proficient', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (score >= 60) return { label: 'Intermediate', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 40) return { label: 'Developing', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { label: 'Beginner', color: 'bg-red-100 text-red-800 border-red-200' };
  };

  const overallScore = gapReport?.overallCompetency || 72;
  const prof = getProficiencyLabel(overallScore);

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto animate-in fade-in">
      {/* Header Banner */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-blue-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Official Statistical Cadre Profile</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">{user?.name || 'Rajesh Sharma'}</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            {user?.designation} • {user?.department} • Employee ID: <strong>{user?.employeeId}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1 bg-emerald-900/60 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile Synchronized!</span>
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>

      {/* 1. YOUR SKILL PROFILE HIGHLIGHTS */}
      <div className="gov-card p-6 space-y-4 border-l-4 border-l-gov-navy">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Competency Index</span>
            <h2 className="text-base font-black text-gov-navy">Your Statistical Skill Profile</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${prof.color}`}>
            {prof.label} ({overallScore}%)
          </span>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Overall Competency</span>
            <span className="text-2xl font-black text-gov-navy block mt-1">{overallScore}%</span>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">{prof.label} Level</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Assessments Taken</span>
            <span className="text-2xl font-black text-blue-700 block mt-1">4 Completed</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Avg Score: 78%</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Training Completed</span>
            <span className="text-2xl font-black text-emerald-700 block mt-1">{user?.coursesCompleted || 5} Courses</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">{user?.learningHours || 42} Learning Hours</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Learning Streak</span>
            <span className="text-2xl font-black text-orange-600 block mt-1 flex items-center space-x-1">
              <Flame className="w-5 h-5 text-orange-500 inline" />
              <span>{user?.learningStreak || 12} Days</span>
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Active cadence</span>
          </div>
        </div>

        {/* Competencies Breakdown with Progress Bars */}
        <div className="space-y-2.5 pt-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Key Cadre Disciplines</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Sampling Design', score: 82, level: 'Proficient' },
              { name: 'Statistical Analysis', score: 68, level: 'Intermediate' },
              { name: 'Python for Statistics', score: 61, level: 'Intermediate' },
              { name: 'Data Visualization', score: 55, level: 'Developing' }
            ].map((s, idx) => (
              <div key={idx} className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{s.name}</span>
                  <span className="font-extrabold text-blue-700">{s.score}% — {s.level}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      s.score >= 75 ? 'bg-emerald-600' : s.score >= 60 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SKILL GAPS DETECTED & DIRECT LEARNING ACTION */}
      <div className="gov-card p-6 space-y-4 border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Identified Competency Deficits for Your Cadre</span>
          </div>
          <span className="text-[11px] text-slate-500">Benchmark: {user?.designation}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-amber-50/50 to-orange-50/40 rounded-xl border border-amber-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="badge-saffron text-[10px]">Priority Gap Detected</span>
                <span className="text-[11px] font-bold text-red-600">-15% Deficit</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 mt-1.5">Data Visualization</h4>
              <p className="text-xs text-slate-600 mt-1">
                Current Level: <strong>55%</strong> • Required Benchmark: <strong>70%</strong>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Recommended: <em>Modern Data Visualization with PowerBI for Public Policy</em>
              </p>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('learning-path')}
              className="w-full py-2 bg-gov-navy hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <span>Start Recommended Learning</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/40 rounded-xl border border-blue-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="badge-blue text-[10px]">Target Assessment</span>
                <span className="text-[11px] font-bold text-blue-700">Official Exam</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 mt-1.5">Sampling Methodology & NSS Protocols</h4>
              <p className="text-xs text-slate-600 mt-1">
                Cadre Evaluation • 15 minutes • Pass threshold: <strong>60%</strong>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Tests Stratified Two-Stage Sampling, DEFF formulas, and non-response calibration.
              </p>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('quizzes')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <span>View Active Assessments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. COMPETENCY MATRIX CONFIGURATION */}
      <div className="gov-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
            Curriculum Competencies & Self-Assessment
          </h3>
          <button
            onClick={onStartAssessment}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Launch AI Adaptive Assessment</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeCategory === cat
                  ? 'bg-gov-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {filteredSkills.map(skill => {
            const currentLevel = userSkills[skill.name] || 'Beginner';
            return (
              <div key={skill.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">{skill.name}</span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{skill.description}</span>
                </div>
                <select
                  value={currentLevel}
                  onChange={e => handleLevelChange(skill.name, e.target.value as any)}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                >
                  <option value="Beginner">Beginner (0-39%)</option>
                  <option value="Intermediate">Intermediate (60-74%)</option>
                  <option value="Advanced">Advanced (90-100%)</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
