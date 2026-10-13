import React from 'react';
import { 
  FileSearch, 
  Bot, 
  BellRing, 
  Quote, 
  Sun, 
  MessageSquareHeart, 
  ShieldAlert 
} from 'lucide-react';

interface HomeTopNavbarProps {
  onScrollTo: (sectionId: string) => void;
}

export const HomeTopNavbar: React.FC<HomeTopNavbarProps> = ({ onScrollTo }) => {
  const homeSections = [
    { id: 'report-analyser', label: 'Report Analyser (Upload Image)', icon: FileSearch },
    { id: 'doubts-chatbot', label: 'Doubts (Voice Assistant)', icon: Bot },
    { id: 'reminders-section', label: 'Remainders (Meditation/Food)', icon: BellRing },
    { id: 'highlighted-quote-section', label: 'Consistency & Clarity Quote', icon: Quote },
    { id: 'motivation-quotes-section', label: 'Health Motivation', icon: Sun },
    { id: 'feedback-section', label: 'Feedback', icon: MessageSquareHeart },
    { id: 'emergency-disclaimer', label: 'Emergency Disclaimer', icon: ShieldAlert, isEmergency: true },
  ];

  return (
    <div id="home-top-section" className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline">
          Home Features:
        </span>

        <div className="flex items-center space-x-2 shrink-0">
          {homeSections.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onScrollTo(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  item.isEmergency
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 hover:border-teal-200 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.isEmergency ? 'text-rose-600' : 'text-teal-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
