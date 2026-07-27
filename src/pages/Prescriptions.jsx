import React, { useState, useEffect } from 'react';
import { prescriptionsApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Pill, FileUp, CheckCircle, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [activePrescription, setActivePrescription] = useState(null);
  const [editMedicines, setEditMedicines] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const fetchPrescriptions = async () => {
    try {
      const res = await prescriptionsApi.list();
      setPrescriptions(res.data);
      if (res.data.length > 0 && !activePrescription) {
        setActivePrescription(res.data[0]);
        setEditMedicines(res.data[0].medicines || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await prescriptionsApi.upload(formData);
      setPrescriptions((prev) => [res.data, ...prev]);
      setActivePrescription(res.data);
      setEditMedicines(res.data.medicines || []);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    if (!activePrescription) return;
    try {
      const res = await prescriptionsApi.confirm(activePrescription.id, {
        medicines: editMedicines,
        doctor_notes: activePrescription.doctor_notes
      });
      setActivePrescription(res.data);
      setPrescriptions((prev) => prev.map(p => p.id === res.data.id ? res.data : p));
      alert('Prescription confirmed! Medicine reminders have been automatically scheduled.');
    } catch (err) {
      console.error(err);
    }
  };

  const updateMedField = (index, field, value) => {
    const updated = [...editMedicines];
    updated[index][field] = value;
    setEditMedicines(updated);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <DisclaimerBanner />

      <PageHeader 
        title="Prescription Analysis" 
        subtitle="Upload prescription images for OCR parsing of medicine names, dosage, side effects, and auto-reminders."
        icon={Pill}
      />

      {/* Upload Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
        }}
      >
        <Card className={`text-center border-2 border-dashed transition-all duration-300 cursor-pointer ${
          dragActive 
            ? 'border-medical-500 bg-medical-50 dark:bg-medical-500/10 scale-[1.01] shadow-soft' 
            : 'border-slate-200 dark:border-slate-700/80 hover:border-medical-400 dark:hover:border-medical-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}>
          <input
            type="file"
            id="presc-input"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="presc-input" className="cursor-pointer block p-8 sm:p-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              {uploading ? <RefreshCw className="w-8 h-8 animate-spin" /> : <FileUp className="w-8 h-8" />}
            </div>
            <div className="text-base font-bold text-slate-900">
              {uploading ? 'Parsing Prescription Image with Vision OCR...' : 'Upload Prescription Scan or Photo'}
            </div>
            <div className="text-sm text-slate-500 mt-2 font-medium">Extracts dosage, frequency, food warnings & creates reminder schedules</div>
          </label>
        </Card>
      </div>

      {/* Grid List & Confirmation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scans List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Scanned Prescriptions ({prescriptions.length})
          </div>

          <div className="space-y-3">
            {prescriptions.map((p) => (
              <Card
                hover
                padding="small"
                key={p.id}
                onClick={() => { setActivePrescription(p); setEditMedicines(p.medicines || []); }}
                className={`cursor-pointer transition-all border ${
                  activePrescription?.id === p.id
                    ? 'border-medical-500 bg-medical-50 dark:bg-medical-500/10 shadow-soft ring-1 ring-medical-500/50'
                    : 'border-slate-200 dark:border-slate-800 hover:border-medical-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-sm text-slate-900 line-clamp-1">{p.filename}</div>
                  {p.confirmed_by_user ? (
                    <Badge variant="success" className="shrink-0"><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</Badge>
                  ) : (
                    <Badge variant="warning" className="shrink-0"><AlertTriangle className="w-3 h-3 mr-1" /> Pending</Badge>
                  )}
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-2">
                  OCR Confidence: <span className="font-bold text-slate-900">{Math.round((p.confidence_score || 0.9) * 100)}%</span>
                </div>
              </Card>
            ))}
            {prescriptions.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
                No prescriptions scanned yet.
              </div>
            )}
          </div>
        </div>

        {/* Prescription Details & Edit Form */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activePrescription ? (
              <motion.div
                key={activePrescription.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="space-y-8" padding="large">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-2">
                        {activePrescription.filename}
                      </h2>
                      <div className="flex items-center gap-3">
                        <Badge variant="info">
                          OCR Confidence: {Math.round((activePrescription.confidence_score || 0.9) * 100)}%
                        </Badge>
                        <p className="text-xs font-medium text-slate-500">Verify extracted medications</p>
                      </div>
                    </div>

                    <Button
                      onClick={handleConfirm}
                      variant="primary"
                      className="shrink-0 bg-medical-600 hover:bg-medical-500 text-white shadow-glass"
                      icon={CheckCircle2}
                    >
                      Confirm & Auto-Schedule Reminders
                    </Button>
                  </div>

                  {/* Medicines List / Edit Fields */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                      Extracted Medications ({editMedicines.length})
                    </h3>

                    <div className="space-y-4">
                      {editMedicines.map((med, idx) => (
                        <div key={idx} className="p-5 bg-surface-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Input
                              label="Medicine Name"
                              value={med.name}
                              onChange={(e) => updateMedField(idx, 'name', e.target.value)}
                            />
                            <Input
                              label="Dosage"
                              value={med.dosage}
                              onChange={(e) => updateMedField(idx, 'dosage', e.target.value)}
                            />
                            <Input
                              label="Frequency"
                              value={med.frequency}
                              onChange={(e) => updateMedField(idx, 'frequency', e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                            <div className="text-xs">
                              <div className="font-bold text-slate-900 mb-1">Instructions:</div> 
                              <div className="text-slate-700 leading-relaxed">{med.instructions}</div>
                            </div>
                            <div className="text-xs">
                              <div className="font-bold text-amber-700 dark:text-amber-500/80 mb-1">Food Interactions:</div> 
                              <div className="text-slate-700 leading-relaxed">{med.food_interactions}</div>
                            </div>
                          </div>

                          {med.side_effects?.length > 0 && (
                            <div className="text-xs bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 mt-2">
                              <span className="font-bold text-slate-900">Common Side Effects:</span> 
                              <span className="text-slate-700 ml-1 leading-relaxed">{med.side_effects.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-16 text-center text-slate-500 min-h-[400px]">
                <Pill className="w-12 h-12 text-slate-400 dark:text-slate-900 mb-4" />
                <p className="text-sm font-medium">Select or scan a prescription to view AI details.</p>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Prescriptions;
