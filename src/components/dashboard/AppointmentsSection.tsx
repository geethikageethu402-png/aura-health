import React, { useState } from 'react';
import { 
  CalendarClock, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  ChevronRight,
  FileText
} from 'lucide-react';
import { Appointment } from '../../types/health';
import { initialAppointments } from '../../data/mockHealthData';

export const AppointmentsSection: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [filter, setFilter] = useState<'Upcoming' | 'Past' | 'All'>('Upcoming');
  const [showBookModal, setShowBookModal] = useState(false);

  // New Appointment Form State
  const [docName, setDocName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [isTelehealth, setIsTelehealth] = useState(false);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorName: docName,
      specialty,
      hospital,
      date,
      time,
      reason,
      status: 'Confirmed',
      isTelehealth,
      notes: 'Scheduled via AuraHealth Copilot Dashboard.',
    };

    setAppointments([newApt, ...appointments]);
    setShowBookModal(false);
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'Upcoming') return apt.status === 'Confirmed' || apt.status === 'Pending';
    if (filter === 'Past') return apt.status === 'Completed' || apt.status === 'Cancelled';
    return true;
  });

  return (
    <div id="section-appointments" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
      {/* Section Header with Step Badge (02. Appointments) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
            02
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Appointments & Consultations
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Physician Network
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirmed specialist appointments, telehealth links, and clinical preparation logs
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Appointment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 my-5">
        {(['Upcoming', 'Past', 'All'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === tab
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab} Appointments
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No appointments found in this category.
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 rounded-xl border border-slate-200/90 hover:border-teal-300 transition-all bg-slate-50/50 hover:bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      apt.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'Completed'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {apt.status}
                  </span>

                  {apt.isTelehealth && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 flex items-center space-x-1">
                      <Video className="w-3 h-3 mr-1" />
                      <span>Telehealth Video</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {apt.doctorName}
                  </h3>
                  <p className="text-xs font-medium text-teal-700">{apt.specialty}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {apt.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {apt.time}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {apt.hospital}
                  </span>
                </div>

                <p className="text-xs text-slate-700">
                  <strong>Reason:</strong> {apt.reason}
                </p>

                {apt.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-200">
                    Note: {apt.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col gap-2 shrink-0 self-end md:self-center">
                {apt.isTelehealth ? (
                  <button
                    onClick={() => alert('Telehealth consultation session portal will open 15 minutes before the scheduled time.')}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Call</span>
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Directions to ${apt.hospital} generated.`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Directions</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Schedule New Appointment</h3>
              <button
                onClick={() => setShowBookModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins, MD"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medical Specialty</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Endocrinology & Internal Medicine"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinic / Hospital</label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="e.g. Metro Health Academic Center"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Consultation</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="telehealthCheck"
                  checked={isTelehealth}
                  onChange={(e) => setIsTelehealth(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="telehealthCheck" className="font-semibold text-slate-700">
                  This is a virtual Telehealth appointment
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
