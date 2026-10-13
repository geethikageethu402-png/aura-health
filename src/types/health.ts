export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  healthGoals: string[];
  primaryDoctor: string;
  insuranceId: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  reason: string;
  status: 'Confirmed' | 'Completed' | 'Pending' | 'Cancelled';
  isTelehealth?: boolean;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  title: string;
  category: 'Lab Report' | 'Prescription' | 'Radiology' | 'Vitals' | 'Cardiology';
  date: string;
  doctor: string;
  facility: string;
  summary: string;
  keyFindings: string[];
  fileUrl?: string;
  status: 'Normal' | 'Attention' | 'Critical';
}

export interface FutureRisk {
  id: string;
  category: string;
  riskName: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  score: number; // 0-100
  timeframe: string; // e.g., 'Next 6-12 Months'
  contributingFactors: string[];
  preventiveActions: string[];
  biomarkersInvolved: string[];
}

export interface WellnessTracker {
  date: string;
  waterIntakeMl: number;
  waterTargetMl: number;
  stepsCount: number;
  stepsTarget: number;
  exerciseMinutes: number;
  exerciseTarget: number;
  caloriesBurned: number;
  caloriesTarget: number;
  sleepHours: number;
  sleepQuality: 'Poor' | 'Fair' | 'Good' | 'Optimal';
  mealsLogged: {
    meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
    description: string;
    calories: number;
    healthScore: 'Healthy' | 'Moderate' | 'Indulgent';
  }[];
  mood: 'Energized' | 'Calm' | 'Fatigued' | 'Stressed';
  streakDays: number;
}

export interface BiomarkerComparison {
  name: string;
  category: string;
  unit: string;
  previousValue: number;
  previousDate: string;
  presentValue: number;
  presentDate: string;
  referenceRange: string;
  status: 'Improved' | 'Stable' | 'Elevated' | 'Attention';
  clinicalInterpretation: string;
}

export interface ReportComparisonSet {
  id: string;
  reportName: string;
  previousDate: string;
  presentDate: string;
  overallTrajectory: 'Positive' | 'Mixed' | 'Worsened';
  executiveSummary: string;
  biomarkers: BiomarkerComparison[];
  aiPhysicianTakeaways: string[];
}

export interface HealthReminder {
  id: string;
  type: 'Meditation' | 'Food Intake' | 'Next Appointment' | 'Medication' | 'Hydration';
  title: string;
  scheduledTime: string;
  categoryNote: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  details?: string;
}

export interface DoubtChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  sources?: string[];
  isVoiceInput?: boolean;
  audioBase64?: string | null;
}

export interface HealthQuote {
  id: string;
  quote: string;
  author: string;
  theme: string;
}

export interface FeedbackSubmission {
  id: string;
  name: string;
  rating: number; // 1-5
  category: 'AI Accuracy' | 'Report Comparison' | 'Voice Assistant' | 'General UX';
  message: string;
  date: string;
}
