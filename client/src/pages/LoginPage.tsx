import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Lock, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const { loginAs } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'official' | 'admin'>('official');

  const handleLogin = async (role: 'official' | 'admin') => {
    await loginAs(role);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Emblem */}
        <div className="w-14 h-14 rounded-2xl bg-gov-navy mx-auto flex items-center justify-center text-white shadow-lg mb-4">
          <svg className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9.8L4.2 7 12 3.1 19.8 7 12 11.8zM2 17l10 5 10-5v-2l-10 5-10-5v2z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gov-navy tracking-tight">StatSkill AI Authentication</h2>
        <p className="text-xs text-slate-500 mt-1">Official Statistical System Capacity Building Portal</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 rounded-2xl sm:px-10">
          <div className="mb-6 flex border-b border-slate-200">
            <button
              onClick={() => setSelectedRole('official')}
              className={`flex-1 pb-3 text-xs font-bold transition border-b-2 ${
                selectedRole === 'official'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Official Login
            </button>
            <button
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 pb-3 text-xs font-bold transition border-b-2 ${
                selectedRole === 'admin'
                  ? 'border-orange-600 text-orange-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Administrator Login
            </button>
          </div>

          {selectedRole === 'official' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <div className="flex items-center space-x-1.5 font-bold mb-1">
                  <User className="w-3.5 h-3.5 text-blue-700" />
                  <span>Demo Official Cadre Account</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Officer: <strong>Rajesh Sharma</strong> (Statistical Officer, MoSPI)
                  <br />Email: <code>rajesh.mospi@gov.in</code>
                </p>
              </div>

              <button
                onClick={() => handleLogin('official')}
                className="w-full py-3 bg-gov-navy text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-900 transition flex items-center justify-center space-x-2"
              >
                <span>Login as Official (Rajesh Sharma)</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900">
                <div className="flex items-center space-x-1.5 font-bold mb-1">
                  <Shield className="w-3.5 h-3.5 text-orange-700" />
                  <span>Demo Executive Administrator Account</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Director: <strong>Dr. Sunita Rao</strong> (Director Training & Intelligence, NSSTA)
                  <br />Email: <code>sunita.director@gov.in</code>
                </p>
              </div>

              <button
                onClick={() => handleLogin('admin')}
                className="w-full py-3 bg-gov-blue text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-800 transition flex items-center justify-center space-x-2"
              >
                <span>Login as Administrator (Dr. Sunita Rao)</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Smart India Hackathon Prototype • Mock SSO / e-Pramaan Ready
          </div>
        </div>
      </div>
    </div>
  );
};
