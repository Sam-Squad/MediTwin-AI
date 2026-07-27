import React, { useState, useEffect } from 'react';
import { reportsApi } from '../services/api';
import { FileText, UploadCloud, Eye, Download, Search, AlertCircle, FilePlus2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { PremiumButton } from '../components/ui/PremiumButton';

export default function MedicalReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReports = async () => {
    try {
      const res = await reportsApi.list();
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      await reportsApi.upload(formData);
      await fetchReports();
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredReports = reports.filter(r => 
    r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medical Reports</h1>
          <p className="text-slate-500 font-medium mt-1">Upload and manage your health documents securely.</p>
        </div>
        
        <div className="relative shrink-0">
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="file-upload" className="block">
            <PremiumButton as="span" icon={uploading ? null : FilePlus2} loading={uploading}>
              {uploading ? 'Uploading...' : 'Upload Report'}
            </PremiumButton>
          </label>
        </div>
      </motion.div>

      {/* Main Upload Dropzone */}
      {reports.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-10">
          <label htmlFor="file-upload" className="cursor-pointer group block">
            <GlassCard className="border-2 border-dashed border-brand-200 bg-brand-50/50 hover:bg-brand-50 hover:border-brand-400 flex flex-col items-center justify-center p-12 text-center transition-all duration-300">
              <div className="w-20 h-20 bg-white rounded-full shadow-glow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud size={32} className="text-brand-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Upload your first report</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-6">
                Drag and drop your medical reports here, or click to browse. Supported formats: PDF, JPG, PNG.
              </p>
              <span className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-sm text-slate-900 shadow-sm group-hover:border-brand-300 group-hover:text-brand-600 transition-colors">
                Select Files
              </span>
            </GlassCard>
          </label>
        </motion.div>
      )}

      {/* Search Bar */}
      {reports.length > 0 && (
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search reports by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none shadow-sm"
          />
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading ? (
            [1, 2, 3].map(i => (
              <GlassCard key={i} className="animate-pulse h-48 bg-slate-100" />
            ))
          ) : (
            filteredReports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard hover className="h-full flex flex-col !p-5 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 text-brand-600 rounded-xl flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <FileText size={24} />
                    </div>
                    {report.ai_analysis_status === 'completed' && (
                      <div className="flex items-center gap-1 bg-medical-50 text-medical-700 px-2 py-1 rounded-md border border-medical-100 text-[10px] font-bold uppercase tracking-wide">
                        <CheckCircle2 size={12} /> Analyzed
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1" title={report.title || report.filename}>
                      {report.title || report.filename}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      {report.category || 'General Report'} • {new Date(report.upload_date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100">
                    <a 
                      href={report.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold text-xs rounded-lg transition-colors"
                    >
                      <Eye size={14} /> View
                    </a>
                    <a 
                      href={report.file_url} 
                      download
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs rounded-lg transition-colors"
                    >
                      <Download size={14} /> Download
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {!loading && reports.length > 0 && filteredReports.length === 0 && (
        <div className="text-center py-20">
          <AlertCircle size={40} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-500 font-medium">No reports match your search query.</p>
        </div>
      )}
    </div>
  );
}
