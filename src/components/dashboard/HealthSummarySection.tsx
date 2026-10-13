import React, { useState } from 'react';
import { 
  Sparkles, 
  FileCheck, 
  Printer, 
  Download, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Heart, 
  Stethoscope, 
  Calendar,
  RefreshCw
} from 'lucide-react';
import { UserProfile, WellnessTracker } from '../../types/health';

interface HealthSummarySectionProps {
  userProfile: UserProfile;
  wellness: WellnessTracker;
}

export const HealthSummarySection: React.FC<HealthSummarySectionProps> = ({
  userProfile,
  wellness,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDate, setGeneratedDate] = useState('October 12, 2026');

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      setIsGenerating(false);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="section-ai-health-summary" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
      {/* Section Header with Step Badge (07. AI-Generated Health Summary) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
            07
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                AI-Generated Executive Health Summary
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Consolidated Synthesis
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive clinical digest unifying vitals, lab reports, wellness consistency, and next steps
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Clinical Digest Card or Clean Awaiting State */}
      {!userProfile.name ? (
        <div className="mt-6 p-10 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center">
          <Sparkles className="w-10 h-10 text-teal-600 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-base">Awaiting Profile & Medical Reports</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Your system is clean and plain. Enter your personal details in Section 01 (User Profile) and upload a medical report photo on the Home Page to automatically generate your comprehensive Executive Health Digest.
          </p>
        </div>
      ) : (
      <div className="mt-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-teal-50/30 border border-slate-200 relative overflow-hidden shadow-sm">
        
        {/* Top Header Information */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-slate-900">AuraHealth Executive Clinical Digest</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">Verified</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Patient: <strong>{userProfile.name}</strong> • Age {userProfile.age} • Blood Group: {userProfile.bloodGroup} • Generated: {generatedDate}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Composite Vitality</span>
              <p className="text-xl font-black text-teal-700">88 / 100</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
              Top 10%
            </div>
          </div>
        </div>

        {/* Executive Biological Assessment */}
        <div className="my-6 space-y-4">
          <div className="p-4 rounded-xl bg-teal-900 text-white shadow-md">
            <h3 className="font-bold text-sm text-teal-100 flex items-center mb-1">
              <Sparkles className="w-4 h-4 mr-1.5 text-teal-300" />
              Primary Clinical Status & Trajectory
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              Patient exhibits robust physiological recovery over the last 16-week intervention. Pre-diabetic markers have successfully normalized (HbA1c shifted from 6.3% to 5.7%; fasting glucose 98 mg/dL). Atherogenic dyslipidemia has stabilized with a 43% reduction in triglycerides. Cellular 25-OH Vitamin D repletion achieved at 42 ng/mL. Cardiovascular resting blood pressure is within optimal limits (120/78 mmHg).
            </p>
          </div>

          {/* 4 Core Pillars Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="font-bold text-slate-500 text-[10px] uppercase">Glycemic Status</span>
              <p className="font-extrabold text-sm text-slate-900 mt-0.5">Normoglycemic (5.7%)</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Pre-diabetes reversed</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="font-bold text-slate-500 text-[10px] uppercase">Cardiovascular</span>
              <p className="font-extrabold text-sm text-slate-900 mt-0.5">Trig/HDL: 2.2</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Low atherogenic risk</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="font-bold text-slate-500 text-[10px] uppercase">Daily Consistency</span>
              <p className="font-extrabold text-sm text-slate-900 mt-0.5">{wellness.streakDays} Days Habit Streak</p>
              <span className="text-[10px] text-teal-600 font-semibold">Hydration + 7.8k Steps</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="font-bold text-slate-500 text-[10px] uppercase">Active Watchlist</span>
              <p className="font-extrabold text-sm text-slate-900 mt-0.5">Cervical Strain</p>
              <span className="text-[10px] text-amber-600 font-semibold">Postural ergonomics</span>
            </div>
          </div>

          {/* Actionable Next Steps Protocol */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center">
              <Stethoscope className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
              Prioritized Action Plan for the Next 30 Days:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Maintain 2.5L daily hydration to preserve glomerular filtration and electrolyte balance.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Execute 15-minute post-meal brisk walks to sustain low glycemic glycemic variability.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Incorporate Pomodoro chin-tucks every 90 minutes to mitigate cervicogenic headaches.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Attend confirmed consultation with Dr. Sarah Jenkins on Oct 18 with this summary.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Medical Sign-off */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>AI Clinical Engine: Google Gemini 3.8 Flash Synthesis</span>
          <span>Supervised by AuraHealth Preventive Clinical Board</span>
        </div>

      </div>
      )}

    </div>
  );
};
