import React from 'react';
import {
  Sparkles, Target, Compass, BookOpen, GraduationCap,
  Shield, BarChart2, TrendingUp, CheckCircle2, ArrowRight,
  BrainCircuit, Users, Award, Lock, FileCode2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const { loginAs } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Government Bar */}
      <div className="tricolor-strip w-full" />
      <div className="bg-gov-navy text-white text-xs py-2 px-4 border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold tracking-wide">भारत सरकार • Government of India</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">Ministry of Statistics and Programme Implementation (MoSPI)</span>
          </div>
          <div className="text-[11px] font-medium text-amber-300">
            Smart India Hackathon (SIH 2026) Prototype
          </div>
        </div>
      </div>

      {/* Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gov-navy flex items-center justify-center text-white shadow-md">
              <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9.8L4.2 7 12 3.1 19.8 7 12 11.8zM2 17l10 5 10-5v-2l-10 5-10-5v2z"/>
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold text-gov-navy tracking-tight">StatSkill AI</span>
              <p className="text-[10px] font-semibold text-slate-500">Official Statistical Skill Intelligence</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => loginAs('official')}
              className="text-xs font-bold text-slate-700 px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition cursor-pointer"
            >
              Official Login
            </button>
            <button
              type="button"
              onClick={() => loginAs('admin')}
              className="text-xs font-bold text-slate-700 px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition cursor-pointer"
            >
              Administrator Login
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="text-xs font-bold text-white bg-gov-blue hover:bg-blue-800 px-4 py-2 rounded-lg shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 gov-hero-gradient border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-3.5 py-1 text-xs font-bold text-blue-800">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Empowering India's Statistical Workforce with AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-gov-navy tracking-tight leading-tight">
                AI-Powered Skill Intelligence for India's Official Statistical Workforce
              </h1>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Assess competencies, discover skill gaps, and receive personalized learning pathways aligned with job roles, organizational requirements, and future digital-statistics skills.
              </p>

              {/* Central Value Proposition Callout */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-500 rounded-r-xl text-slate-700 text-xs font-medium">
                «<strong>Don't search for what to learn.</strong> Let AI identify what you need to learn next.»
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => loginAs('official')}
                  className="px-6 py-3.5 bg-gov-navy text-white text-sm font-bold rounded-xl shadow-lg hover:bg-blue-900 transition flex items-center space-x-2 cursor-pointer"
                >
                  <span>Get Started (Official Demo)</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  type="button"
                  onClick={() => loginAs('admin')}
                  className="px-6 py-3.5 bg-white text-slate-800 border border-slate-300 text-sm font-bold rounded-xl shadow-sm hover:bg-slate-50 transition flex items-center space-x-2 cursor-pointer"
                >
                  <span>Explore Platform (Admin View)</span>
                </button>
              </div>

              {/* Trust & Architecture Badges */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-semibold">
                <div className="flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Role-Based Access</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>DPDP 2023 Ready</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <BrainCircuit className="w-4 h-4 text-purple-600" />
                  <span>Adaptive AI Engine</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>iGOT & NSSTA Integrated</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200/90 relative z-10 text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">Live Skill Intelligence Matrix</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Rajesh Sharma</h4>
                    <p className="text-[11px] text-slate-500">Statistical Officer, MoSPI</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600">72%</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Readiness</p>
                  </div>
                </div>

                {/* Progress bars preview */}
                <div className="space-y-2.5 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Statistics & Sampling</span>
                      <span className="text-emerald-700 font-bold">90% (Adv)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[90%] rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Python for Official Statistics</span>
                      <span className="text-orange-600 font-bold">42% (High Gap)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full w-[42%] rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">AI & Machine Learning</span>
                      <span className="text-red-600 font-bold">35% (High Gap)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full w-[35%] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Alert */}
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 text-xs">
                  <div className="flex items-center space-x-1.5 text-blue-900 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    <span>AI Matched Recommendation (94%)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    "Python for Statistical Data Analysis" enrolled on iGOT Karmayogi to address your primary cadre gap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Feature Cards Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-gov-blue uppercase tracking-wider">Enterprise Capabilities</span>
            <h2 className="text-3xl font-extrabold text-gov-navy mt-1">Platform Core Features</h2>
            <p className="text-sm text-slate-600 mt-2">
              Engineered specifically for the demands of the Indian Official Statistical System.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="gov-card p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">1. AI Competency Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adaptive, real-time evaluation that automatically adjusts question difficulty based on answers, generating deep statistical competency scores.
              </p>
            </div>

            <div className="gov-card p-6">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">2. Intelligent Skill-Gap Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated role-based benchmarking comparing current official competencies against cadre requirements with severity color-coding.
              </p>
            </div>

            <div className="gov-card p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">3. Personalized Learning Pathways</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dynamic 4-Phase visual roadmaps (Foundation $\to$ Applied $\to$ Advanced $\to$ Domain Application) guiding officials step-by-step.
              </p>
            </div>

            <div className="gov-card p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">4. iGOT Karmayogi Integration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamless API architecture linking verified courses with 6-factor AI matching scores and contextual 'Why this course?' rationales.
              </p>
            </div>

            <div className="gov-card p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">5. AI Quiz Generator ⭐</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trainers upload PDF/PPT/DOC materials; AI instantly extracts statistical knowledge to generate, edit, and publish customized certification exams.
              </p>
            </div>

            <div className="gov-card p-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">6. Workforce Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Executive dashboard for NSSTA & MoSPI directors tracking cadre competency distributions, department matrices, and 5-year future skill forecasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works: 5-Step Process */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-gov-blue uppercase tracking-wider">Methodology</span>
            <h2 className="text-3xl font-extrabold text-gov-navy mt-1">How It Works — The Closed Loop</h2>
            <p className="text-sm text-slate-600 mt-2">
              Continuous competency lifecycle for India's statistical officers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-extrabold text-xs flex items-center justify-center mb-3">
                01
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Build Profile</h4>
              <p className="text-[11px] text-slate-500">Capture designation, cadre, previous trainings & skill levels.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center mb-3">
                02
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Assess Skills</h4>
              <p className="text-[11px] text-slate-500">Interactive adaptive tests test sampling, Python, and accounts.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center mb-3">
                03
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Identify Gaps</h4>
              <p className="text-[11px] text-slate-500">AI compares scores against national cadre benchmarks.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center mb-3">
                04
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Learn</h4>
              <p className="text-[11px] text-slate-500">Engage tailored iGOT courses and NSSTA residential modules.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center mb-3">
                05
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-1">Improve & Reassess</h4>
              <p className="text-[11px] text-slate-500">Complete AI quizzes, dynamically upgrade competency profile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Realistic Platform Statistics Section */}
      <section className="py-16 bg-gov-navy text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Simulated Platform Impact</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Statistical Workforce Metrics</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-4xl font-extrabold text-amber-400">12,450+</span>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Officials Enrolled</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-4xl font-extrabold text-blue-400">78,420</span>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Courses Completed</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-4xl font-extrabold text-emerald-400">3.2M</span>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Learning Hours</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-4xl font-extrabold text-orange-400">68%</span>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Average Competency</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
