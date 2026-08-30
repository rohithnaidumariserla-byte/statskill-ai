import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, User as UserIcon, Shield, ChevronDown, Award, LogOut, RefreshCw, BookOpen, Layers } from 'lucide-react';

export const Header: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; toggleMobileMenu: () => void }> = ({
  activeTab,
  setActiveTab,
  toggleMobileMenu
}) => {
  const { user, role, switchUser, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route / tab change
  useEffect(() => {
    setShowNotifs(false);
    setShowRoleDropdown(false);
  }, [activeTab]);

  // Outside click listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifs(false);
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotifs(prev => {
      const next = !prev;
      if (next) {
        setShowRoleDropdown(false);
        // Mark all as read when opening panel so badge immediately clears
        markAllAsRead();
      }
      return next;
    });
  };

  const handleRoleSwitch = async (userId: string, targetRole: 'official' | 'admin') => {
    setShowRoleDropdown(false);
    await switchUser(userId);
    setActiveTab(targetRole === 'admin' ? 'admin-dashboard' : 'dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Tricolor Accent */}
      <div className="tricolor-strip w-full" />

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Emblem & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab(role === 'admin' ? 'admin-dashboard' : 'dashboard')}
          >
            {/* National Emblem & Crest */}
            <div className="w-10 h-10 rounded-lg bg-gov-navy flex items-center justify-center text-white shadow-md">
              <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9.8L4.2 7 12 3.1 19.8 7 12 11.8zM2 17l10 5 10-5v-2l-10 5-10-5v2z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gov-navy tracking-tight">StatSkill AI</span>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-200 uppercase tracking-wider">
                  SIH Prototype
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                सांख्यिकी कौशल एआई • Official Statistical System of India
              </p>
            </div>
          </div>

          {/* Right Action Tools & Demo Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* SIH Demo Quick Switcher */}
            <div className="relative" ref={roleRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowRoleDropdown(!showRoleDropdown); setShowNotifs(false); }}
                aria-label="Switch User Role"
                aria-expanded={showRoleDropdown}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
              >
                <Shield className="w-3.5 h-3.5 text-gov-blue" />
                <span>Role: <strong className="text-gov-navy capitalize">{role}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Demo Cadre
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('u-1', 'official')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition ${role === 'official' ? 'bg-blue-50/80 font-bold text-blue-800' : 'text-slate-700'}`}
                  >
                    <div>
                      <p className="font-semibold">Rajesh Sharma (Official)</p>
                      <p className="text-[10px] text-slate-500">Statistical Officer, MoSPI</p>
                    </div>
                    {role === 'official' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('u-2', 'admin')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition ${role === 'admin' ? 'bg-blue-50/80 font-bold text-blue-800' : 'text-slate-700'}`}
                  >
                    <div>
                      <p className="font-semibold">Dr. Sunita Rao (Admin)</p>
                      <p className="text-[10px] text-slate-500">Director Training, NSSTA</p>
                    </div>
                    {role === 'admin' && <span className="w-2 h-2 rounded-full bg-orange-600"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleToggleNotifications}
                aria-label="Notifications"
                aria-expanded={showNotifs}
                className="relative p-2 rounded-lg text-slate-600 hover:text-gov-navy hover:bg-slate-100 transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow animate-in fade-in">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Notifications{unreadCount > 0 ? ` (${unreadCount})` : ''}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          markAllAsRead();
                          setShowNotifs(false);
                          setActiveTab('notifications');
                        }}
                        className="text-[11px] text-blue-600 font-semibold hover:underline"
                      >
                        View all
                      </button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-slate-500 text-center">No new notifications</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            setShowNotifs(false);
                            if (n.actionUrl) {
                              setActiveTab(n.actionUrl.replace('/', ''));
                            }
                          }}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition ${!n.read ? 'bg-blue-50/40 font-medium' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-800 text-[11px]">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Info */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-2 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow">
                {user?.name ? user.name.charAt(0) : 'O'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Official'}</p>
                <p className="text-[10px] text-slate-500">{user?.employeeId || 'MOSPI-SSO'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
