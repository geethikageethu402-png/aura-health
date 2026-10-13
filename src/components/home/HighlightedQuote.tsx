import React from 'react';
import { Sparkles, Quote, Compass, Target, ShieldCheck } from 'lucide-react';

export const HighlightedQuote: React.FC = () => {
  return (
    <section id="highlighted-quote-section" className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white overflow-hidden my-4 border-y border-teal-500/30">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        
        {/* Subtle pill header */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/40 text-teal-300 text-xs font-bold tracking-widest uppercase mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          <span>Core Philosophy</span>
        </div>

        {/* The Requested Highlighted Quote Box */}
        <div className="relative p-8 sm:p-12 rounded-3xl bg-white/[0.04] backdrop-blur-md border-2 border-teal-400/50 shadow-2xl shadow-teal-900/50">
          
          {/* Top quote icon */}
          <div className="w-12 h-12 mx-auto mb-6 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
            <Quote className="w-6 h-6" />
          </div>

          {/* EXACT QUOTE AS REQUESTED */}
          <blockquote className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            “<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-200 to-cyan-300 underline decoration-teal-400/60 decoration-wavy decoration-from-font">
              Build your consistency with our clarity
            </span>”
          </blockquote>

          {/* Explanatory subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Health is neither won in a single heroic sprint nor lost in a single day. 
            When clinical data becomes intuitive and transparent, daily wellness rituals become second nature.
          </p>

          {/* Three Pillars of Clarity Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-teal-500/30 text-left">
            <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/[0.03]">
              <Compass className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-teal-200 uppercase tracking-wider">Zero Ambiguity</p>
                <p className="text-xs text-slate-400 mt-0.5">Unpack confusing lab reports into plain, actionable language.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/[0.03]">
              <Target className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Daily Micro-Habits</p>
                <p className="text-xs text-slate-400 mt-0.5">Hydration, mindful breathwork, and meals logged effortlessly.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/[0.03]">
              <ShieldCheck className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Predictive Foresight</p>
                <p className="text-xs text-slate-400 mt-0.5">Catch cardiovascular and metabolic shifts years ahead of symptoms.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
