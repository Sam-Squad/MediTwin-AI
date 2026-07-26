import React, { useState } from 'react';
import { doctorCopilotApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import { UserCheck, Download, Plus, Trash2, FileText, CheckCircle2, Sparkles } from 'lucide-react';

export const DoctorCopilotPage = () => {
  const [symptoms, setSymptoms] = useState(['Mild fatigue in late afternoon', 'Occasional indigestion after dinner']);
  const [newSymptom, setNewSymptom] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleAddSymptom = (e) => {
    e.preventDefault();
    if (newSymptom.trim()) {
      setSymptoms([...symptoms, newSymptom.trim()]);
      setNewSymptom('');
    }
  };

  const handleRemoveSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleDownloadSheet = async () => {
    setGenerating(true);
    try {
      const response = await doctorCopilotApi.generateSheet(symptoms);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Doctor_Visit_Prep_Sheet.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <DisclaimerBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-amber-500" /> Doctor Visit Copilot & PDF Generator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Synthesize active prescriptions, lab report summaries, and current symptoms into a printable doctor visit prep sheet.
          </p>
        </div>

        <button
          onClick={handleDownloadSheet}
          disabled={generating}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs rounded-xl shadow-glow flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4" />
          {generating ? 'Building PDF Sheet...' : 'Export Doctor Prep PDF'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Symptoms Form */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Step 1: Input Recent Symptoms
          </h3>

          <form onSubmit={handleAddSymptom} className="flex gap-2">
            <input
              type="text"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              placeholder="e.g. Mild headache, joint stiffness..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button type="submit" className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl">
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 pt-2">
            {symptoms.map((sym, idx) => (
              <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-200">
                <span>{sym}</span>
                <button onClick={() => handleRemoveSymptom(idx)} className="text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 space-y-4 border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Live PDF Sheet Preview
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Doctor Visit Preparation Sheet</h3>
            </div>
            <FileText className="w-6 h-6 text-amber-400" />
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <strong className="text-white">Active Prescriptions Included:</strong> Amoxicillin 500mg, Metformin 500mg
            </div>
            <div>
              <strong className="text-white">Recent Lab Highlights Included:</strong> Hemoglobin 11.8 g/dL (Mild Low), Fasting Blood Sugar 108 mg/dL
            </div>
            <div>
              <strong className="text-white">Patient Symptoms:</strong> {symptoms.join(', ') || 'None listed'}
            </div>
            <div>
              <strong className="text-white">Generated Physician Questions:</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-400">
                <li>Should I consider dietary iron adjustments for my hemoglobin level?</li>
                <li>Are my current prescription dosages aligned with my lab results?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCopilotPage;
