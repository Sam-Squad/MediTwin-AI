import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Pill, ImageIcon, Bot, ShieldAlert, Sparkles } from 'lucide-react';
import Card from '../ui/Card';

export const QuickActions = () => {
  const actions = [
    { title: 'Upload Lab Report', desc: 'Blood test, CBC, MRI PDF', path: '/reports', icon: FileUp, color: 'from-brand-500 to-brand-700' },
    { title: 'Scan Prescription', desc: 'Extract dosage & reminders', path: '/prescriptions', icon: Pill, color: 'from-medical-500 to-medical-700' },
    { title: 'Upload Radiology', desc: 'Chest X-Ray, CT, Ultrasound', path: '/medical-images', icon: ImageIcon, color: 'from-purple-500 to-purple-700' },
    { title: 'Ask RAG AI Chat', desc: 'Contextual report QA chatbot', path: '/chat', icon: Bot, color: 'from-cyan-500 to-cyan-700' },
    { title: 'Emergency Profile', desc: 'Instant QR code medical card', path: '/emergency', icon: ShieldAlert, color: 'from-rose-500 to-rose-700' },
    { title: 'Doctor Visit Sheet', desc: 'Printable prep copilot PDF', path: '/doctor-copilot', icon: Sparkles, color: 'from-amber-500 to-amber-700' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Link key={act.path} to={act.path} className="group outline-none">
            <Card hover padding="small" className="h-full flex flex-col justify-between p-4 group-focus-visible:ring-2 group-focus-visible:ring-brand-500">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${act.color} text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors leading-tight mb-1">{act.title}</div>
                <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{act.desc}</div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;
