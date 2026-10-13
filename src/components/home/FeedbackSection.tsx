import React, { useState } from 'react';
import { 
  MessageSquareHeart, 
  Star, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ThumbsUp,
  User
} from 'lucide-react';
import { FeedbackSubmission } from '../../types/health';
import { initialFeedbacks } from '../../data/mockHealthData';

export const FeedbackSection: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>(initialFeedbacks);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FeedbackSubmission['category']>('Report Comparison');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newFeedback: FeedbackSubmission = {
      id: `fb-${Date.now()}`,
      name: name.trim() || 'Anonymous Patient',
      rating,
      category,
      message: message.trim(),
      date: 'Just now',
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setMessage('');
    setName('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="feedback-section" className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <MessageSquareHeart className="w-3.5 h-3.5 text-teal-600" />
            <span>Patient Experience & Continuous Improvement</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Share Your Experience with AuraHealth
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Your feedback directly refines our clinical AI report models, voice responsiveness, and privacy protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Feedback Input Form */}
          <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center">
              <span>Submit Your Feedback</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Rate your copilot interaction and share your suggestions.
            </p>

            {submitted && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your feedback has been received and added to our clinical review board.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Star Rating */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  How satisfied are you with the Copilot's clarity?
                </label>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          (hoverRating !== null ? star <= hoverRating : star <= rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-slate-700 text-xs">
                    {hoverRating || rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Feedback Topic
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-teal-600"
                >
                  <option value="Report Comparison">Report Comparison & Lab Deltas</option>
                  <option value="Voice Assistant">Voice Assistant & AI Doubts</option>
                  <option value="AI Accuracy">Clinical Explanation Quality</option>
                  <option value="General UX">Dashboard Usability & Speed</option>
                </select>
              </div>

              {/* Patient Name (Optional) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex R. or Anonymous"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-teal-600"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your Review & Observations
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder="Tell us what worked well or what health features you would like us to add..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-teal-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Patient Feedback</span>
              </button>
            </form>
          </div>

          {/* Recent Reviews Ledger */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-800">
                Recent Patient Feedback & Experiences
              </h3>
              <span className="text-xs font-semibold text-teal-700">
                ⭐ 4.9 Average Patient Rating
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs space-y-2 hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                        {fb.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900">{fb.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">{fb.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-0.5">
                      {[...Array(fb.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-100 uppercase tracking-wider">
                    {fb.category}
                  </span>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    "{fb.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
