import React, { useState } from 'react';
import { 
  LogOut, 
  ShieldCheck, 
  Lock, 
  User, 
  RotateCcw
} from 'lucide-react';
import { UserProfile } from '../../types/health';

interface LogOutSectionProps {
  userProfile: UserProfile;
  onLogOut: () => void;
  onSwitchUser?: () => void;
}

export const LogOutSection: React.FC<LogOutSectionProps> = ({
  userProfile,
  onLogOut,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const hasName = Boolean(userProfile.name?.trim());

  return (
    <div id="section-log-out" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
      {/* Section Header with Step Badge (08. Log Out at the end of dashboard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm shrink-0">
            08
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Account Session & Log Out
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Dashboard End
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Securely end your current patient session and reset locally stored data
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out & Reset Session</span>
        </button>
      </div>

      {/* Account Session Overview Card */}
      <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg ring-2 ring-teal-500/20 shrink-0">
            {hasName ? userProfile.name.charAt(0).toUpperCase() : <User className="w-6 h-6 text-teal-700" />}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">
              {hasName ? `Signed in as ${userProfile.name}` : 'Fresh Guest Session'}
            </p>
            <p className="text-xs text-slate-500">
              {hasName ? (userProfile.email || 'Registered Patient') : 'No user details configured'}
            </p>
            <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Session Encrypted • HIPAA Protocol
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer"
        >
          End Session & Clear
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-base text-slate-900">
              Confirm Account Log Out
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Are you sure you want to log out? This will clear the session and return the application to a completely fresh state.
            </p>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  onLogOut();
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
