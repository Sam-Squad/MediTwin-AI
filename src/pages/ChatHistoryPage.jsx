import React, { useState, useEffect } from 'react';
import { chatApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import { History, Search, Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ChatHistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState('');

  const fetchSessions = async () => {
    try {
      const res = await chatApi.listSessions(search);
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [search]);

  const handleDelete = async (id) => {
    try {
      await chatApi.deleteSession(id);
      setSessions((prev) => prev.filter(s => s.chat_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <DisclaimerBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-blue-500" /> RAG Medical Chat History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, review, continue, or delete prior AI medical consultations.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chat history..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((s) => (
          <div key={s.chat_id} className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {s.messages_count || 2} Messages
                </span>
                <span className="text-[10px] text-slate-500">{new Date(s.last_updated).toLocaleDateString()}</span>
              </div>
              <h3 className="font-bold text-sm text-white mt-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{s.title}</span>
              </h3>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleDelete(s.chat_id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>

              <Link
                to="/chat"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-glow"
              >
                Continue Chat <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistoryPage;
