import React, { useState, useEffect } from 'react';
import { timelineApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import { Calendar, FileText, Pill, ImageIcon, MessageSquare, Clock, Filter } from 'lucide-react';

export const TimelinePage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    timelineApi.get().then((res) => setEvents(res.data)).catch(console.error);
  }, []);

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    return e.event_type.includes(filter);
  });

  const getEventIcon = (type) => {
    if (type.includes('report')) return <FileText className="w-4 h-4 text-blue-400" />;
    if (type.includes('prescription') || type.includes('medicine')) return <Pill className="w-4 h-4 text-emerald-400" />;
    if (type.includes('image')) return <ImageIcon className="w-4 h-4 text-purple-400" />;
    return <MessageSquare className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="space-y-6 pb-12">
      <DisclaimerBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" /> Chronological Health Timeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete historical stream of lab reports, scans, prescriptions, reminders, and AI consultations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
          {['all', 'report', 'prescription', 'image'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                filter === cat ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-blue-500/40 transition">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getEventIcon(evt.event_type)}
                  <h3 className="font-bold text-sm text-white">{evt.title}</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(evt.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">{evt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelinePage;
