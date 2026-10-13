import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  RefreshCw, 
  Sparkles, 
  Heart, 
  Activity, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { FutureRisk } from '../../types/health';
import { initialFutureRisks } from '../../data/mockHealthData';

export const FutureRiskAlertSection: React.FC = () => {
  const [risks, setRisks] = useState<FutureRisk[]>(initialFutureRisks);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      // Simulate minor improvement recalculation based on updated vitals
      setRisks((prev) =>
        prev.map((r) =>
          r.id === 'risk-02'
            ? { ...r, score: Math.max(25, r.score - 4) }
            : r.id === 'risk-03'
            ? { ...r, score: Math.max(50, r.score - 6) }
            : r
        )
      );
      setIsRecalculating(false);
    }, 1200);
  };

  const toggleAction = (actionKey: string) => {
    setCompletedActions((prev) => ({ ...prev, [actionKey]: !prev[actionKey] }));
  };

  return (
    <div id="section-future-risk-alert" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
      {/* Section Header with Step Badge (04. Future Risk Alert) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
            04
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Future Risk Alert & Predictive Health Forecaster
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Preventive Projections
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              AI algorithms analyze multi-year biomarker trends and lifestyle markers to flag prospective risks
            </p>
          </div>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={isRecalculating}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin' : ''}`} />
          <span>{isRecalculating ? 'Re-calculating Projections...' : 'Re-calculate AI Risks'}</span>
        </button>
      </div>

      {/* Overview Callout Banner */}
      <div className="my-6 p-4 rounded-xl bg-gradient-to-r from-amber-50/70 via-slate-50 to-teal-50/50 border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-slate-900">
              Personalized Health Risk Engine: Metabolic, Cardiovascular & Lifestyle Forecaster
            </p>
            <p className="text-slate-600 mt-0.5">
              Future projections calculate personalized health trajectories in real time based on your vitals, daily wellness tracker logs, and uploaded lab report images.
            </p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-teal-800 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs shrink-0 self-start sm:self-auto">
          AI Confidence: 94.2%
        </span>
      </div>

      {/* Risk Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {risks.map((risk) => {
          const isHigh = risk.severity === 'High' || risk.severity === 'Critical';
          const isMod = risk.severity === 'Moderate';
          const isLow = risk.severity === 'Low';

          return (
            <div
              key={risk.id}
              className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                isHigh
                  ? 'bg-rose-50/40 border-rose-200/80 hover:border-rose-300'
                  : isMod
                  ? 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300'
                  : 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300'
              }`}
            >
              <div className="space-y-3">
                {/* Header Strip */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {risk.category}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : isMod
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {risk.severity} Risk ({risk.score}%)
                  </span>
                </div>

                {/* Risk Name */}
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {risk.riskName}
                </h3>

                {/* Score Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Projected Likelihood</span>
                    <span className="font-mono">{risk.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isHigh
                          ? 'bg-rose-500'
                          : isMod
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${risk.score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-400" />
                    Projected Time Horizon: {risk.timeframe}
                  </p>
                </div>

                {/* Biomarkers Involved */}
                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/60">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Biomarkers Under Watch:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {risk.biomarkersInvolved.map((bio, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                      >
                        {bio}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contributing Factors */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Contributing Factors:
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {risk.contributingFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preventive Actions Checklist */}
                <div className="pt-2 border-t border-slate-200/60">
                  <p className="text-[10px] font-bold text-teal-800 uppercase tracking-wider mb-1.5 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 text-teal-600" />
                    Actionable Prevention Protocol:
                  </p>
                  <div className="space-y-1.5">
                    {risk.preventiveActions.map((action, idx) => {
                      const key = `${risk.id}-${idx}`;
                      const isDone = completedActions[key];

                      return (
                        <label
                          key={idx}
                          className="flex items-start space-x-2 text-xs text-slate-700 bg-white/70 p-2 rounded-lg cursor-pointer hover:bg-white transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={!!isDone}
                            onChange={() => toggleAction(key)}
                            className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span className={isDone ? 'line-through text-slate-400' : ''}>
                            {action}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
