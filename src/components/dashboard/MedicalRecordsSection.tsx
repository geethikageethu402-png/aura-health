import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Calendar, 
  Stethoscope, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { MedicalRecord } from '../../types/health';
import { initialMedicalRecords } from '../../data/mockHealthData';

interface MedicalRecordsSectionProps {
  records?: MedicalRecord[];
  onAddRecord?: (rec: MedicalRecord) => void;
}

export const MedicalRecordsSection: React.FC<MedicalRecordsSectionProps> = ({
  records: externalRecords,
  onAddRecord: externalOnAdd,
}) => {
  const [internalRecords, setInternalRecords] = useState<MedicalRecord[]>(initialMedicalRecords);
  const records = externalRecords !== undefined ? externalRecords : internalRecords;
  const setRecords = (recs: MedicalRecord[]) => {
    setInternalRecords(recs);
  };
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Record Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MedicalRecord['category']>('Lab Report');
  const [newDoctor, setNewDoctor] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newFindings, setNewFindings] = useState('');

  const categories = ['All', 'Lab Report', 'Prescription', 'Cardiology', 'Radiology'];

  const filteredRecords = records.filter((rec) => {
    const matchesCat = selectedCategory === 'All' || rec.category === selectedCategory;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUploadRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const findingsList = newFindings
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const newRec: MedicalRecord = {
      id: `rec-${Date.now()}`,
      title: newTitle || 'Medical Diagnostic Document',
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      doctor: newDoctor,
      facility: newFacility,
      summary: newSummary || 'Patient uploaded medical record analyzed by AuraHealth Copilot.',
      keyFindings: findingsList.length > 0 ? findingsList : ['Analyzed by Clinical Copilot: Within acceptable clinical boundaries.'],
      status: 'Normal',
    };

    if (externalOnAdd) {
      externalOnAdd(newRec);
    } else {
      setRecords([newRec, ...records]);
    }
    setNewTitle('');
    setNewSummary('');
    setNewFindings('');
    setShowUploadModal(false);
  };

  return (
    <div id="section-medical-records" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
      {/* Section Header with Step Badge (03. Medical Records) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
            03
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Medical Records & Clinical Archive
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Encrypted Vault
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical lab panels, diagnostic imaging, prescriptions, and physician notes
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload / Log New Record</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-5">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search records or doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-teal-600"
          />
        </div>
      </div>

      {/* Medical Records Grid or Empty State */}
      {filteredRecords.length === 0 ? (
        <div className="p-10 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">No Medical Records Stored Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Your archive is currently plain and unpopulated with other people's data. Upload your medical report image on the Home Page, or click below to log your first document.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
          >
            Upload / Log First Record
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((rec) => (
          <div
            key={rec.id}
            className="p-5 rounded-xl border border-slate-200 hover:border-teal-300 bg-white hover:bg-teal-50/20 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 uppercase tracking-wider">
                  {rec.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {rec.date}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {rec.title}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center">
                  <Stethoscope className="w-3 h-3 mr-1 text-slate-400" />
                  {rec.doctor}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Building2 className="w-3 h-3 mr-1 text-slate-400" />
                  {rec.facility}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {rec.summary}
              </p>

              {/* Key findings pills */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Key Diagnostic Findings:
                </p>
                {rec.keyFindings.slice(0, 3).map((finding, idx) => (
                  <div key={idx} className="flex items-start space-x-1.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="truncate">{finding}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedRecord(rec)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center space-x-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Summary</span>
              </button>

              <button
                onClick={() => alert(`Downloading record "${rec.title}" as verified clinical PDF.`)}
                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Download verified PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                  {selectedRecord.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {selectedRecord.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Doctor</span>
                  <p className="font-semibold text-slate-900">{selectedRecord.doctor}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Date & Facility</span>
                  <p className="font-semibold text-slate-900">{selectedRecord.date} • {selectedRecord.facility}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Clinical Synthesis</h4>
                <p className="leading-relaxed bg-teal-50/50 p-3 rounded-xl border border-teal-100 text-teal-950">
                  {selectedRecord.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Detailed Parameter Findings</h4>
                <ul className="space-y-1.5">
                  {selectedRecord.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start space-x-2 bg-slate-50 p-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer text-xs"
              >
                Close
              </button>
              <button
                onClick={() => alert(`Exporting ${selectedRecord.title} to patient record repository.`)}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center space-x-1 cursor-pointer text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Record Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Upload / Log Medical Record</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUploadRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Record Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Thyroid Ultrasound or Lipid Recheck"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Radiology">Radiology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins, MD"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Facility / Lab Clinic</label>
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  placeholder="e.g. Quest Diagnostics / Metro Lab"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Summary</label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Brief diagnosis or reason for test..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Findings (one per line)</label>
                <textarea
                  rows={3}
                  value={newFindings}
                  onChange={(e) => setNewFindings(e.target.value)}
                  placeholder="e.g. TSH: 2.1 μIU/mL&#10;Free T4: 1.2 ng/dL"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="p-3 border-2 border-dashed border-teal-300 bg-teal-50/50 rounded-xl text-center">
                <Upload className="w-6 h-6 text-teal-600 mx-auto mb-1" />
                <p className="font-semibold text-teal-800 text-xs">Simulate Document Drag & Drop</p>
                <p className="text-[10px] text-slate-500">PDF, JPG, DICOM supported (demo vault)</p>
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
