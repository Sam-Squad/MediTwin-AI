import React, { useState, useEffect } from 'react';
import { reportsApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { FileUp, FileText, Download, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MedicalReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await reportsApi.list();
      setReports(res.data);
      if (res.data.length > 0 && !selectedReport) {
        setSelectedReport(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await reportsApi.upload(formData);
      setReports((prev) => [res.data, ...prev]);
      setSelectedReport(res.data);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <DisclaimerBanner />

      <PageHeader 
        title="Medical PDF Reports" 
        subtitle="Upload CBC, blood reports, MRI/CT scans for Gemini 2.5 lab parameter interpretation."
        icon={FileText}
      />

      {/* Upload Drag & Drop Dropzone */}
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
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 scale-[1.01] shadow-soft' 
            : 'border-slate-200 dark:border-slate-700/80 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}>
          <input
            type="file"
            id="report-input"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="report-input" className="cursor-pointer block p-8 sm:p-12">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              {uploading ? <RefreshCw className="w-8 h-8 animate-spin" /> : <FileUp className="w-8 h-8" />}
            </div>
            <div className="text-base font-bold text-slate-800 dark:text-slate-100">
              {uploading ? 'Analyzing Report with Gemini 2.5...' : 'Click to Upload or Drag & Drop Lab PDF'}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Supports Blood Tests, CBC, Radiology, Discharge Summaries (PDF, PNG, JPEG)</div>
          </label>
        </Card>
      </div>

      {/* Main Grid: Sidebar List + Report Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Uploaded Reports ({reports.length})
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <Card
                hover
                padding="small"
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className={`cursor-pointer transition-all border ${
                  selectedReport?.id === rep.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 shadow-soft ring-1 ring-brand-500/50'
                    : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="pr-2">
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">{rep.filename}</div>
                    <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-1">{rep.report_type}</div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 shrink-0 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {new Date(rep.upload_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{rep.summary}</div>
              </Card>
            ))}
            {reports.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                No reports uploaded yet.
              </div>
            )}
          </div>
        </div>

        {/* Selected Report Detailed View */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div
                key={selectedReport.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="space-y-8" padding="large">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <Badge variant="info" className="mb-3">{selectedReport.report_type}</Badge>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white leading-tight">{selectedReport.filename}</h2>
                    </div>

                    <a
                      href={`/api/reports/${selectedReport.id}/download-pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="med-btn-primary med-btn-sm shrink-0 shadow-glass"
                    >
                      <Download className="w-4 h-4 mr-2" /> Download AI PDF
                    </a>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-500" /> AI Executive Summary
                    </h3>
                    <div className="bg-surface-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedReport.summary}
                      </p>
                    </div>
                  </div>

                  {/* Lab Parameters Table */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                      Extracted Lab Biomarkers ({selectedReport.findings?.length || 0})
                    </h3>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-surface-50 dark:bg-slate-900/50">
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                            <th className="py-3 px-4 font-semibold">Parameter</th>
                            <th className="py-3 px-4 font-semibold">Measured Value</th>
                            <th className="py-3 px-4 font-semibold">Reference Range</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold">Plain Explanation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                          {selectedReport.findings?.map((item, idx) => {
                            const isAbnormal = item.status === 'Low' || item.status === 'Elevated' || item.status === 'Critical';
                            return (
                              <tr key={idx} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${isAbnormal ? 'bg-amber-50/30 dark:bg-amber-500/5' : ''}`}>
                                <td className="py-4 px-4 font-bold text-slate-800 dark:text-white whitespace-nowrap">{item.parameter}</td>
                                <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{item.value}</td>
                                <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">{item.normal_range}</td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                  <Badge variant={isAbnormal ? (item.status === 'Critical' ? 'danger' : 'warning') : 'success'}>
                                    {item.status}
                                  </Badge>
                                </td>
                                <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-xs leading-relaxed min-w-[250px]">{item.explanation}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Questions for Doctor */}
                  {selectedReport.questions_for_doctor?.length > 0 && (
                    <div className="p-5 bg-brand-50 dark:bg-brand-900/10 rounded-2xl border border-brand-100 dark:border-brand-500/20">
                      <h4 className="text-sm font-bold text-brand-700 dark:text-brand-400 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Recommended Questions for Doctor
                      </h4>
                      <ul className="space-y-2 text-sm text-brand-800/80 dark:text-brand-200/80 font-medium">
                        {selectedReport.questions_for_doctor.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-brand-500 mt-0.5">•</span>
                            <span className="leading-snug">{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-16 text-center text-slate-500 min-h-[400px]">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-sm font-medium">Select or upload a report to view detailed AI analysis.</p>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicalReports;
