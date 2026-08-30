import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { NSSTAProgramme } from '../../types';
import { GraduationCap, MapPin, Calendar, Users, Award, CheckCircle2, Sparkles, Filter } from 'lucide-react';

export const NsstaProgrammes: React.FC = () => {
  const { user } = useAuth();
  const [programmes, setProgrammes] = useState<NSSTAProgramme[]>([]);
  const [modeFilter, setModeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgs = async () => {
      try {
        const res = await api.getNsstaProgrammes({ mode: modeFilter });
        setProgrammes(res.programmes || []);
      } catch (e) {
        console.error('NSSTA error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProgs();
  }, [modeFilter]);

  const handleRegister = async (prog: NSSTAProgramme) => {
    if (!user) return;
    try {
      await api.registerNsstaProgramme(user.id, prog.id);
      setRegisteredIds(prev => [...prev, prog.id]);
      setSuccessNotice(`Nomination for "${prog.title}" submitted to Cadre Controlling Authority.`);
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (e) {
      console.error('Register error', e);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-indigo-900 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>National Statistical Systems Training Academy (NSSTA)</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">NSSTA — TPAC Training Programmes</h1>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl">
              Premier residential and high-impact specialized workshops in Greater Noida, UP. Synchronized with your career progression and official cadre training targets.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={modeFilter}
              onChange={e => setModeFilter(e.target.value)}
              className="bg-white/10 text-white border border-white/20 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all" className="text-slate-800">All Delivery Modes</option>
              <option value="Residential" className="text-slate-800">Residential (Greater Noida)</option>
              <option value="Hybrid" className="text-slate-800">Hybrid Workshop</option>
              <option value="Online" className="text-slate-800">Online Interactive</option>
            </select>
          </div>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Programmes List */}
      <div className="space-y-4">
        {programmes.map(prog => {
          const isRegistered = registeredIds.includes(prog.id);
          return (
            <div key={prog.id} className="gov-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    prog.mode === 'Residential' ? 'badge-saffron' : prog.mode === 'Hybrid' ? 'badge-blue' : 'badge-green'
                  }`}>
                    {prog.mode}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">• {prog.domain}</span>
                  <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                    Match Score: {prog.recommendationScore}%
                  </span>
                </div>

                <h3 className="text-base font-bold text-gov-navy leading-snug">{prog.title}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prog.batchDate}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{prog.location}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Seats: {prog.seatsAvailable} / {prog.seatsTotal}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700">
                  <span className="font-bold text-slate-800 block mb-1">Curriculum Highlights:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    {prog.curriculumHighlights?.slice(0, 2).map((h, i) => (
                      <li key={i} className="truncate">{h}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Side */}
              <div className="shrink-0 flex flex-col justify-center items-end space-y-2">
                <span className="text-[11px] text-slate-500 text-right">Target Cadre: <strong>{prog.targetRole}</strong></span>
                <button
                  onClick={() => handleRegister(prog)}
                  disabled={isRegistered}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1.5 ${
                    isRegistered
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-gov-navy hover:bg-blue-900 text-white'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nomination Sent</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Apply for Nomination</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
