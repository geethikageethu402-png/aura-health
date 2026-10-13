import React, { useState } from 'react';
import { 
  Activity, 
  Droplets, 
  Footprints, 
  Dumbbell, 
  Flame, 
  Moon, 
  Utensils, 
  Smile, 
  Plus, 
  RotateCcw, 
  Check, 
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';
import { WellnessTracker } from '../../types/health';

interface WellnessTrackerSectionProps {
  tracker: WellnessTracker;
  onUpdateTracker: (updated: WellnessTracker) => void;
}

export const WellnessTrackerSection: React.FC<WellnessTrackerSectionProps> = ({
  tracker,
  onUpdateTracker,
}) => {
  const [data, setData] = useState<WellnessTracker>(tracker);
  const [showMealModal, setShowMealModal] = useState(false);
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Lunch');
  const [mealDesc, setMealDesc] = useState('');
  const [mealCals, setMealCals] = useState('450');

  const addWater = (amountMl: number) => {
    const updated = {
      ...data,
      waterIntakeMl: Math.max(0, data.waterIntakeMl + amountMl),
    };
    setData(updated);
    onUpdateTracker(updated);
  };

  const addSteps = (amount: number) => {
    const updated = {
      ...data,
      stepsCount: data.stepsCount + amount,
    };
    setData(updated);
    onUpdateTracker(updated);
  };

  const addExercise = (mins: number, cals: number) => {
    const updated = {
      ...data,
      exerciseMinutes: data.exerciseMinutes + mins,
      caloriesBurned: data.caloriesBurned + cals,
    };
    setData(updated);
    onUpdateTracker(updated);
  };

  const setMood = (mood: WellnessTracker['mood']) => {
    const updated = { ...data, mood };
    setData(updated);
    onUpdateTracker(updated);
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealDesc) return;
    const updated = {
      ...data,
      mealsLogged: [
        ...data.mealsLogged,
        {
          meal: mealType,
          description: mealDesc,
          calories: Number(mealCals) || 300,
          healthScore: 'Healthy' as const,
        },
      ],
    };
    setData(updated);
    onUpdateTracker(updated);
    setMealDesc('');
    setShowMealModal(false);
  };

  const waterPct = Math.min(100, Math.round((data.waterIntakeMl / data.waterTargetMl) * 100));
  const stepsPct = Math.min(100, Math.round((data.stepsCount / data.stepsTarget) * 100));
  const exercisePct = Math.min(100, Math.round((data.exerciseMinutes / data.exerciseTarget) * 100));

  return (
    <div id="section-wellness-tracker" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
      {/* Section Header with Step Badge (05. Wellness Tracker) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
            05
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Wellness Tracker: Basic Human Activities
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                Daily Vitals & Habits
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking for hydration, physical exercise, restorative sleep, nutrition, and mood consistency
            </p>
          </div>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 self-start sm:self-auto">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-amber-900">
            {data.streakDays} Day Habit Streak Active
          </span>
        </div>
      </div>

      {/* Main Trackers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        
        {/* 1. Water Intake Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-blue-900 flex items-center">
                <Droplets className="w-4 h-4 text-blue-600 mr-1.5" />
                Water Intake & Hydration
              </span>
              <span className="text-xs font-bold text-blue-700 font-mono">
                {waterPct}%
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-black text-slate-900 font-mono">
                  {data.waterIntakeMl}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  / {data.waterTargetMl} mL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Approx. {Math.round(data.waterIntakeMl / 250)} of 10 glasses consumed
              </p>
            </div>

            {/* Visual Glass Fill Bar */}
            <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden my-3">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${waterPct}%` }}
              />
            </div>
          </div>

          {/* Quick Water Logging Buttons */}
          <div className="pt-3 border-t border-blue-100 flex items-center justify-between gap-2">
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs text-center"
            >
              +250 mL (1 Cup)
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-1.5 px-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              +500 mL (Bottle)
            </button>
            <button
              onClick={() => addWater(-250)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              title="Undo last log"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Physical Exercise & Steps Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-900 flex items-center">
                <Footprints className="w-4 h-4 text-emerald-600 mr-1.5" />
                Steps & Physical Activity
              </span>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                {stepsPct}%
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-black text-slate-900 font-mono">
                  {data.stepsCount.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  / {data.stepsTarget.toLocaleString()} steps
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1">
                <span className="flex items-center">
                  <Dumbbell className="w-3 h-3 text-emerald-600 mr-1" />
                  {data.exerciseMinutes} / {data.exerciseTarget} mins active
                </span>
                <span className="flex items-center">
                  <Flame className="w-3 h-3 text-amber-500 mr-1" />
                  {data.caloriesBurned} kcal
                </span>
              </div>
            </div>

            {/* Visual Steps Progress Bar */}
            <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden my-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${stepsPct}%` }}
              />
            </div>
          </div>

          {/* Quick Steps / Activity Buttons */}
          <div className="pt-3 border-t border-emerald-100 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                addSteps(1500);
                addExercise(15, 90);
              }}
              className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs text-center"
            >
              +1,500 Steps Walk
            </button>
            <button
              onClick={() => {
                addSteps(3000);
                addExercise(30, 210);
              }}
              className="flex-1 py-1.5 px-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              +30m Workout
            </button>
          </div>
        </div>

        {/* 3. Sleep & Restorative Recovery */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-50/60 to-white border border-purple-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-purple-900 flex items-center">
                <Moon className="w-4 h-4 text-purple-600 mr-1.5" />
                Sleep Duration & Recovery
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {data.sleepQuality} Quality
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-black text-slate-900 font-mono">
                  {data.sleepHours}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Hours recorded
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Target: 7.0 - 8.5 hrs • Deep sleep ratio 22%
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-purple-100 text-center text-xs">
              <div className="bg-white p-1.5 rounded-lg border border-purple-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">REM</p>
                <p className="font-bold text-purple-800">1h 45m</p>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-purple-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Deep</p>
                <p className="font-bold text-purple-800">1h 38m</p>
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-purple-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Score</p>
                <p className="font-bold text-purple-800">89/100</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-purple-100">
            <span className="text-[11px] text-purple-700 font-medium">
              ✨ Sleep architecture consistent with optimal glycemic recovery
            </span>
          </div>
        </div>

      </div>

      {/* Lower Row: Nutrition Food Log & Mood Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Meals & Nutrition Tracker */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Food Intake & Nutrition Digest
              </h3>
            </div>
            <button
              onClick={() => setShowMealModal(true)}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Meal</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {data.mealsLogged.map((m, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{m.meal}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {m.healthScore}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{m.description}</p>
                </div>
                <span className="font-mono font-bold text-slate-700 shrink-0">
                  {m.calories} kcal
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mood & Stress State */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Smile className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Current Mood & Energy State
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Daily nervous system reflection:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {(['Energized', 'Calm', 'Fatigued', 'Stressed'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    data.mood === m
                      ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {m === 'Energized' && '⚡ '}
                  {m === 'Calm' && '🌿 '}
                  {m === 'Fatigued' && '🔋 '}
                  {m === 'Stressed' && '🌪️ '}
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
            Selected: <span className="font-bold text-teal-700">{data.mood}</span> • Calibrated with HRV
          </div>
        </div>

      </div>

      {/* Log Meal Modal */}
      {showMealModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Log Nutrition / Meal</h3>
              <button
                onClick={() => setShowMealModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddMeal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meal Time</label>
                <select
                  value={mealType}
                  onChange={(e: any) => setMealType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks / Smoothie</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meal Description</label>
                <input
                  type="text"
                  value={mealDesc}
                  onChange={(e) => setMealDesc(e.target.value)}
                  placeholder="e.g. Steamed broccoli, grilled tofu, brown rice"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Calories</label>
                <input
                  type="number"
                  value={mealCals}
                  onChange={(e) => setMealCals(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMealModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer"
                >
                  Save Meal Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
