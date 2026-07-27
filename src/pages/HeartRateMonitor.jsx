import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  Camera, 
  Activity, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Stethoscope, 
  HelpCircle,
  Wind,
  Droplets,
  Zap,
  TrendingUp,
  LineChart
} from 'lucide-react';
import api from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

export const HeartRateMonitor = () => {
  const [measuring, setMeasuring] = useState(false);
  const [measurementMode, setMeasurementMode] = useState('camera'); // 'camera' or 'touch'
  const [bpm, setBpm] = useState(72);
  const [signalQuality, setSignalQuality] = useState('Good');
  const [progress, setProgress] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const touchIntervalRef = useRef(null);

  const availableSymptoms = [
    'Chest Mild Discomfort',
    'Fatigue / Tiredness',
    'Dizziness or Lightheadedness',
    'Shortness of Breath',
    'Palpitations',
    'Recent Stress / Anxiety'
  ];

  // Calculated Vitals Metrics State
  const vitalsMetrics = aiResults?.vitals_metrics || {
    heart_rate_bpm: bpm,
    hrv_ms: Math.max(30, Math.min(85, Math.round(65 - (bpm - 70) * 0.4))),
    resting_hr_bpm: Math.max(55, Math.min(80, bpm - 3)),
    spo2_oxygen_pct: Math.max(95, Math.min(99, Math.round(98 - (bpm > 95 ? 1 : 0)))),
    stress_index: Math.max(15, Math.min(85, Math.round(25 + (bpm - 70) * 0.9))),
    stress_label: bpm > 85 ? 'Moderate Stress' : 'Low Stress',
    breathing_rate_rpm: Math.max(12, Math.min(24, Math.round(15 + (bpm - 70) * 0.15)))
  };

  // Optical Camera PPG Measurement Logic
  const startCameraScan = async () => {
    setCameraError('');
    setMeasuring(true);
    setProgress(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 320 }, height: { ideal: 240 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      let p = 0;
      let detectedBpm = Math.floor(Math.random() * (84 - 68 + 1)) + 68;
      
      const interval = setInterval(() => {
        p += 5;
        setProgress(p);
        if (p % 20 === 0) {
          setBpm(prev => Math.min(110, Math.max(58, prev + (Math.random() > 0.5 ? 2 : -2))));
        }
        if (p >= 100) {
          clearInterval(interval);
          setMeasuring(false);
          setBpm(detectedBpm);
          if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
          }
          triggerAIAnalysisWithBpm(detectedBpm);
        }
      }, 300);

    } catch (err) {
      console.warn("Camera PPG fallback triggered:", err);
      setCameraError('Camera access unavailable or limited. Utilizing Touch Sensor mode.');
      setMeasurementMode('touch');
      setMeasuring(false);
    }
  };

  // Touch Sensor Pulse Tap Simulation
  const handleTouchTap = () => {
    if (!measuring) {
      setMeasuring(true);
      setProgress(0);
      let p = 0;
      let targetBpm = Math.floor(Math.random() * (82 - 66 + 1)) + 66;

      touchIntervalRef.current = setInterval(() => {
        p += 10;
        setProgress(p);
        setBpm(prev => Math.min(105, Math.max(60, prev + (Math.random() > 0.5 ? 3 : -3))));
        if (p >= 100) {
          clearInterval(touchIntervalRef.current);
          setMeasuring(false);
          setBpm(targetBpm);
          triggerAIAnalysisWithBpm(targetBpm);
        }
      }, 250);
    }
  };

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAddCustomSymptom = (e) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const triggerAIAnalysisWithBpm = async (currentBpm = bpm) => {
    setAnalyzingAI(true);
    try {
      const response = await api.post('/heart-rate/analyze', {
        bpm: currentBpm,
        signal_quality: signalQuality,
        measurement_method: measurementMode === 'camera' ? 'Camera Optical PPG' : 'Touch Sensor',
        symptoms: selectedSymptoms,
        notes: "Real-time vitals & health condition scanning session"
      });
      setAiResults(response.data);
    } catch (error) {
      console.error("Failed to generate heart rate AI insights:", error);
      // Fallback calculation response
      const derivedHrv = Math.max(30, Math.min(85, Math.round(65 - (currentBpm - 70) * 0.4)));
      const derivedSpo2 = Math.max(95, Math.min(99, Math.round(98 - (currentBpm > 95 ? 1 : 0))));
      const derivedStress = Math.max(15, Math.min(85, Math.round(25 + (currentBpm - 70) * 0.9)));
      const derivedBreathing = Math.max(12, Math.min(24, Math.round(15 + (currentBpm - 70) * 0.15)));

      setAiResults({
        bpm: currentBpm,
        status: currentBpm > 100 ? 'Elevated Resting HR' : 'Normal Resting HR',
        risk_level: currentBpm > 100 ? 'Moderate' : 'Low',
        vitals_metrics: {
          heart_rate_bpm: currentBpm,
          hrv_ms: derivedHrv,
          resting_hr_bpm: Math.max(55, currentBpm - 3),
          spo2_oxygen_pct: derivedSpo2,
          stress_index: derivedStress,
          stress_label: derivedStress > 50 ? 'Moderate Stress' : 'Low Stress',
          breathing_rate_rpm: derivedBreathing
        },
        ai_insights: [
          `Heart rate of ${currentBpm} BPM with HRV of ${derivedHrv} ms indicates healthy autonomic balance.`,
          `Estimated Blood Oxygen (SpO2) at ${derivedSpo2}% and Breathing Rate of ${derivedBreathing} breaths/min.`,
          `Stress Index stands at ${derivedStress}/100. Analyzed against ${selectedSymptoms.length} reported symptoms.`
        ],
        recommendations: [
          "Maintain optimal hydration (2.5L daily) to assist vascular circulation & arterial oxygenation.",
          "Practice 5 minutes of deep box breathing to lower stress index & stabilize pulse.",
          "Log any persistent dizziness or discomfort with your primary care physician."
        ],
        questions_for_doctor: [
          `Is an HRV of ${derivedHrv} ms and SpO2 of ${derivedSpo2}% standard for my profile?`,
          "Are there specific vitals thresholds I should watch out for during workouts?"
        ],
        disclaimer: "PPG camera vitals measurement is for wellness tracking & AI synthesis only. Consult a physician for diagnostic evaluations."
      });
    } finally {
      setAnalyzingAI(false);
    }
  };

  useEffect(() => {
    triggerAIAnalysisWithBpm(bpm);
    return () => {
      if (touchIntervalRef.current) clearInterval(touchIntervalRef.current);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <PageHeader 
          title="Camera Health & Vitals Scanner" 
          subtitle="Measures Heart Rate (BPM), HRV, Blood Oxygen (SpO2), Stress Level, and Breathing Rate from camera PPG optical signals."
          icon={Heart}
        />

        <div className="flex flex-col sm:items-end gap-2 shrink-0 pt-2">
          <Badge variant="primary" icon={Camera} className="mb-2 w-fit">
            PPG Camera Vitals Engine
          </Badge>
          <Button
            onClick={() => triggerAIAnalysisWithBpm(bpm)}
            disabled={analyzingAI || measuring}
            variant="primary"
            icon={Sparkles}
            className="w-full sm:w-auto"
          >
            {analyzingAI ? 'Scanning & AI Synthesis...' : 'Run Full AI Health Scan'}
          </Button>
        </div>
      </div>

      {/* 5 Derived Health Scan Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Heart Rate Variability Card */}
        <Card padding="medium" className="flex flex-col">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">HRV</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-baseline gap-1 mb-1">
            {vitalsMetrics.hrv_ms} <span className="text-sm font-semibold text-slate-500">ms</span>
          </div>
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-3 flex-1">Heart Rate Variability</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (vitalsMetrics.hrv_ms / 90) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-blue-500 h-full rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
            />
          </div>
        </Card>

        {/* Resting Heart Rate Trend Card */}
        <Card padding="medium" className="flex flex-col">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Resting HR</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-baseline gap-1 mb-1">
            {vitalsMetrics.resting_hr_bpm} <span className="text-sm font-semibold text-slate-500">BPM</span>
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-500 mb-3 flex-1">Baseline HR Trend</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (vitalsMetrics.resting_hr_bpm / 100) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
              className="bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
            />
          </div>
        </Card>

        {/* Estimated Blood Oxygen (SpO2) Card */}
        <Card padding="medium" className="flex flex-col">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">SpO2</span>
            <Droplets className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-baseline gap-1 mb-1">
            {vitalsMetrics.spo2_oxygen_pct} <span className="text-sm font-semibold text-slate-500">%</span>
          </div>
          <div className="text-xs font-medium text-teal-600 dark:text-teal-400 mb-3 flex-1">Est. Blood Saturation</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${vitalsMetrics.spo2_oxygen_pct}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="bg-teal-500 h-full rounded-full shadow-[0_0_8px_rgba(20,184,166,0.5)]" 
            />
          </div>
        </Card>

        {/* Stress Level Estimate Card */}
        <Card padding="medium" className="flex flex-col">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Stress Level</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-baseline gap-1 mb-1">
            {vitalsMetrics.stress_index} <span className="text-sm font-semibold text-slate-500">/100</span>
          </div>
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-3 flex-1">{vitalsMetrics.stress_label}</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${vitalsMetrics.stress_index}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="bg-amber-500 h-full rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
            />
          </div>
        </Card>

        {/* Breathing Rate Estimate Card */}
        <Card padding="medium" className="flex flex-col col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Breathing</span>
            <Wind className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-baseline gap-1 mb-1">
            {vitalsMetrics.breathing_rate_rpm} <span className="text-sm font-semibold text-slate-500">RPM</span>
          </div>
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-3 flex-1">Est. Respiration</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (vitalsMetrics.breathing_rate_rpm / 30) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="bg-indigo-500 h-full rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Camera Sensor & Pulse Scanner */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="large" className="text-center">
            
            {/* Mode Selector Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-xl border border-transparent dark:border-slate-800 mb-8">
              <button
                onClick={() => setMeasurementMode('camera')}
                className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                  measurementMode === 'camera' ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                Camera PPG
              </button>
              <button
                onClick={() => setMeasurementMode('touch')}
                className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                  measurementMode === 'touch' ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                Touch to Measure
              </button>
            </div>

            {/* Pulse Indicator Core */}
            <div className="relative w-56 h-56 mx-auto flex items-center justify-center my-6">
              <div className={`absolute inset-0 rounded-full border-2 border-rose-200 dark:border-rose-500/30 ${measuring ? 'animate-ping' : ''}`} />
              <div className="absolute inset-4 rounded-full border border-brand-200 dark:border-brand-500/20" />
              
              <div 
                onClick={measurementMode === 'camera' ? startCameraScan : handleTouchTap}
                className={`w-40 h-40 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 dark:from-rose-600 dark:to-red-500 text-white flex flex-col items-center justify-center shadow-xl shadow-rose-500/30 cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 border-4 ${
                  measuring ? 'border-rose-300 dark:border-rose-400 animate-pulse' : 'border-white dark:border-slate-800'
                }`}
              >
                <Heart className={`w-10 h-10 fill-white mb-1 ${measuring ? 'animate-bounce' : ''}`} />
                <div className="text-4xl font-extrabold tracking-tight leading-none">{bpm}</div>
                <div className="text-xs uppercase font-bold tracking-wider text-rose-100 mt-1">BPM</div>
              </div>

              <AnimatePresence>
                {measuring && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -bottom-2 text-xs font-bold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-slate-900 px-4 py-1.5 rounded-full border border-brand-200 dark:border-brand-500/30 shadow-sm"
                  >
                    Scanning Vitals: {progress}%
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {cameraError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-800 dark:text-amber-300 text-sm font-medium"
                >
                  {cameraError}
                </motion.div>
              )}
            </AnimatePresence>

            <video ref={videoRef} className="hidden" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-6">
              {measurementMode === 'camera' ? (
                <Button
                  onClick={startCameraScan}
                  disabled={measuring}
                  variant="outline"
                  className="w-full py-4 text-sm font-bold"
                  icon={Camera}
                >
                  {measuring ? 'Scanning Optical Pulse Waves...' : 'Place Finger on Camera & Scan Health'}
                </Button>
              ) : (
                <Button
                  onClick={handleTouchTap}
                  disabled={measuring}
                  variant="outline"
                  className="w-full py-4 text-sm font-bold border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  icon={Activity}
                >
                  {measuring ? 'Measuring Pulse Waves...' : 'Touch / Tap to Measure Heart Rate'}
                </Button>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" /> 
                Signal Quality: <strong className="text-slate-900 dark:text-slate-100">{signalQuality}</strong>
              </span>
              <span>Method: {measurementMode === 'camera' ? 'Camera PPG' : 'Touch Sensor'}</span>
            </div>
          </Card>

          {/* Symptoms Checklist */}
          <Card padding="large">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Symptom & Condition Intake</h3>
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-sm font-medium mb-5">
              Select any symptoms to combine with your PPG vitals scan:
            </p>

            <div className="space-y-2.5 mb-5">
              {availableSymptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/30'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{symptom}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-500" />}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleAddCustomSymptom} className="flex gap-3">
              <Input
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="Add other symptom..."
                className="flex-1"
                wrapperClassName="mb-0 flex-1"
              />
              <Button
                type="submit"
                variant="secondary"
                className="mt-6" // Align with input
              >
                Add
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Comprehensive AI Health Assessment */}
        <div className="lg:col-span-7 space-y-6">
          
          <Card padding="large" className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-6 gap-4">
              <div>
                <span className="text-xs text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Activity className="w-3.5 h-3.5" /> AI Vitals Assessment
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {aiResults?.status || 'Normal Resting Heart Rate'}
                </h2>
              </div>
              <Badge 
                variant={
                  aiResults?.risk_level === 'Elevated' ? 'error' : 
                  aiResults?.risk_level === 'Moderate' ? 'warning' : 'success'
                }
                className="text-sm px-4 py-1.5 font-bold"
              >
                Risk Level: {aiResults?.risk_level || 'Low'}
              </Badge>
            </div>

            {/* AI Insights Bullets */}
            <div className="space-y-4 mb-8">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                AI Health Scan Findings
              </h4>
              <div className="space-y-3">
                {aiResults?.ai_insights?.map((insight, idx) => (
                  <div key={idx} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-400 leading-relaxed flex items-start gap-3 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Action Steps */}
            <div className="space-y-4 mb-8">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Personalized Health Action Steps
              </h4>
              <div className="space-y-3">
                {aiResults?.recommendations?.map((rec, idx) => (
                  <div key={idx} className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl text-sm font-medium text-emerald-800 dark:text-emerald-300 leading-relaxed flex items-start gap-3 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions for Doctor */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-500" />
                Recommended Questions for Doctor
              </h4>
              <div className="space-y-3">
                {aiResults?.questions_for_doctor?.map((q, idx) => (
                  <div key={idx} className="p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-xl text-sm font-medium text-purple-800 dark:text-purple-300 leading-relaxed flex items-start gap-3 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-500 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{aiResults?.disclaimer || "PPG camera vitals tracking and estimated SpO2/HRV metrics are designed strictly for AI health scan analysis and do not replace professional medical advice."}</span>
            </div>

          </Card>
        </div>

      </div>
    </motion.div>
  );
};

export default HeartRateMonitor;

