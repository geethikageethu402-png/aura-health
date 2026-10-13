import React from 'react';
import { 
  User, 
  CalendarClock, 
  FileText, 
  ShieldAlert, 
  Activity, 
  Languages, 
  Sparkles, 
  LogOut, 
  Home, 
  LayoutDashboard, 
  HeartPulse, 
  ChevronRight,
  PhoneCall,
  X
} from 'lucide-react';
import { UserProfile } from '../types/health';

interface SidebarProps {
  activeTab: 'dashboard' | 'home';
  setActiveTab: (tab: 'dashboard' | 'home') => void;
  currentSection: string;
  onNavigateSection: (sectionId: string, targetTab?: 'dashboard' | 'home') => void;
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLogOutClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentSection,
  onNavigateSection,
  userProfile,
  isOpen,
  onClose,
  onLogOutClick,
}) => {
  // STRICTLY THE 8 DASHBOARD ITEMS IN REQUESTED SEQUENCE:
  const dashboardMenuItems = [
    { id: 'section-user-profile', num: '01', label: 'User Profile', icon: User },
    { id: 'section-appointments', num: '02', label: 'Appointments', icon: CalendarClock },
    { id: 'section-medical-records', num: '03', label: 'Medical Records', icon: FileText },
    { id: 'section-future-risk-alert', num: '04', label: 'Future Risk Alert', icon: ShieldAlert },
    { id: 'section-wellness-tracker', num: '05', label: 'Wellness Tracker', icon: Activity },
    { id: 'section-regional-translator', num: '06', label: 'Regional Translator', icon: Languages },
    { id: 'section-ai-health-summary', num: '07', label: 'AI Health Summary', icon: Sparkles },
    { id: 'section-log-out', num: '08', label: 'Log Out', icon: LogOut, isLogout: true },
  ];

  const hasName = Boolean(userProfile.name?.trim());

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Left Navigation Bar - Dedicated exclusively to Dashboard Navigation */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-200/90 shadow-xl lg:shadow-none flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Sidebar Top Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div 
              onClick={() => onNavigateSection('section-user-profile', 'dashboard')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-teal-700">
                    AuraHealth
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 border border-teal-200">
                    Copilot
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Health Dashboard
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account State Banner */}
          <div className="px-4 py-3 mx-4 my-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs ring-2 ring-teal-500/20 shrink-0">
                <User className="w-4 h-4 text-teal-700" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {hasName ? userProfile.name : 'New Patient'}
                </p>
                <p className="text-[10px] text-teal-600 font-semibold">
                  {hasName ? `${userProfile.bloodGroup || 'Blood Group N/A'} • BMI ${userProfile.bmi || '--'}` : 'Profile Pending Setup'}
                </p>
              </div>
            </div>
          </div>

          {/* View Mode Toggle: Dashboard vs Home Page */}
          <div className="px-4 pb-2">
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  onNavigateSection('section-user-profile', 'dashboard');
                }}
                className={`py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('home');
                  onNavigateSection('home-top-section', 'home');
                }}
                className={`py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home Page</span>
              </button>
            </div>
          </div>

          {/* DASHBOARD NAVIGATION LIST (STRICTLY CONTAINS ONLY DASHBOARD ITEMS) */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 text-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Dashboard Navigation
            </p>
            <nav className="space-y-1">
              {dashboardMenuItems.map((item) => {
                const Icon = item.icon;
                const isCurrent = activeTab === 'dashboard' && currentSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.isLogout) {
                        onLogOutClick();
                      } else {
                        onNavigateSection(item.id, 'dashboard');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      item.isLogout
                        ? 'text-rose-600 hover:bg-rose-50 font-bold border border-transparent hover:border-rose-200 mt-2'
                        : isCurrent
                        ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={`text-[10px] font-mono font-bold ${item.isLogout ? 'text-rose-500' : 'text-slate-400'}`}>
                        {item.num}
                      </span>
                      <Icon className={`w-4 h-4 ${item.isLogout ? 'text-rose-500' : isCurrent ? 'text-teal-600' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
            <a
              href="tel:911"
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency SOS: 911</span>
            </a>
          </div>

        </div>
      </aside>
    </>
  );
};
