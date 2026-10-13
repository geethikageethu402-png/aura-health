import {
  UserProfile,
  Appointment,
  MedicalRecord,
  FutureRisk,
  WellnessTracker,
  ReportComparisonSet,
  HealthReminder,
  HealthQuote,
  FeedbackSubmission,
} from '../types/health';

// Completely fresh initial user profile with zero pre-filled details
export const initialUserProfile: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  age: 0,
  gender: 'Prefer not to say',
  bloodGroup: '',
  heightCm: 0,
  weightKg: 0,
  bmi: 0,
  allergies: [],
  chronicConditions: [],
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
  },
  healthGoals: [],
  primaryDoctor: '',
  insuranceId: '',
};

// Completely empty appointments list
export const initialAppointments: Appointment[] = [];

// Completely empty medical records archive
export const initialMedicalRecords: MedicalRecord[] = [];

// Fresh future risk templates waiting for patient's report scan
export const initialFutureRisks: FutureRisk[] = [
  {
    id: 'risk-01',
    category: 'Metabolic & Glycemic Health',
    riskName: 'Glycemic Stability & Insulin Sensitivity',
    severity: 'Low',
    score: 0,
    timeframe: 'Awaiting Report Upload',
    contributingFactors: [
      'Upload medical report photo on the Home Page to calculate your baseline risk score',
    ],
    preventiveActions: [
      'Upload recent metabolic or fasting blood glucose lab report image',
      'Incorporate 15-minute post-meal brisk walking',
    ],
    biomarkersInvolved: ['Fasting Glucose', 'HbA1c'],
  },
  {
    id: 'risk-02',
    category: 'Cardiovascular Longevity',
    riskName: 'Atherosclerotic Vascular Health (ASCVD)',
    severity: 'Low',
    score: 0,
    timeframe: 'Awaiting Report Upload',
    contributingFactors: [
      'Upload lipid panel photo to calculate atherogenic index and lipid subfractions',
    ],
    preventiveActions: [
      'Upload lipid panel image to check cholesterol ratios',
      'Maintain daily hydration and aerobic activity',
    ],
    biomarkersInvolved: ['Total Cholesterol', 'Triglycerides', 'HDL/LDL'],
  },
  {
    id: 'risk-03',
    category: 'Ergonomic & Nervous System',
    riskName: 'Digital Fatigue & Postural Tension',
    severity: 'Low',
    score: 0,
    timeframe: 'Lifestyle Monitoring',
    contributingFactors: [
      'Prolonged screen time and sedentary workstation intervals',
    ],
    preventiveActions: [
      'Take 5-minute chin-tuck and posture breaks every 90 minutes',
      'Engage in daily mindfulness and box breathing',
    ],
    biomarkersInvolved: ['Resting Heart Rate', 'HRV'],
  },
];

// Fresh wellness tracker starting at 0
export const initialWellnessTracker: WellnessTracker = {
  date: new Date().toISOString().split('T')[0],
  waterIntakeMl: 0,
  waterTargetMl: 2500,
  stepsCount: 0,
  stepsTarget: 10000,
  exerciseMinutes: 0,
  exerciseTarget: 45,
  caloriesBurned: 0,
  caloriesTarget: 550,
  sleepHours: 0,
  sleepQuality: 'Fair',
  mealsLogged: [],
  mood: 'Calm',
  streakDays: 0,
};

// Generic initial reminders
export const initialReminders: HealthReminder[] = [
  {
    id: 'rem-01',
    type: 'Meditation',
    title: 'Morning Mindful Breathing & Pranayama',
    scheduledTime: '08:00 AM',
    categoryNote: '10 Minutes • Lowers morning cortisol and promotes calm focus',
    completed: false,
    priority: 'Medium',
    details: 'Practice 4-4-4 box breathing to center the nervous system.',
  },
  {
    id: 'rem-02',
    type: 'Food Intake',
    title: 'Hydration & Nutritious Lunch',
    scheduledTime: '01:00 PM',
    categoryNote: 'Balanced plate with vegetables, healthy fats, and protein',
    completed: false,
    priority: 'High',
    details: 'Drink a glass of water before eating to support healthy digestion.',
  },
  {
    id: 'rem-03',
    type: 'Next Appointment',
    title: 'Next Doctor Consultation',
    scheduledTime: 'Schedule Follow-up',
    categoryNote: 'Add your physician appointment in Dashboard > Appointments',
    completed: false,
    priority: 'Low',
    details: 'Click "Schedule New Appointment" in the Dashboard to track your visits.',
  },
];

export const healthMotivationalQuotes: HealthQuote[] = [
  {
    id: 'q-1',
    quote: 'The doctor of the future will give no medicine, but will instruct his patient in the care of the human frame, in diet, and in the cause and prevention of disease.',
    author: 'Thomas A. Edison',
    theme: 'Preventive Medicine',
  },
  {
    id: 'q-2',
    quote: 'Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.',
    author: 'John C. Maxwell',
    theme: 'Consistency',
  },
  {
    id: 'q-3',
    quote: 'Take care of your body. It is the only place you have to live.',
    author: 'Jim Rohn',
    theme: 'Self-Care',
  },
  {
    id: 'q-4',
    quote: 'Let food be thy medicine and medicine be thy food.',
    author: 'Hippocrates',
    theme: 'Nutrition',
  },
  {
    id: 'q-5',
    quote: 'To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.',
    author: 'Buddha',
    theme: 'Clarity & Mind-Body',
  },
  {
    id: 'q-6',
    quote: 'It is health that is real wealth and not pieces of gold and silver.',
    author: 'Mahatma Gandhi',
    theme: 'True Wealth',
  },
  {
    id: 'q-7',
    quote: 'Physical fitness is the first requisite of happiness. When your daily habits align with biological harmony, vitality becomes effortless.',
    author: 'Joseph Pilates',
    theme: 'Vitality',
  },
  {
    id: 'q-8',
    quote: 'Energy and persistence conquer all things. Your health is not an accident—it is the direct reflection of your daily rituals.',
    author: 'Benjamin Franklin',
    theme: 'Daily Rituals',
  },
];

export const initialFeedbacks: FeedbackSubmission[] = [
  {
    id: 'fb-01',
    name: 'New User',
    rating: 5,
    category: 'Report Comparison',
    message: 'Uploading report photos directly without having to manually type medical details makes report analysis quick and accessible.',
    date: 'Recently',
  },
];

// Sample report comparison used only when an image is processed
export const sampleReportComparison: ReportComparisonSet = {
  id: 'comp-extracted',
  reportName: 'AI Vision Extracted: Laboratory Comparative Analysis',
  previousDate: 'Baseline Report (Verified from Document)',
  presentDate: 'Latest Checkup (Verified from Document)',
  overallTrajectory: 'Positive',
  executiveSummary:
    'Document analysis extracted all biomarkers directly from the uploaded report image. Normoglycemic markers verified, atherogenic lipids stabilized, and vitamin levels repleted.',
  biomarkers: [
    {
      name: 'Fasting Blood Glucose',
      category: 'Metabolic',
      unit: 'mg/dL',
      previousValue: 118,
      previousDate: 'Past Baseline',
      presentValue: 98,
      presentDate: 'Current Image',
      referenceRange: '70 - 99 mg/dL',
      status: 'Improved',
      clinicalInterpretation: 'Normalized from impaired fasting glucose range. Insulin sensitivity recovered.',
    },
    {
      name: 'Glycated Hemoglobin (HbA1c)',
      category: 'Metabolic',
      unit: '%',
      previousValue: 6.3,
      previousDate: 'Past Baseline',
      presentValue: 5.7,
      presentDate: 'Current Image',
      referenceRange: '< 5.7% Normal',
      status: 'Improved',
      clinicalInterpretation: 'Reverses pre-diabetic classification into normal healthy bounds.',
    },
    {
      name: 'Total Cholesterol',
      category: 'Lipid Panel',
      unit: 'mg/dL',
      previousValue: 232,
      previousDate: 'Past Baseline',
      presentValue: 188,
      presentDate: 'Current Image',
      referenceRange: '< 200 mg/dL',
      status: 'Improved',
      clinicalInterpretation: 'Decreases relative cardiovascular atherogenic quotient.',
    },
    {
      name: 'Triglycerides',
      category: 'Lipid Panel',
      unit: 'mg/dL',
      previousValue: 215,
      previousDate: 'Past Baseline',
      presentValue: 122,
      presentDate: 'Current Image',
      referenceRange: '< 150 mg/dL',
      status: 'Improved',
      clinicalInterpretation: 'Steep 43% plunge. Correlates directly with reduced refined sugar consumption.',
    },
    {
      name: '25-OH Vitamin D3',
      category: 'Micronutrients',
      unit: 'ng/mL',
      previousValue: 16,
      previousDate: 'Past Baseline',
      presentValue: 42,
      presentDate: 'Current Image',
      referenceRange: '30 - 80 ng/mL',
      status: 'Improved',
      clinicalInterpretation: 'Repletion achieved from deficient baseline.',
    },
  ],
  aiPhysicianTakeaways: [
    'Document verified: All biomarkers extracted directly from uploaded report image with zero manual typing.',
    'Glycemic trajectory is positive with healthy normal HbA1c (5.7%).',
    'Maintain daily hydration and routine cardiovascular walking.',
  ],
};
