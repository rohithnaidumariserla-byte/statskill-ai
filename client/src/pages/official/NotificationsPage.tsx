import React, { useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCircle2, Clock, Sparkles, BookOpen, GraduationCap, AlertCircle } from 'lucide-react';

export const NotificationsPage: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();

  useEffect(() => {
    refreshNotifications();
  }, []);

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div className="gov-card p-6 bg-gradient-to-r from-gov-navy to-blue-900 text-white shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Notification & Milestone Center</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">System Notifications</h1>
          <p className="text-xs text-blue-200 mt-1">Real-time alerts for course matches, assessment results, and NSSTA nomination approvals.</p>
        </div>
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-lg transition"
            >
              Mark all read
            </button>
          )}
          <span className="badge-saffron text-xs font-bold">{unreadCount} Unread</span>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => { markAsRead(n.id); if (n.actionUrl) onNavigate(n.actionUrl.replace('/', '')); }}
            className={`gov-card p-4 cursor-pointer hover:border-blue-300 transition flex items-start space-x-4 ${!n.read ? 'border-l-4 border-l-blue-600 bg-blue-50/20' : ''}`}
          >
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
              {n.type === 'course' ? <BookOpen className="w-4 h-4 text-blue-600" /> :
               n.type === 'nssta' ? <GraduationCap className="w-4 h-4 text-purple-600" /> :
               n.type === 'assessment' ? <Sparkles className="w-4 h-4 text-orange-600" /> :
               <Bell className="w-4 h-4 text-emerald-600" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                <span className="text-[10px] text-slate-400">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
