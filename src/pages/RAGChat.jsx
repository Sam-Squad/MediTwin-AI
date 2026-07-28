import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatApi } from '../services/api';
import { Send, Bot, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const SUGGESTED_PROMPTS = [
  "Explain my latest blood test results",
  "What are the side effects of my medication?",
  "Analyze my recent heart rate trends",
];

export default function RAGChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: `Hello ${user?.name || ''}! I'm TwinCare AI, your health companion. I've reviewed your latest reports and vitals. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatApi.send(null, text);
      const botMsg = { id: Date.now() + 1, role: 'assistant', text: res.data.content };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'system', 
        text: 'Sorry, I encountered an error connecting to the health database. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-7rem)] flex flex-col relative max-w-6xl mx-auto w-full -mt-2">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200/50 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-glow">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">TwinCare AI</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-medical-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-medical-600">Secure Medical Context Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 hover:bg-slate-100 rounded-xl text-slate-900 transition-colors"
          title="Clear Chat"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide pb-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={twMerge(
                "flex max-w-[85%] gap-4",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {/* Avatar */}
              <div className={twMerge(
                "w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1",
                msg.role === 'user' ? "bg-slate-200" : 
                msg.role === 'system' ? "bg-red-100" : "bg-brand-100 text-brand-600"
              )}>
                {msg.role === 'user' ? <User size={16} className="text-slate-900" /> : 
                 msg.role === 'system' ? <AlertCircle size={16} className="text-red-500" /> : <Sparkles size={16} />}
              </div>

              {/* Message Bubble */}
              <div className={twMerge(
                "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-brand-100 text-brand-900 rounded-tr-sm shadow-glow-sm" 
                  : msg.role === 'system'
                  ? "bg-red-50 text-red-600 border border-red-100 rounded-tl-sm"
                  : "bg-white border border-brand-200 text-brand-900 rounded-tl-sm"
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex mr-auto gap-4 max-w-[85%]"
            >
              <div className="w-8 h-8 shrink-0 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mt-1">
                <Sparkles size={16} />
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 shrink-0">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-xs font-semibold px-3 py-1.5 bg-white border border-brand-200 text-brand-700 rounded-full hover:border-brand-400 hover:bg-brand-50 hover:text-brand-800 transition-colors shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        
        <GlassCard className="!p-2 flex items-center gap-2 border border-brand-200/50 shadow-glass-dark">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your health, lab results, or symptoms..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-brand-900 placeholder:text-brand-400 px-4 py-2 outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 shrink-0 bg-brand-500 rounded-xl flex items-center justify-center text-white disabled:opacity-50 hover:bg-brand-600 transition-colors shadow-glow-sm"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
