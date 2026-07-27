import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MedicalReports from './pages/MedicalReports';
import RAGChat from './pages/RAGChat';
import Prescriptions from './pages/Prescriptions';
import Reminders from './pages/Reminders';
import HealthSummaryPage from './pages/HealthSummaryPage';
import MedicalImages from './pages/MedicalImages';
import ChatHistoryPage from './pages/ChatHistoryPage';
import DoctorCopilotPage from './pages/DoctorCopilotPage';
import TimelinePage from './pages/TimelinePage';
import WellnessPage from './pages/WellnessPage';
import EmergencyCardPage from './pages/EmergencyCardPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import HeartRateMonitor from './pages/HeartRateMonitor';

import { AnimatePresence, motion } from 'framer-motion';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="h-full"
  >
    {children}
  </motion.div>
);

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-xs text-slate-600 font-medium">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          Initializing MediTwin AI...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Mobile Header Toggle */}
        <div className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center px-4 sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-100 text-slate-900 hover:bg-brand-50 hover:text-brand-600 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <span className="ml-4 font-bold text-slate-900 tracking-tight">MediTwin AI</span>
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto w-full p-4 lg:p-8 lg:pt-10">
            <AnimatePresence mode="wait">
              <Routes key={location.pathname}>
                <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
                <Route path="/reports" element={<PageWrapper><MedicalReports /></PageWrapper>} />
                <Route path="/chat" element={<PageWrapper><RAGChat /></PageWrapper>} />
                <Route path="/prescriptions" element={<PageWrapper><Prescriptions /></PageWrapper>} />
                <Route path="/reminders" element={<PageWrapper><Reminders /></PageWrapper>} />
                <Route path="/summary" element={<PageWrapper><HealthSummaryPage /></PageWrapper>} />
                <Route path="/medical-images" element={<PageWrapper><MedicalImages /></PageWrapper>} />
                <Route path="/chat-history" element={<PageWrapper><ChatHistoryPage /></PageWrapper>} />
                <Route path="/doctor-copilot" element={<PageWrapper><DoctorCopilotPage /></PageWrapper>} />
                <Route path="/timeline" element={<PageWrapper><TimelinePage /></PageWrapper>} />
                <Route path="/wellness" element={<PageWrapper><WellnessPage /></PageWrapper>} />
                <Route path="/emergency" element={<PageWrapper><EmergencyCardPage /></PageWrapper>} />
                <Route path="/heart-rate" element={<PageWrapper><HeartRateMonitor /></PageWrapper>} />
                <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
                <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
