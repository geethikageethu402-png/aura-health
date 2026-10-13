import React, { useState } from 'react';
import { 
  User, 
  Edit3, 
  ShieldCheck, 
  Heart, 
  AlertTriangle, 
  PhoneCall, 
  Target, 
  Activity, 
  Save, 
  X,
  Stethoscope,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { UserProfile } from '../../types/health';

interface UserProfileSectionProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const isProfileEmpty = !profile.name || profile.name.trim() === '';
  const [isEditing, setIsEditing] = useState(isProfileEmpty);
  const [formData, setFormData] = useState<UserProfile>(
    isProfileEmpty ? { ...profile, name: '', age: 0, bloodGroup: '', heightCm: 0, weightKg: 0, bmi: 0 } : profile
  );

  const calculateBmi = (weight: number, heightCm: number) => {
    if (!heightCm || !weight) return 0;
    const heightM = heightCm / 100;
    return Number((weight / (heightM * heightM)).toFixed(1));
  };

  const handleWeightChange = (val: number) => {
    const newBmi = calculateBmi(val, formData.heightCm);
    setFormData({ ...formData, weightKg: val, bmi: newBmi });
  };

  const handleHeightChange = (val: number) => {
    const newBmi = calculateBmi(formData.weightKg, val);
    setFormData({ ...formData, heightCm: val, bmi: newBmi });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile: UserProfile = {
      ...formData,
      id: formData.id || `usr-${Date.now()}`,
      avatar: '',
      bmi: calculateBmi(formData.weightKg, formData.heightCm),
    };
    onUpdateProfile(finalProfile);
    setIsEditing(false);
  };

  const bmiCategory =
    profile.bmi < 18.5
      ? 'Underweight'
      : profile.bmi < 25
      ? 'Normal & Healthy Weight'
      : profile.bmi < 30
      ? 'Overweight'
      : 'Obese';

  return (
    <div id="section-user-profile" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
      {/* Section Header with Step Badge (1. User Profile) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
            01
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                User Profile & Clinical Demographics
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                {isProfileEmpty ? 'Setup Required' : 'Primary Identity'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Personal biological metrics, allergy safeguards, and emergency contacts
            </p>
          </div>
        </div>

        {!isProfileEmpty && (
          <button
            onClick={() => {
              setFormData(profile);
              setIsEditing(!isEditing);
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 text-teal-600" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Profile Content OR Plain Initial Setup Form */}
      {!isEditing && !isProfileEmpty ? (
        <div className="pt-6 space-y-6">
          {/* Top Overview Strip */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/40 border border-slate-200/80">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-extrabold text-2xl ring-2 ring-teal-500/30 shadow-md">
                {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="w-8 h-8 text-teal-700" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
                <p className="text-xs text-slate-500">{profile.email || 'Patient Registered'}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    Age {profile.age} • {profile.gender}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-teal-100/80 text-teal-800 border border-teal-200">
                    Blood Group: {profile.bloodGroup}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick BMI Badge */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-center shrink-0 w-full md:w-auto">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calculated BMI</p>
              <p className="text-2xl font-extrabold text-teal-700">{profile.bmi || '--'}</p>
              <span className="text-[11px] font-semibold text-emerald-600">
                {bmiCategory}
              </span>
            </div>
          </div>

          {/* Granular Demographics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Height</span>
              <p className="text-base font-bold text-slate-800 mt-1">{profile.heightCm} cm</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Weight</span>
              <p className="text-base font-bold text-slate-800 mt-1">{profile.weightKg} kg</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Physician</span>
              <p className="text-xs font-bold text-slate-800 mt-1 truncate">
                {profile.primaryDoctor || 'Not assigned'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Insurance ID</span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1 truncate">
                {profile.insuranceId || 'Private Self-Pay'}
              </p>
            </div>
          </div>

          {/* Allergies & Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/80">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Known Allergies & Contraindications</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.allergies.length > 0 ? (
                  profile.allergies.map((allergy, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white border border-rose-200 text-rose-700 text-xs font-semibold"
                    >
                      ⚠️ {allergy}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No drug allergies reported</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs mb-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <span>Active Conditions Under Watch</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.chronicConditions.length > 0 ? (
                  profile.chronicConditions.map((cond, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white border border-amber-200 text-amber-800 text-xs font-semibold"
                    >
                      🩺 {cond}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No chronic ailments recorded</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Fresh User Setup Form */
        <div className="pt-6">
          {isProfileEmpty && (
            <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-start space-x-3">
              <UserPlus className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-teal-900">Set Up Your Personal Health Profile</p>
                <p className="text-teal-700 mt-0.5">
                  This system is completely fresh and unpopulated. Enter your personal details below to activate your health dashboard.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-teal-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age *</label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  placeholder="e.g. 35"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-teal-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Group *</label>
                <input
                  type="text"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  placeholder="e.g. O+, A+, B+, AB-"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-teal-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Height (cm) *</label>
                <input
                  type="number"
                  value={formData.heightCm || ''}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  placeholder="e.g. 172"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-teal-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Weight (kg) *</label>
                <input
                  type="number"
                  value={formData.weightKg || ''}
                  onChange={(e) => handleWeightChange(Number(e.target.value))}
                  placeholder="e.g. 68"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-teal-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Auto-Calculated BMI</label>
                <input
                  type="text"
                  disabled
                  value={formData.bmi || '--'}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Contact (Name & Relationship)</label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, name: e.target.value },
                    })
                  }
                  placeholder="e.g. Sarah Doe (Spouse)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-teal-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={formData.emergencyContact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, phone: e.target.value },
                    })
                  }
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-teal-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
              {!isProfileEmpty && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{isProfileEmpty ? 'Save & Activate My Dashboard' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
