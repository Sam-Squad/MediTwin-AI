import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../services/api';
import DisclaimerBanner from '../components/ui/DisclaimerBanner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  Bot, Send, User, Sparkles, FileText, Plus, Trash2,
  Mic, MicOff, Volume2, VolumeX, Image as ImageIcon,
  Palette, Camera, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RAGChat = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [attachedImage, setAttachedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const fetchSessions = async () => {
    try {
      const res = await chatApi.listSessions();
      setSessions(res.data);
      if (res.data.length > 0 && !currentSessionId) {
        setCurrentSessionId(res.data[0].chat_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (currentSessionId) {
      chatApi.getSession(currentSessionId).then((res) => {
        setMessages(res.data);
      }).catch(console.error);
    }
  }, [currentSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech-to-Text Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputMessage(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. Please use Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Text-to-Speech Handler
  const speakText = (msgId, text) => {
    if (!('speechSynthesis' in window)) {
      alert('Text to speech is not supported in this browser.');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text from markdown formatting
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Image Upload (Image-to-Text OCR)
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e, forceDiagramPrompt = false) => {
    if (e) e.preventDefault();
    if ((!inputMessage.trim() && !attachedImage && !forceDiagramPrompt) || sending) return;

    const userText = inputMessage || (forceDiagramPrompt ? "Generate a medical diagram illustration" : "Attached image analysis");
    const imgPayload = attachedImage;

    setInputMessage('');
    setAttachedImage(null);
    setSending(true);

    // Optimistic UI insert
    const tempUserMsg = {
      id: Date.now().toString(),
      chat_id: currentSessionId || 'new-session',
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
      attached_image_url: imgPayload
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await chatApi.send(currentSessionId, userText, imgPayload, forceDiagramPrompt ? "Generate medical diagram" : null);
      if (!currentSessionId) {
        setCurrentSessionId(res.data.chat_id);
        fetchSessions();
      }
      setMessages((prev) => [...prev.filter(m => m.id !== tempUserMsg.id), tempUserMsg, res.data]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    window.speechSynthesis?.cancel();
    setSpeakingMsgId(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 pb-12 h-[calc(100vh-100px)] flex flex-col"
    >
      <DisclaimerBanner />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Chat Sessions Sidebar */}
        <Card className="lg:col-span-3 flex flex-col justify-between overflow-hidden" padding="medium">
          <div>
            <Button
              onClick={handleNewChat}
              variant="primary"
              className="w-full mb-5"
              icon={Plus}
            >
              Start New Medical Chat
            </Button>

            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
              Previous Conversations
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[45vh] pr-1">
              {sessions.map((s) => (
                <div
                  key={s.chat_id}
                  onClick={() => setCurrentSessionId(s.chat_id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    currentSessionId === s.chat_id
                      ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/30 ring-1 ring-brand-500/50'
                      : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`text-sm font-medium line-clamp-1 ${currentSessionId === s.chat_id ? 'text-brand-700 dark:text-brand-300 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>{s.title}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                    {new Date(s.last_updated).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
            <Button
              onClick={() => handleSend(null, true)}
              variant="outline"
              className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-500/30 dark:text-purple-300 dark:hover:bg-purple-500/10"
              icon={Palette}
            >
              Generate Medical Diagram
            </Button>
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-2">
              <span>🎙️ Voice Chat</span>
              <span>•</span>
              <span>📷 Image OCR</span>
              <span>•</span>
              <span>🎨 Diagram AI</span>
            </div>
          </div>
        </Card>

        {/* Main Chat Interface */}
        <Card className="lg:col-span-9 flex flex-col justify-between overflow-hidden relative" padding="none">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-surface-50 dark:bg-slate-900/50 z-10 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200 dark:border-brand-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Multimodal Medical Copilot</h3>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Voice STT/TTS & Gemini 2.5 Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <AnimatePresence>
                {isListening && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="px-3 py-1.5 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-full font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Mic className="w-3.5 h-3.5 animate-pulse" /> Listening...
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-transparent">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4 py-8">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center border border-brand-100 dark:border-brand-500/20 mb-2">
                  <Bot className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">How can I help with your health today?</h3>
                <p className="max-w-md text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  Speak via microphone (Speech-to-Text), listen to responses (Text-to-Speech), upload prescription images (Image-to-Text OCR), or generate medical diagrams (Text-to-Image).
                </p>
                <div className="flex flex-wrap gap-3 justify-center pt-4">
                  <button
                    onClick={() => setInputMessage("Explain my hemoglobin and glucose lab results in simple terms")}
                    className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
                  >
                    💡 Explain my lab report
                  </button>
                  <button
                    onClick={() => handleSend(null, true)}
                    className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-xl text-sm font-medium border border-purple-200 dark:border-purple-700/50 shadow-sm transition-colors"
                  >
                    🎨 Generate Medical Diagram
                  </button>
                </div>
              </div>
            ) : (
              messages.map((m) => {
                const isUser = m.role === 'user';
                const isSpeaking = speakingMsgId === m.id;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={m.id}
                    className={`flex items-start gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm ${
                      isUser 
                        ? 'bg-brand-600 text-white shadow-brand-500/20' 
                        : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                    }`}>
                      {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>

                    <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-tr-none shadow-brand-500/10'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
                    }`}>
                      {/* Attached Image Preview */}
                      {m.attached_image_url && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-white/20 dark:border-slate-700 max-w-xs shadow-sm">
                          <img src={m.attached_image_url} alt="Attached medical scan" className="w-full h-auto object-cover" />
                        </div>
                      )}

                      <div className="whitespace-pre-wrap font-medium">{m.content}</div>

                      {/* Text-to-Image Generated Diagram */}
                      {m.generated_image_url && (
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-500/30">
                          <div className="text-xs font-bold text-purple-600 dark:text-purple-300 mb-3 flex items-center gap-1.5">
                            <Palette className="w-4 h-4 text-purple-500" /> Generated Medical Visual Illustration
                          </div>
                          <img
                            src={m.generated_image_url}
                            alt="Medical Diagram"
                            className="w-full h-auto max-h-64 object-contain rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-black/50"
                          />
                        </div>
                      )}

                      {/* Bottom Action Bar */}
                      <div className={`mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium border-t ${isUser ? 'border-brand-500/50' : 'border-slate-100 dark:border-slate-700/80'}`}>
                        {m.referenced_files?.length > 0 ? (
                          <span className={`${isUser ? 'text-brand-100' : 'text-brand-600 dark:text-brand-400'} flex items-center gap-1.5`}>
                            <FileText className="w-3.5 h-3.5" /> Grounded in: {m.referenced_files.join(', ')}
                          </span>
                        ) : <span />}

                        {/* Read Aloud Button (TTS) */}
                        {!isUser && (
                          <button
                            onClick={() => speakText(m.id, m.content)}
                            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                              isSpeaking
                                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/50 animate-pulse'
                                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                            }`}
                            title="Read response aloud (Text-to-Speech)"
                          >
                            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-brand-500" />}
                            <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
            {sending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-sm font-medium text-brand-600 dark:text-brand-400 p-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center animate-bounce">
                  <Bot className="w-4 h-4" />
                </div>
                MediTwin AI is thinking...
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area Background Layer */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 relative z-20">
            {/* Attached Image Thumbnail Preview before sending */}
            <AnimatePresence>
              {attachedImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-3 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between max-w-xs shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img src={attachedImage} alt="Attachment preview" className="w-12 h-12 object-cover rounded-lg border border-slate-100 dark:border-slate-700" />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">Image attached for OCR</span>
                  </div>
                  <button onClick={() => setAttachedImage(null)} className="text-rose-500 dark:text-rose-400 text-xs font-bold px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                    Remove
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Multimodal Input Toolbar */}
            <form onSubmit={handleSend} className="flex items-end gap-2 sm:gap-3">
              {/* Image Attachment Button (Image-to-Text OCR) */}
              <input
                type="file"
                id="chat-image-input"
                accept=".png,.jpg,.jpeg"
                onChange={handleImageSelect}
                className="hidden"
              />
              <label
                htmlFor="chat-image-input"
                className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer transition-colors border border-transparent dark:border-slate-700 shrink-0"
                title="Attach Prescription or Lab Scan Image (Image-to-Text OCR)"
              >
                <Camera className="w-5 h-5 text-purple-500" />
              </label>

              {/* Speech to Text Microphone Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-3 rounded-xl border transition-all shrink-0 ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-transparent dark:border-slate-700'
                }`}
                title="Voice Input (Speech-to-Text)"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-500" />}
              </button>

              {/* Message Text Input */}
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder={isListening ? "Listening to your voice..." : "Ask a medical question, upload a scan..."}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none max-h-32"
                  rows={1}
                  style={{ minHeight: '48px' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending || (!inputMessage.trim() && !attachedImage)}
                className="p-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 transition-all shrink-0 flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default RAGChat;
