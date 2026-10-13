import React from 'react';
import { 
  Menu, 
  PhoneCall, 
  Mic, 
  HeartPulse,
  LayoutDashboard,
  Home,
  Sparkles,
  User
} from 'lucide-react';
import { UserProfile } from '../types/health';

interface NavbarProps {
  activeTab: 'dashboard' | 'home';
  setActiveTab: (tab: 'dashboard' | 'home') => void;
  userProfile: UserProfile;
  onOpenVoiceAssistant: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenVoiceAssistant,
  onToggleSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs h-16 flex items-center">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Section: Mobile Menu Button & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 lg:hidden cursor-pointer transition-colors"
            title="Open Left Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
              {activeTab === 'dashboard' ? 'Health Dashboard' : 'Home Page'}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 hidden sm:inline-block">
              {activeTab === 'dashboard' ? 'Sequential View' : 'Copilot Portal'}
            </span>
          </div>
        </div>

        {/* View Switcher Tabs (Dashboard vs Home) */}
        <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
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
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Page</span>
          </button>
        </div>

        {/* Right Tools & Badges */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Voice Assistant Trigger */}
          <button
            onClick={onOpenVoiceAssistant}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-semibold transition-colors cursor-pointer"
            title="Ask Voice AI Doubts Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-teal-600 animate-bounce" />
            <span className="hidden sm:inline">Voice Assistant</span>
          </button>

          {/* Emergency Alert Hotline */}
          <a
            href="tel:911"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors"
            title="Emergency SOS: Call 911 / 112"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-600" />
            <span>SOS 911</span>
          </a>

          {/* User Profile Mini Badge */}
          <div className="flex items-center space-x-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs ring-2 ring-teal-500/20">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-teal-700" />}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
