import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

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
  const location = window.location;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-100 dark:bg-dark flex items-center justify-center text-xs text-slate-500">
        Initializing MediTwin AI Healthcare Companion...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-dark flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex-1 flex w-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 lg:p-8 min-w-0 overflow-x-hidden max-w-7xl mx-auto w-full">
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
        </main>
      </div>
      <Footer />
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
