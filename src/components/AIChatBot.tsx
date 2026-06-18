import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  CornerDownRight, 
  ArrowUpRight, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ChatHistoryItem } from '../types.ts';

const SUGGESTED_QUESTIONS = [
  "What AI solutions do you build?",
  "How can I get a custom SaaS quote?",
  "What is your email and WhatsApp?",
  "How long does custom web dev take?"
];

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatHistoryItem[]>([
    {
      id: 'init-1',
      role: 'model',
      parts: [{ text: "Hello! I am your Provider Place Digital Assistant. I can help answer questions about our premium software engineering, AI integrations, SaaS builds, and automation services. How can I help elevate your business today?" }],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Log interaction analytics
    if (isOpen) {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'bot_query', value: 'Chatbot Opened' })
      }).catch(() => {});
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsgId = 'user-' + Date.now();
    const newUserMessage: ChatHistoryItem = {
      id: userMsgId,
      role: 'user',
      parts: [{ text: textToSend }],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Map current messages list to format expected by backend Express route
      // which is { role: 'user' | 'model', parts: [{ text: string }] }
      const historyPayload = messages.map(m => ({
        role: m.role,
        parts: m.parts
      }));

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyPayload,
          message: textToSend
        })
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.reply) {
        setMessages(prev => [...prev, {
          id: 'bot-' + Date.now(),
          role: 'model',
          parts: [{ text: data.reply }],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error("AI chatbot error:", err);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: 'bot-err-' + Date.now(),
        role: 'model',
        parts: [{ text: "I apologize, our primary AI intelligence core is currently updating. However, our main engineering team is available directly right now! Click above to message on WhatsApp at +923126675235 or write to us at starpanther0@gmail.com." }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'init-1',
        role: 'model',
        parts: [{ text: "Hello again! I am fully refreshed. How can we deploy luxury solutions or custom business automation systems for you?" }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="floating-chat-container">
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-4 rounded-full bg-linear-to-r from-slate-900 to-indigo-950 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-indigo-500/30 cursor-pointer flex items-center justify-center"
        whileHover={{ rotate: 10 }}
        id="chatbot-toggle-btn"
      >
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur opacity-70 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X className="w-6 h-6 relative z-10" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 relative z-10" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full" />
          </div>
        )}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="absolute bottom-20 right-0 w-[92vw] sm:w-420px h-550px bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
            id="chatbot-panel"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between border-b border-indigo-500/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/40">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-wide flex items-center gap-1.5">
                    Provider Place Assistant
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-indigo-300 font-mono">Powered by Gemini AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={resetChat} 
                  className="p-1.5 rounded-md hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                  title="Reset Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 rounded-md hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Direct Contact Banner */}
            <div className="bg-linear-to-r from-indigo-50 to-blue-50/50 px-4 py-2 text-xs text-indigo-950 font-medium border-b border-indigo-100 flex justify-between items-center gap-2">
              <span className="truncate">Need quick pricing? Message us directly:</span>
              <div className="flex gap-2 shrink-0">
                <a 
                  href="https://wa.me/923126675235" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full hover:bg-emerald-700 transition-colors flex items-center gap-0.5"
                >
                  WhatsApp <ArrowUpRight className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* Message Pane */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" id="chatbot-messages-pane">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 self-start">
                      <Bot className="w-4 h-4 text-indigo-600" />
                    </div>
                  )}
                  <div className={`max-w-[78%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.parts[0].text}
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && !isTyping && (
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-mono mb-1.5 flex items-center gap-1.5">
                  <CornerDownRight className="w-3 h-3 text-indigo-500" /> Suggested queries
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(q)}
                      className="text-[11px] text-indigo-950 font-medium bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg px-2.5 py-1 text-left cursor-pointer transition-all duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
              className="p-3 bg-white border-t border-slate-200 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about website, SaaS or AI quotes..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all font-sans"
                id="chatbot-input-field"
              />
              <button
                type="submit"
                className="bg-slate-900 border border-slate-800 text-white rounded-xl p-2.5 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 hover:scale-105 active:scale-95 cursor-pointer transition-all"
                id="chatbot-send-btn"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
