import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, UserCheck, Target, Compass, BookOpen,
  GraduationCap, Sparkles, CheckSquare, Users, BarChart3,
  TrendingUp, Settings, FileText, Bot, HelpCircle, Database
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role } = useAuth();

  const officialMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: UserCheck },
    { id: 'assessment', label: 'Skill Assessment', icon: Target },
    { id: 'skill-gaps', label: 'Skill Gaps', icon: Target },
    { id: 'learning-path', label: 'Learning Path', icon: Compass },
    { id: 'courses', label: 'Course Catalogue', icon: BookOpen },
    { id: 'nssta', label: 'NSSTA Training', icon: GraduationCap },
    { id: 'quizzes', label: 'Assessments & Quizzes', icon: CheckSquare },
    { id: 'statbot', label: 'StatBot Virtual Assistant', icon: Bot },
  ];

  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Workforce Dashboard', icon: LayoutDashboard },
    { id: 'admin-resources', label: 'Learning Resources', icon: BookOpen },
    { id: 'admin-question-bank', label: 'Question Bank', icon: Database },
    { id: 'admin-quiz-management', label: 'Quiz Management', icon: CheckSquare },
    { id: 'admin-gaps', label: 'Workforce Skill Gaps', icon: Target },
    { id: 'admin-future', label: 'Future Skills Prediction', icon: TrendingUp },
    { id: 'admin-generator', label: 'AI Quiz Generator', icon: Sparkles },
    { id: 'admin-roi', label: 'Training Analytics', icon: BarChart3 },
    { id: 'admin-framework', label: 'Competency Framework', icon: Settings },
    { id: 'courses', label: 'iGOT Course Matrix', icon: BookOpen },
    { id: 'nssta', label: 'NSSTA TPAC Programmes', icon: GraduationCap },
  ];

  const items = role === 'admin' ? adminMenuItems : officialMenuItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="px-3 py-2 mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {role === 'admin' ? 'Executive Administration' : 'Official Portal'}
          </span>
        </div>

        <nav className="space-y-1">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-gov-navy text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Central Loop Banner */}
      <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl mt-6 text-left">
        <div className="flex items-center space-x-1.5 text-blue-800 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Skill Intelligence Loop</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-tight">
          "Don't search for what to learn. Let AI identify what you need to learn next."
        </p>
      </div>
    </aside>
  );
};
