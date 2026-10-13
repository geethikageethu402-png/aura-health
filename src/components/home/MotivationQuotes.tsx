import React, { useState } from 'react';
import { 
  Sparkles, 
  Quote, 
  Shuffle, 
  Heart, 
  Copy, 
  Check, 
  Award, 
  Compass, 
  Flame,
  Sun
} from 'lucide-react';
import { HealthQuote } from '../../types/health';
import { healthMotivationalQuotes } from '../../data/mockHealthData';

export const MotivationQuotes: React.FC = () => {
  const [quotes] = useState<HealthQuote[]>(healthMotivationalQuotes);
  const [featuredQuoteIndex, setFeaturedQuoteIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['q-1', 'q-4']);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const featuredQuote = quotes[featuredQuoteIndex];

  const handleShuffle = () => {
    let nextIdx = Math.floor(Math.random() * quotes.length);
    if (nextIdx === featuredQuoteIndex) {
      nextIdx = (featuredQuoteIndex + 1) % quotes.length;
    }
    setFeaturedQuoteIndex(nextIdx);
  };

  const handleCopy = (id: string, text: string, author: string) => {
    navigator.clipboard.writeText(`"${text}" — ${author}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const categories = ['All', ...Array.from(new Set(quotes.map((q) => q.theme)))];

  const filteredQuotes = quotes.filter((q) => {
    if (filterCategory === 'All') return true;
    return q.theme === filterCategory;
  });

  return (
    <section id="motivation-quotes-section" className="py-14 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-semibold mb-2">
              <Sun className="w-3.5 h-3.5 text-emerald-600" />
              <span>Daily Fuel for Biological Harmony</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Quotes for Health Motivation & Vitality
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
              Timeless wisdom from pioneers of medicine, philosophy, and wellness to inspire your daily consistency.
            </p>
          </div>

          <button
            onClick={handleShuffle}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start md:self-end"
          >
            <Shuffle className="w-4 h-4" />
            <span>Shuffle Featured Wisdom</span>
          </button>
        </div>

        {/* Featured Large Daily Anchor Quote Card */}
        <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/40 rounded-full blur-2xl pointer-events-none -z-0" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wider">
                Today’s Focal Inspiration • {featuredQuote.theme}
              </span>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug italic">
                “{featuredQuote.quote}”
              </p>
              <p className="text-sm font-semibold text-teal-700">
                — {featuredQuote.author}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => toggleFavorite(featuredQuote.id)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  favorites.includes(featuredQuote.id)
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                }`}
                title="Save to favorites"
              >
                <Heart className={`w-4 h-4 ${favorites.includes(featuredQuote.id) ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => handleCopy(featuredQuote.id, featuredQuote.quote, featuredQuote.author)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Copy quote"
              >
                {copiedId === featuredQuote.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 pb-3 mb-6 overflow-x-auto border-b border-slate-200/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filterCategory === cat
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Motivational Quotes Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredQuotes.map((q) => {
            const isFav = favorites.includes(q.id);

            return (
              <div
                key={q.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                      {q.theme}
                    </span>
                    <button
                      onClick={() => toggleFavorite(q.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed italic">
                    “{q.quote}”
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {q.author}
                  </span>

                  <button
                    onClick={() => handleCopy(q.id, q.quote, q.author)}
                    className="text-slate-400 hover:text-teal-700 transition-colors cursor-pointer"
                    title="Copy quote"
                  >
                    {copiedId === q.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
