import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  BrainCircuit, 
  UtensilsCrossed, 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  AlertCircle,
  Volume2
} from 'lucide-react';
import { HealthReminder } from '../../types/health';
import { initialReminders } from '../../data/mockHealthData';

export const HealthReminders: React.FC = () => {
  const [reminders, setReminders] = useState<HealthReminder[]>(initialReminders);
  const [filterType, setFilterType] = useState<'All' | 'Meditation' | 'Food Intake' | 'Next Appointment'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMeditationTimer, setShowMeditationTimer] = useState(false);

  // Meditation Breathing state
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [timerActive, setTimerActive] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  // New Reminder form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Meditation' | 'Food Intake' | 'Next Appointment'>('Food Intake');
  const [newTime, setNewTime] = useState('12:30 PM');
  const [newNote, setNewNote] = useState('');

  // Breathing Box Timer logic
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold';
              if (currentPhase === 'Hold') return 'Exhale';
              if (currentPhase === 'Exhale') return 'Rest';
              setCompletedCycles((c) => c + 1);
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const toggleComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const snoozeReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, scheduledTime: 'In 15 Mins', completed: false } : r
      )
    );
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const item: HealthReminder = {
      id: `rem-${Date.now()}`,
      type: newType,
      title: newTitle,
      scheduledTime: newTime,
      categoryNote: newNote || 'Custom Patient Reminder',
      completed: false,
      priority: 'Medium',
    };

    setReminders([item, ...reminders]);
    setNewTitle('');
    setNewNote('');
    setShowAddModal(false);
  };

  const filteredReminders = reminders.filter((r) => {
    if (filterType === 'All') return true;
    return r.type === filterType;
  });

  return (
    <section id="reminders-section" className="py-12 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-2">
              <BellRing className="w-3.5 h-3.5 text-amber-600" />
              <span>Timely Care & Habit Adherence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Health Reminders & Daily Schedules
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
              Stay fully consistent with your scheduled meditation intake, nutritious food intake intervals, and upcoming doctor appointments.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setShowMeditationTimer(true);
                setTimerActive(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4 text-purple-600" />
              <span>Start Meditation Guide</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Reminder</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 pb-3 mb-6 overflow-x-auto border-b border-slate-100">
          {(['All', 'Meditation', 'Food Intake', 'Next Appointment'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filterType === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Reminders' : cat}
            </button>
          ))}
        </div>

        {/* Reminder Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReminders.map((rem) => {
            const isMeditation = rem.type === 'Meditation';
            const isFood = rem.type === 'Food Intake';
            const isApt = rem.type === 'Next Appointment';

            return (
              <div
                key={rem.id}
                className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                  rem.completed
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : isMeditation
                    ? 'bg-purple-50/40 border-purple-200/80 hover:border-purple-300'
                    : isFood
                    ? 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300'
                    : 'bg-teal-50/40 border-teal-200/80 hover:border-teal-300'
                }`}
              >
                <div>
                  {/* Category Pill & Time */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1 ${
                        isMeditation
                          ? 'bg-purple-100 text-purple-800'
                          : isFood
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {isMeditation && <BrainCircuit className="w-3 h-3 mr-1" />}
                      {isFood && <UtensilsCrossed className="w-3 h-3 mr-1" />}
                      {isApt && <CalendarClock className="w-3 h-3 mr-1" />}
                      <span>{rem.type}</span>
                    </span>

                    <span className="text-xs font-bold text-slate-700 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      {rem.scheduledTime}
                    </span>
                  </div>

                  {/* Title & Notes */}
                  <h4 className={`font-bold text-sm ${rem.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {rem.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {rem.categoryNote}
                  </p>

                  {rem.details && (
                    <p className="text-[11px] text-slate-500 mt-2 p-2 rounded-lg bg-white/70 border border-slate-200/60 leading-relaxed">
                      {rem.details}
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    onClick={() => toggleComplete(rem.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      rem.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${rem.completed ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{rem.completed ? 'Completed' : 'Mark Done'}</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {isMeditation && !rem.completed && (
                      <button
                        onClick={() => {
                          setShowMeditationTimer(true);
                          setTimerActive(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-purple-700 hover:bg-purple-100 text-xs font-medium cursor-pointer"
                        title="Open breathing timer"
                      >
                        Breathe
                      </button>
                    )}
                    <button
                      onClick={() => snoozeReminder(rem.id)}
                      className="px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                      title="Snooze for 15 minutes"
                    >
                      Snooze
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Guided Meditation Modal */}
        {showMeditationTimer && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Vagus Nerve Reset • Box Breathing
                </span>
                <button
                  onClick={() => {
                    setShowMeditationTimer(false);
                    setTimerActive(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Animated Breathing Circle */}
              <div className="my-8 flex justify-center items-center">
                <div
                  className={`w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-xl border-4 ${
                    breathPhase === 'Inhale'
                      ? 'scale-110 bg-gradient-to-tr from-purple-500 to-indigo-500 text-white border-purple-300'
                      : breathPhase === 'Hold'
                      ? 'scale-105 bg-gradient-to-tr from-indigo-600 to-blue-600 text-white border-indigo-300'
                      : breathPhase === 'Exhale'
                      ? 'scale-90 bg-gradient-to-tr from-teal-500 to-cyan-500 text-white border-teal-300'
                      : 'scale-95 bg-gradient-to-tr from-slate-700 to-slate-800 text-white border-slate-400'
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wider opacity-90">{breathPhase}</p>
                  <p className="text-4xl font-extrabold my-1">{breathSeconds}</p>
                  <p className="text-[10px] opacity-80">Seconds remaining</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-4">
                Completed Cycles: <span className="font-bold text-purple-700">{completedCycles}</span> • Calms parasympathetic tone
              </p>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold inline-flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{timerActive ? 'Pause' : 'Resume'}</span>
                </button>
                <button
                  onClick={() => {
                    setBreathSeconds(4);
                    setBreathPhase('Inhale');
                    setCompletedCycles(0);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Reminder Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Add New Health Reminder</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddReminder} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reminder Category</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="Meditation">Meditation & Mindfulness Intake</option>
                    <option value="Food Intake">Nutritious Food Intake / Meal</option>
                    <option value="Next Appointment">Next Doctor Appointment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Title / Activity</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. 15-min Post Lunch Walk or Electrolyte Water"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scheduled Time / Date</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 02:30 PM or Tomorrow 10:00 AM"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Note / Instructions</label>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g. Drink 300ml water beforehand; chew slowly"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer"
                  >
                    Schedule Reminder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
