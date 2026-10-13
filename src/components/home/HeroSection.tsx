import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  FileSearch, 
  Bot, 
  TrendingUp, 
  Activity, 
  Droplet, 
  Footprints,
  Calendar
} from 'lucide-react';
import { UserProfile, WellnessTracker } from '../../types/health';

interface HeroSectionProps {
  userProfile: UserProfile;
  wellness: WellnessTracker;
  onNavigateToSection: (sectionId: string) => void;
  onOpenDashboard: () => void;
  onOpenVoiceAssistant: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userProfile,
  wellness,
  onNavigateToSection,
  onOpenDashboard,
  onOpenVoiceAssistant,
}) => {
  const userName = userProfile.name?.trim();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-slate-50 to-white pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-200/60">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Greeting & Narrative */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Next-Generation Preventive Clinical Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {userName ? (
                <>Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-600">{userName.split(' ')[0]}</span>.</>
              ) : (
                <>Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-600">AuraHealth Copilot</span>.</>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Your AI-powered personal health copilot. 
              Upload an image of your medical reports to analyze and compare your checkups, clear your medical doubts with your voice assistant, and track daily human wellness.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                onClick={() => onNavigateToSection('report-analyser')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition-all cursor-pointer hover:shadow-lg"
              >
                <FileSearch className="w-4 h-4" />
                <span>Upload Report Image to Analyse</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onOpenVoiceAssistant}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4 text-teal-600" />
                <span>Ask Doubts (Voice AI)</span>
              </button>

              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Open Health Dashboard</span>
              </button>
            </div>

            {/* Live Clinical Metric Strip (Clean initial states) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200/70">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Vitality Score</p>
                <p className="text-xl font-bold text-slate-400 mt-0.5">-- <span className="text-xs font-normal text-slate-400">/ 100</span></p>
                <span className="text-[10px] text-slate-400 font-medium flex items-center mt-0.5">
                  Awaiting Lab Upload
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">HbA1c Trend</p>
                <p className="text-xl font-bold text-slate-400 mt-0.5">-- %</p>
                <span className="text-[10px] text-slate-400 font-medium flex items-center mt-0.5">
                  Pending Scan
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Blood Pressure</p>
                <p className="text-xl font-bold text-slate-400 mt-0.5">-- / --</p>
                <span className="text-[10px] text-slate-400 font-medium flex items-center mt-0.5">
                  Log in Dashboard
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Habit Streak</p>
                <p className="text-xl font-bold text-teal-700 mt-0.5">{wellness.streakDays} Days</p>
                <span className="text-[10px] text-teal-600 font-semibold flex items-center mt-0.5">
                  Track Daily Consistency
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Daily Sync Snapshot */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                    <Activity className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Copilot Daily Sync</h3>
                    <p className="text-xs text-slate-500">Live Health Snapshot</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold flex items-center space-x-1">
                  Ready to Track
                </span>
              </div>

              {/* Today's Mini Tracker Progress */}
              <div className="space-y-4 my-4">
                {/* Water progress */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600 flex items-center">
                      <Droplet className="w-3.5 h-3.5 text-blue-500 mr-1" /> Water Intake
                    </span>
                    <span className="text-slate-900 font-bold">{wellness.waterIntakeMl} / {wellness.waterTargetMl} mL</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (wellness.waterIntakeMl / wellness.waterTargetMl) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Steps progress */}
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600 flex items-center">
                      <Footprints className="w-3.5 h-3.5 text-emerald-500 mr-1" /> Daily Steps
                    </span>
                    <span className="text-slate-900 font-bold">{wellness.stepsCount.toLocaleString()} / {wellness.stepsTarget.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (wellness.stepsCount / wellness.stepsTarget) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Next Appointment Alert (Generic clean state) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3">
                  <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">Next Doctor Consultation</p>
                    <p className="text-slate-500 mt-0.5">No appointment scheduled. Book in Dashboard &gt; Appointments.</p>
                  </div>
                </div>
              </div>

              {/* Home Quick Jump Anchor Links */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <button
                  onClick={() => onNavigateToSection('report-analyser')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 transition-colors cursor-pointer"
                >
                  <FileSearch className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                  <span>Reports</span>
                </button>
                <button
                  onClick={() => onNavigateToSection('doubts-chatbot')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 transition-colors cursor-pointer"
                >
                  <Bot className="w-4 h-4 mx-auto mb-1 text-cyan-600" />
                  <span>Doubts AI</span>
                </button>
                <button
                  onClick={() => onNavigateToSection('reminders-section')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 transition-colors cursor-pointer"
                >
                  <Activity className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                  <span>Remainders</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
