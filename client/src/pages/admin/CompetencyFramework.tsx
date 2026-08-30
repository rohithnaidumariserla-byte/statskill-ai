import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Settings, Shield, Plus, Save, CheckCircle2, Edit2, BookOpen, Target, Award } from 'lucide-react';

export const CompetencyFramework: React.FC = () => {
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const res = await api.getCompetencyFrameworks();
        setFrameworks(res.frameworks || []);
      } catch (e) {
        console.error('Framework error', e);
      }
    };
    fetchFrameworks();
  }, []);

  const currentFramework = frameworks[selectedRole] || frameworks[0];

  const handleScoreChange = (skillIndex: number, newScore: number) => {
    if (!currentFramework) return;
    const updated = { ...currentFramework };
    updated.requiredSkills[skillIndex].requiredScore = newScore;
    let level = 'Beginner';
    if (newScore >= 90) level = 'Advanced';
    else if (newScore >= 75) level = 'Proficient';
    else if (newScore >= 60) level = 'Intermediate';
    else if (newScore >= 40) level = 'Developing';
    updated.requiredSkills[skillIndex].level = level;

    const copy = [...frameworks];
    copy[selectedRole] = updated;
    setFrameworks(copy);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateCompetencyFramework(currentFramework);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Save error', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto animate-in fade-in">
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Cadre Competency Standard Architecture</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Competency Framework Configuration</h1>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Configure required skill benchmarks and proficiency thresholds across official statistical cadres. These values directly feed into the Skill Gap Calculation Engine.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center space-x-1.5 whitespace-nowrap disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Framework Benchmarks'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Competency framework benchmarks updated and synced with AI Gap Analysis engine.</span>
        </div>
      )}

      {/* Cadre Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {frameworks.map((fw, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedRole(idx)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              selectedRole === idx
                ? 'bg-gov-navy text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {fw.roleName}
          </button>
        ))}
      </div>

      {/* Framework Skill Configurator Table */}
      <div className="gov-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
              {currentFramework?.roleName} — Mandated Skill Standards
            </h3>
            <p className="text-[11px] text-slate-500">Cadre: {currentFramework?.cadre}</p>
          </div>
          <span className="text-[11px] text-slate-500 font-bold">{currentFramework?.requiredSkills?.length || 0} Competencies Mapped</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Skill & Competency</th>
                <th className="py-3 px-3">Mandated Score</th>
                <th className="py-3 px-3">Adjust Benchmark</th>
                <th className="py-3 px-3">Required Proficiency</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-4">Associated Course / Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentFramework?.requiredSkills?.map((skill: any, sIdx: number) => (
                <tr key={sIdx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {skill.skillName}
                    <span className="block text-[10px] text-slate-400 font-normal">ID: {skill.skillId}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-black text-sm text-blue-700">{skill.requiredScore}%</span>
                  </td>
                  <td className="py-3.5 px-3 w-48">
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="30"
                        max="95"
                        value={skill.requiredScore}
                        onChange={e => handleScoreChange(sIdx, parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      skill.requiredScore >= 80 ? 'bg-purple-100 text-purple-800' :
                      skill.requiredScore >= 70 ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {skill.level}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      skill.requiredScore >= 75 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {skill.requiredScore >= 75 ? 'High / Critical' : 'Standard'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                    <span className="block font-semibold text-slate-800">
                      {skill.skillName === 'Sampling' ? 'Modern Survey Methodologies (NSSTA)' :
                       skill.skillName === 'Python' ? 'Python for Statistical Data Analysis (iGOT)' :
                       skill.skillName === 'National Accounts' ? 'SNA 2008 Foundations (NSSTA)' :
                       skill.skillName === 'Data Visualization' ? 'PowerBI for Public Policy (iGOT)' :
                       'National Statistical Certification Exam'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
