import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, BookOpen, Compass, Target, ArrowRight, Award, GraduationCap } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ChatCard } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  cards?: ChatCard[];
  suggestedActions?: { label: string; url: string; promptText?: string }[];
  timestamp: string;
}

export const StatBot: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sessionState, setSessionState] = useState<any>({});
  const isAdmin = user?.role === 'admin';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: isAdmin
        ? `Namaste **${user?.name || 'Director'}**! I am **StatBot**, your AI Workforce Skill Intelligence Assistant.\n\nAsk me about workforce competency gaps, AI question synthesis, cadre benchmark standards, or 2027 future skill projections!`
        : `Namaste **${user?.name || 'Officer'}**! I am **StatBot**, your AI Statistical Skill Intelligence Assistant.\n\nAsk me anything regarding your competencies, course recommendations, sampling methods, or learning roadmaps!`,
      suggestedActions: isAdmin
        ? [
            { label: 'Workforce Skill Gaps', url: '/admin-gaps', promptText: 'What are the largest workforce skill gaps?' },
            { label: 'AI Assessment Synthesis', url: '/admin-generator', promptText: 'How do I generate an AI assessment for Survey Design?' },
            { label: '2027 Future Skills', url: '/admin-future', promptText: 'Show 2027 future skill projections' }
          ]
        : [
            { label: 'What should I learn next?', url: '/learning-path', promptText: 'What should I learn next?' },
            { label: 'Show my skill gaps', url: '/skill-gaps', promptText: 'What are my skill gaps?' },
            { label: 'Explain Stratified Sampling', url: '/assessment', promptText: 'Explain stratified sampling' }
          ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial message when user role switches
  useEffect(() => {
    const isAdm = user?.role === 'admin';
    setMessages([
      {
        id: `m-init-${user?.id || 'default'}`,
        sender: 'bot',
        text: isAdm
          ? `Namaste **${user?.name || 'Director'}**! I am **StatBot**, your AI Workforce Skill Intelligence Assistant.\n\nAsk me about workforce competency gaps, AI question synthesis, cadre benchmark standards, or 2027 future skill projections!`
          : `Namaste **${user?.name || 'Officer'}**! I am **StatBot**, your AI Statistical Skill Intelligence Assistant.\n\nAsk me anything regarding your competencies, course recommendations, sampling methods, or learning roadmaps!`,
        suggestedActions: isAdm
          ? [
              { label: 'Workforce Skill Gaps', url: '/admin-gaps', promptText: 'What are the largest workforce skill gaps?' },
              { label: 'AI Assessment Synthesis', url: '/admin-generator', promptText: 'How do I generate an AI assessment for Survey Design?' },
              { label: '2027 Future Skills', url: '/admin-future', promptText: 'Show 2027 future skill projections' }
            ]
          : [
              { label: 'What should I learn next?', url: '/learning-path', promptText: 'What should I learn next?' },
              { label: 'Show my skill gaps', url: '/skill-gaps', promptText: 'What are my skill gaps?' },
              { label: 'Explain Stratified Sampling', url: '/assessment', promptText: 'Explain stratified sampling' }
            ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [user?.id, user?.role]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpenBot = (e: any) => {
      setIsOpen(true);
      if (e?.detail?.prompt) {
        handleSend(e.detail.prompt);
      }
    };
    window.addEventListener('statskill:open-bot', handleOpenBot);
    return () => window.removeEventListener('statskill:open-bot', handleOpenBot);
  }, [messages, sessionState, user]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const historyPayload = updatedMessages.map(m => ({
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp
      }));

      const res = await api.sendChatMessage(text, user?.id || 'u-1', historyPayload, sessionState);

      if (res.sessionContext) {
        setSessionState((prev: any) => ({ ...prev, ...res.sessionContext }));
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: res.answer || 'Thank you for your query.',
        cards: res.cards,
        suggestedActions: res.suggestedActions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error('Chat error', e);
      setMessages(prev => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          sender: 'bot',
          text: 'I am currently processing high statistical query volume. Please try again shortly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; url: string; promptText?: string }) => {
    if (action.promptText) {
      handleSend(action.promptText);
    } else {
      const tab = action.url.replace('/', '');
      if (onNavigate) onNavigate(tab);
      setIsOpen(false);
    }
  };

  const renderFormattedText = (text: string) => {
    return (
      <div className="space-y-1.5 leading-relaxed text-[11.5px]">
        {text.split('\n\n').map((para, pIdx) => {
          if (para.startsWith('```') && para.endsWith('```')) {
            const lines = para.split('\n');
            const code = lines.slice(1, -1).join('\n');
            return (
              <pre key={pIdx} className="bg-slate-900 text-amber-300 p-2.5 rounded-lg text-[10.5px] font-mono overflow-x-auto my-1">
                <code>{code}</code>
              </pre>
            );
          }
          return (
            <p key={pIdx} className="whitespace-pre-line">
              {para.split(/(\*\*.*?\*\*)/g).map((part, idx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={idx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-gradient-to-r from-gov-navy to-blue-700 text-white rounded-full shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 border-2 border-amber-400/80 group"
      >
        <Bot className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold pr-1">StatBot 🤖</span>
      </button>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 sm:w-[420px] max-w-[92vw] h-[550px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="gov-gradient-header text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-tight">StatBot Virtual Assistant</h4>
                <p className="text-[10px] text-blue-200">Official Statistical AI Mentor</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gov-navy text-white rounded-br-none shadow'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-line leading-relaxed text-[12px]">{msg.text}</p>
                  ) : (
                    renderFormattedText(msg.text)
                  )}
                </div>

                {/* Rich Cards Section */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="mt-2 space-y-2 w-full max-w-[90%]">
                    {msg.cards.map((c, cIdx) => (
                      <div key={cIdx} className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            c.type === 'course' ? 'bg-blue-100 text-blue-700' :
                            c.type === 'gap' ? 'bg-red-100 text-red-700' :
                            c.type === 'nssta' ? 'bg-purple-100 text-purple-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {c.type === 'course' ? <BookOpen className="w-3.5 h-3.5" /> :
                             c.type === 'gap' ? <Target className="w-3.5 h-3.5" /> :
                             c.type === 'nssta' ? <GraduationCap className="w-3.5 h-3.5" /> :
                             <Award className="w-3.5 h-3.5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[11px] text-slate-900 truncate">{c.title}</p>
                            {c.subtitle && <p className="text-[9.5px] text-slate-500 truncate">{c.subtitle}</p>}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          {c.badge && (
                            <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded ${
                              c.badgeColor === 'red' ? 'bg-red-100 text-red-700' :
                              c.badgeColor === 'green' ? 'bg-emerald-100 text-emerald-700' :
                              c.badgeColor === 'purple' ? 'bg-purple-100 text-purple-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {c.badge}
                            </span>
                          )}
                          {c.actionUrl && (
                            <button
                              onClick={() => { if (onNavigate && c.actionUrl) onNavigate(c.actionUrl.replace('/', '')); setIsOpen(false); }}
                              className="p-1 text-slate-400 hover:text-blue-600"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[92%]">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(action)}
                        className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition flex items-center space-x-1"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span className="text-[11px]">StatBot is analyzing statistical models...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex space-x-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend('What should I learn next?')}
              className="bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 hover:text-blue-700 whitespace-nowrap font-medium shadow-xs"
            >
              🎯 Next course?
            </button>
            <button
              onClick={() => handleSend('What are my skill gaps?')}
              className="bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 hover:text-blue-700 whitespace-nowrap font-medium shadow-xs"
            >
              🔴 Skill gaps
            </button>
            <button
              onClick={() => handleSend('Explain Stratified Sampling')}
              className="bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 hover:text-blue-700 whitespace-nowrap font-medium shadow-xs"
            >
              📊 Stratified vs Cluster
            </button>
            <button
              onClick={() => handleSend('Recommend a Python course')}
              className="bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 hover:text-blue-700 whitespace-nowrap font-medium shadow-xs"
            >
              🐍 Python course
            </button>
            <button
              onClick={() => handleSend('Give me a learning roadmap')}
              className="bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 hover:text-blue-700 whitespace-nowrap font-medium shadow-xs"
            >
              🧭 Roadmap
            </button>
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about statistics, courses, skill gaps, Python..."
              className="flex-1 bg-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2 bg-gov-navy text-white rounded-xl hover:bg-blue-800 disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
