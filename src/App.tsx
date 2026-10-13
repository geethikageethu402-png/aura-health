import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { HomeTopNavbar } from './components/home/HomeTopNavbar';
import { HeroSection } from './components/home/HeroSection';
import { ReportAnalyser } from './components/home/ReportAnalyser';
import { DoubtsVoiceChatbot } from './components/home/DoubtsVoiceChatbot';
import { HealthReminders } from './components/home/HealthReminders';
import { HighlightedQuote } from './components/home/HighlightedQuote';
import { MotivationQuotes } from './components/home/MotivationQuotes';
import { FeedbackSection } from './components/home/FeedbackSection';
import { EmergencyDisclaimer } from './components/home/EmergencyDisclaimer';

// Dashboard components strictly in requested sequence:
import { UserProfileSection } from './components/dashboard/UserProfileSection';
import { AppointmentsSection } from './components/dashboard/AppointmentsSection';
import { MedicalRecordsSection } from './components/dashboard/MedicalRecordsSection';
import { FutureRiskAlertSection } from './components/dashboard/FutureRiskAlertSection';
import { WellnessTrackerSection } from './components/dashboard/WellnessTrackerSection';
import { RegionalTranslatorSection } from './components/dashboard/RegionalTranslatorSection';
import { HealthSummarySection } from './components/dashboard/HealthSummarySection';
import { LogOutSection } from './components/dashboard/LogOutSection';

import { 
  initialUserProfile, 
  initialWellnessTracker, 
  initialMedicalRecords 
} from './data/mockHealthData';
import { UserProfile, WellnessTracker, MedicalRecord, ReportComparisonSet } from './types/health';
import { 
  ArrowUp, 
  Sparkles, 
  ShieldAlert, 
  LayoutDashboard 
} from 'lucide-react';

export default function App() {
  // Starts on Dashboard as requested
  const [activeTab, setActiveTab] = useState<'dashboard' | 'home'>('dashboard');
  const [currentSection, setCurrentSection] = useState<string>('section-user-profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Fresh user profile - starts plain without someone else's login
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aura_user_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  // Fresh medical records - starts empty without pre-filled reports
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('aura_medical_records');
    return saved ? JSON.parse(saved) : initialMedicalRecords;
  });

  const [wellness, setWellness] = useState<WellnessTracker>(() => {
    const saved = localStorage.getItem('aura_wellness_tracker');
    return saved ? JSON.parse(saved) : initialWellnessTracker;
  });

  const [initialChatQuery, setInitialChatQuery] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aura_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('aura_medical_records', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem('aura_wellness_tracker', JSON.stringify(wellness));
  }, [wellness]);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigateSection = (sectionId: string, targetTab?: 'dashboard' | 'home') => {
    if (targetTab && targetTab !== activeTab) {
      setActiveTab(targetTab);
    }
    setCurrentSection(sectionId);
    setIsSidebarOpen(false);

    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 120);
  };

  const handleAskDoubtAboutReport = (markerName: string) => {
    setInitialChatQuery(`Can you explain my results for "${markerName}" and what it means for my long-term health?`);
    handleNavigateSection('doubts-chatbot', 'home');
  };

  const handleOpenVoiceAssistant = () => {
    handleNavigateSection('doubts-chatbot', 'home');
  };

  const handleAddMedicalRecord = (rec: MedicalRecord) => {
    setMedicalRecords((prev) => [rec, ...prev]);
  };

  const handleSaveReportComparison = (reportSet: ReportComparisonSet) => {
    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      title: reportSet.reportName,
      category: 'Lab Report',
      date: new Date().toISOString().split('T')[0],
      doctor: 'Extracted via Multimodal AI Vision',
      facility: 'Laboratory Diagnostic Image Scan',
      summary: reportSet.executiveSummary,
      keyFindings: reportSet.biomarkers.map(
        (b) => `${b.name}: ${b.presentValue} ${b.unit} (${b.status})`
      ),
      status: reportSet.overallTrajectory === 'Positive' ? 'Normal' : 'Attention',
    };
    handleAddMedicalRecord(newRecord);
  };

  const handleLogOut = () => {
    localStorage.removeItem('aura_user_profile');
    localStorage.removeItem('aura_medical_records');
    localStorage.removeItem('aura_wellness_tracker');
    setUserProfile(initialUserProfile);
    setMedicalRecords([]);
    setWellness(initialWellnessTracker);
    setActiveTab('dashboard');
    handleNavigateSection('section-user-profile', 'dashboard');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. LEFT NAVIGATION BAR (ONLY DASHBOARD ITEMS, NO HOME FEATURES) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentSection={currentSection}
        onNavigateSection={handleNavigateSection}
        userProfile={userProfile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogOutClick={() => handleNavigateSection('section-log-out', 'dashboard')}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        
        {/* Top Navbar Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={userProfile}
          onOpenVoiceAssistant={handleOpenVoiceAssistant}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1">
          {activeTab === 'dashboard' ? (
            /* ========================================================= */
            /* DASHBOARD AT STARTING IN EXACT REQUIRED SEQUENCE:         */
            /* 1. User Profile                                           */
            /* 2. Appointments                                           */
            /* 3. Medical Records                                        */
            /* 4. Future Risk Alert                                      */
            /* 5. Wellness Tracker (water intake, exercises, etc.)       */
            /* 6. Regional Language Translator                           */
            /* 7. AI-Generated Health Summary                            */
            /* 8. Log Out (at the end of the dashboard)                  */
            /* ========================================================= */
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              
              {/* Dashboard Banner & Quick Jump Shortcut to Image Analyser */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
                    <span>Personal Health Dashboard</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {userProfile.name ? `Welcome, ${userProfile.name.split(' ')[0]}` : 'Welcome to Your Dashboard'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Your personal health cockpit. Set up your profile below to begin tracking.
                  </p>
                </div>

                <button
                  onClick={() => handleNavigateSection('report-analyser', 'home')}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer self-start md:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upload Report Image (Home Page)</span>
                </button>
              </div>

              {/* 1. USER PROFILE */}
              <UserProfileSection
                profile={userProfile}
                onUpdateProfile={setUserProfile}
              />

              {/* 2. APPOINTMENTS */}
              <AppointmentsSection />

              {/* 3. MEDICAL RECORDS */}
              <MedicalRecordsSection
                records={medicalRecords}
                onAddRecord={handleAddMedicalRecord}
              />

              {/* 4. FUTURE RISK ALERT */}
              <FutureRiskAlertSection />

              {/* 5. WELLNESS TRACKER (WATER INTAKE, EXERCISES, SLEEP, MEALS) */}
              <WellnessTrackerSection
                tracker={wellness}
                onUpdateTracker={setWellness}
              />

              {/* 6. REGIONAL LANGUAGE TRANSLATOR */}
              <RegionalTranslatorSection />

              {/* 7. AI-GENERATED HEALTH SUMMARY */}
              <HealthSummarySection
                userProfile={userProfile}
                wellness={wellness}
              />

              {/* 8. AT THE END OF THE DASHBOARD: LOG OUT */}
              <LogOutSection
                userProfile={userProfile}
                onLogOut={handleLogOut}
              />

              {/* Bottom Clinical Safety Badge */}
              <div className="pt-6 pb-2 text-center text-xs text-slate-400 border-t border-slate-200">
                <span className="flex items-center justify-center space-x-1 text-slate-500 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                  <span>Emergency SOS: Call 911 / 112 • Non-diagnostic AI Educational Copilot</span>
                </span>
              </div>

            </div>
          ) : (
            /* ========================================================= */
            /* HOME PAGE:                                                */
            /* - Home Features Navigation Bar AT THE TOP OF HOME PAGE    */
            /* - Hero Section                                            */
            /* - Report Image Analyser (Zero manual typing)              */
            /* - Doubts (AI chatbot including Voice Assistant)           */
            /* - Remainders (Meditation, Food, Appointments)             */
            /* - In the middle: "Build your consistency with our clarity"*/
            /* - Quotes for the motivation of health                     */
            /* - Feedback & Emergency Disclaimer                         */
            /* ========================================================= */
            <div className="space-y-0">
              {/* HOME FEATURES NAVIGATION BAR AT THE VERY TOP OF HOME PAGE */}
              <HomeTopNavbar onScrollTo={(id) => handleNavigateSection(id, 'home')} />

              {/* Hero Overview */}
              <HeroSection
                userProfile={userProfile}
                wellness={wellness}
                onNavigateToSection={(id) => handleNavigateSection(id, 'home')}
                onOpenDashboard={() => handleNavigateSection('section-user-profile', 'dashboard')}
                onOpenVoiceAssistant={handleOpenVoiceAssistant}
              />

              {/* Reports: Image-driven Report Analyser (Zero manual entry) */}
              <ReportAnalyser 
                onAskDoubtAboutReport={handleAskDoubtAboutReport}
                onSaveToRecords={handleSaveReportComparison}
              />

              {/* Doubts: AI Chatbot including Voice Assistant */}
              <DoubtsVoiceChatbot
                userProfile={userProfile}
                initialQuery={initialChatQuery}
                onClearInitialQuery={() => setInitialChatQuery('')}
              />

              {/* Remainders: Meditation intake, Food intake, Next appointments */}
              <HealthReminders />

              {/* IN THE MIDDLE OF HOME PAGE: HIGHLIGHTED QUOTATION */}
              <HighlightedQuote />

              {/* QUOTES FOR THE MOTIVATION OF HEALTH */}
              <MotivationQuotes />

              {/* AT THE END OF HOME PAGE: FEEDBACK */}
              <FeedbackSection />

              {/* AT THE END OF HOME PAGE: EMERGENCY DISCLAIMER */}
              <EmergencyDisclaimer />
            </div>
          )}
        </main>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-lg backdrop-blur-xs transition-all hover:scale-110 cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}


    </div>
  );
}
