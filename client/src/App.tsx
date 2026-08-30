import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { StatBot } from './components/bot/StatBot';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { OfficialDashboard } from './pages/official/OfficialDashboard';
import { OfficialProfile } from './pages/official/OfficialProfile';
import { CompetencyAssessment } from './pages/official/CompetencyAssessment';
import { SkillGapAnalysis } from './pages/official/SkillGapAnalysis';
import { LearningPath } from './pages/official/LearningPath';
import { CourseCatalogue } from './pages/official/CourseCatalogue';
import { NsstaProgrammes } from './pages/official/NsstaProgrammes';
import { QuizList } from './pages/official/QuizList';
import { TakeQuiz } from './pages/official/TakeQuiz';
import { NotificationsPage } from './pages/official/NotificationsPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLearningResources } from './pages/admin/AdminLearningResources';
import { AdminSkillGaps } from './pages/admin/AdminSkillGaps';
import { FutureSkillsPrediction } from './pages/admin/FutureSkillsPrediction';
import { TrainingEffectiveness } from './pages/admin/TrainingEffectiveness';
import { CompetencyFramework } from './pages/admin/CompetencyFramework';
import { AiQuizGenerator } from './pages/admin/AiQuizGenerator';
import { QuestionBankPage } from './pages/admin/QuestionBankPage';
import { AdminQuizManagement } from './pages/admin/AdminQuizManagement';

export const AppContent: React.FC = () => {
  const { user, role, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(role === 'admin' ? 'admin-dashboard' : 'dashboard');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Immediate Reactive Portal & Route Synchronization upon Role Change
  useEffect(() => {
    if (role === 'admin') {
      if (!activeTab.startsWith('admin-') && activeTab !== 'courses' && activeTab !== 'nssta' && activeTab !== 'profile' && activeTab !== 'notifications' && activeTab !== 'statbot') {
        setActiveTab('admin-dashboard');
      }
    } else {
      if (activeTab.startsWith('admin-')) {
        setActiveTab('dashboard');
      }
    }
    setSelectedQuizId(null);
  }, [role]);

  // If not logged in, show Landing Page by default
  if (!user && !isLoading) {
    if (activeTab === 'login') {
      return <LoginPage onLoginSuccess={() => setActiveTab(role === 'admin' ? 'admin-dashboard' : 'dashboard')} />;
    }
    return <LandingPage onGetStarted={() => setActiveTab('login')} />;
  }

  const handleTabChange = (newTab: string) => {
    setMobileMenuOpen(false);
    if (newTab === 'statbot') {
      window.dispatchEvent(new CustomEvent('statskill:open-bot'));
      return;
    }
    if (activeTab === 'take-quiz' && newTab !== 'take-quiz') {
      window.dispatchEvent(new CustomEvent('statskill:navigate-away', { detail: { newTab } }));
      setTimeout(() => setActiveTab(newTab), 250);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleStartQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setActiveTab('take-quiz');
  };

  const renderContent = () => {
    if (role === 'admin') {
      // Admin Portal Pages
      if (activeTab === 'admin-dashboard') return <AdminDashboard onNavigate={handleTabChange} />;
      if (activeTab === 'admin-resources') return <AdminLearningResources onNavigate={handleTabChange} />;
      if (activeTab === 'admin-question-bank') return <QuestionBankPage onNavigate={handleTabChange} />;
      if (activeTab === 'admin-quiz-management') return <AdminQuizManagement onNavigate={handleTabChange} />;
      if (activeTab === 'admin-gaps') return <AdminSkillGaps onNavigate={handleTabChange} />;
      if (activeTab === 'admin-future') return <FutureSkillsPrediction />;
      if (activeTab === 'admin-roi') return <TrainingEffectiveness />;
      if (activeTab === 'admin-framework') return <CompetencyFramework />;
      if (activeTab === 'admin-generator') return <AiQuizGenerator onNavigate={handleTabChange} />;
      if (activeTab === 'courses') return <CourseCatalogue />;
      if (activeTab === 'nssta') return <NsstaProgrammes />;
      if (activeTab === 'profile') return <OfficialProfile onStartAssessment={() => handleTabChange('admin-generator')} onNavigate={handleTabChange} />;
      if (activeTab === 'notifications') return <NotificationsPage onNavigate={handleTabChange} />;

      // Fallback to Admin Dashboard
      return <AdminDashboard onNavigate={handleTabChange} />;
    }

    // Official Portal Pages (role === 'official')
    if (activeTab === 'dashboard') return <OfficialDashboard onNavigate={handleTabChange} />;
    if (activeTab === 'profile') return <OfficialProfile onStartAssessment={() => handleTabChange('assessment')} onNavigate={handleTabChange} />;
    if (activeTab === 'assessment') return <CompetencyAssessment onNavigate={handleTabChange} />;
    if (activeTab === 'skill-gaps') return <SkillGapAnalysis onNavigate={handleTabChange} />;
    if (activeTab === 'learning-path') return <LearningPath onNavigate={handleTabChange} />;
    if (activeTab === 'courses') return <CourseCatalogue />;
    if (activeTab === 'nssta') return <NsstaProgrammes />;
    if (activeTab === 'quizzes') return <QuizList onStartQuiz={handleStartQuiz} onNavigate={handleTabChange} />;
    if (activeTab === 'take-quiz') return <TakeQuiz quizId={selectedQuizId || 'quiz-1'} onBack={() => handleTabChange('quizzes')} onNavigate={handleTabChange} />;
    if (activeTab === 'notifications') return <NotificationsPage onNavigate={handleTabChange} />;

    // Fallback to Official Dashboard
    return <OfficialDashboard onNavigate={handleTabChange} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header activeTab={activeTab} setActiveTab={handleTabChange} toggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex relative">
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} isMobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden w-full">
          {renderContent()}
        </main>
      </div>

      <Footer />
      <StatBot onNavigate={handleTabChange} />
    </div>
  );
};
