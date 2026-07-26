import React, { useState, useEffect } from 'react';
import { medicalImagesApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { ImageIcon, FileUp, CheckCircle, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MedicalImages = () => {
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fetchImages = async () => {
    try {
      const res = await medicalImagesApi.list();
      setImages(res.data);
      if (res.data.length > 0 && !activeImage) {
        setActiveImage(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await medicalImagesApi.upload(formData);
      setImages((prev) => [res.data, ...prev]);
      setActiveImage(res.data);
    } catch (err) {
      console.error(err);
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
        title="Medical Image Analysis" 
        subtitle="Upload Chest X-Rays, MRI scans, CT scans, and Ultrasound images for Gemini 2.5 Vision structural explanations."
        icon={ImageIcon}
      />

      {/* Upload Dropzone */}
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
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 scale-[1.01] shadow-soft' 
            : 'border-slate-200 dark:border-slate-700/80 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}>
          <input
            type="file"
            id="img-input"
            accept=".png,.jpg,.jpeg"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="img-input" className="cursor-pointer block p-8 sm:p-12">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              {uploading ? <RefreshCw className="w-8 h-8 animate-spin" /> : <FileUp className="w-8 h-8" />}
            </div>
            <div className="text-base font-bold text-slate-800 dark:text-slate-100">
              {uploading ? 'Analyzing Scan with Vision AI...' : 'Upload Medical Image or Radiology Scan'}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Chest X-Ray, Brain/Spine MRI, Abdominal Scan (PNG, JPEG)</div>
          </label>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scans List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Uploaded Scans ({images.length})
          </div>

          <div className="space-y-3">
            {images.map((img) => (
              <Card
                hover
                padding="small"
                key={img.id}
                onClick={() => setActiveImage(img)}
                className={`cursor-pointer transition-all border ${
                  activeImage?.id === img.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 shadow-soft ring-1 ring-purple-500/50'
                    : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1 mb-1">{img.filename}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">{img.image_type}</div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{new Date(img.upload_date).toLocaleDateString()}</div>
                </div>
              </Card>
            ))}
            {images.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                No images uploaded yet.
              </div>
            )}
          </div>
        </div>

        {/* Scan Details */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeImage ? (
              <motion.div
                key={activeImage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="space-y-8" padding="large">
                  <div className="pb-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <Badge variant="neutral" className="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 mb-3">
                        {activeImage.image_type}
                      </Badge>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white leading-tight">{activeImage.filename}</h2>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" /> Vision Observations Summary
                    </h3>
                    <div className="bg-surface-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {activeImage.findings_summary}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Notable Anatomical Findings</h3>
                    <div className="space-y-3">
                      {activeImage.notable_observations?.map((obs, idx) => (
                        <div key={idx} className="p-4 bg-surface-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 flex items-start gap-3 hover:border-purple-200 dark:hover:border-purple-500/30 transition-colors">
                          <CheckCircle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{obs}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeImage.questions_for_doctor?.length > 0 && (
                    <div className="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-500/20">
                      <h4 className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Questions to ask your radiologist/physician
                      </h4>
                      <ul className="space-y-2 text-sm text-purple-800/80 dark:text-purple-200/80 font-medium">
                        {activeImage.questions_for_doctor.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-purple-500 mt-0.5">•</span>
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
                <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-sm font-medium">Select or upload a radiology scan to view AI observations.</p>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicalImages;
