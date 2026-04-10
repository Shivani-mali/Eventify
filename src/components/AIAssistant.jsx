import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Zap, 
  Calendar, 
  Activity, 
  Plus,
  ArrowRight,
  X
} from 'lucide-react';

const AIAssistant = ({ onClose, pendingEvent }) => {
  const [user] = useAuthState(auth);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: pendingEvent 
      ? `I see you're planning "${pendingEvent.name}" for ${pendingEvent.date}! I've already performed a predictive analysis based on your ${pendingEvent.budget} budget and ${pendingEvent.guestCount} guests. What specific part of this plan would you like me to optimize?`
      : "Hello! I'm your Eventify AI. How can I help you optimize your schedule or provide strategic suggestions for your events today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "events"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAIResponse = (userQuery) => {
    const qLower = userQuery.toLowerCase();
    
    // RAG: Search for matching events
    const matchingEvent = events.find(e => 
      qLower.includes(e.name.toLowerCase()) || 
      qLower.includes(e.type.toLowerCase())
    );

    if (matchingEvent) {
      const budgetVal = parseFloat(matchingEvent.budget.replace(/[^0-9.-]+/g, "")) || 0;
      const guests = parseInt(matchingEvent.guestCount) || 0;

      let advice = `I've retrieved the data for "${matchingEvent.name}". Based on the ${matchingEvent.budget} budget and ${guests} guests, here is my strategic analysis: \n\n`;
      
      if (matchingEvent.type.toLowerCase().includes('birthday')) {
        advice += `• SUGGESTION: For a ${matchingEvent.theme} theme, I recommend a high-energy LED setup and a dedicated photo-booth corner near the ${matchingEvent.venue} entrance.\n`;
        advice += `• LOGISTICS: With ${guests} guests, ensure the cake-cutting area is elevated for maximum visibility.\n`;
      } else if (matchingEvent.type.toLowerCase().includes('wedding')) {
        advice += `• SUGGESTION: Prioritize acoustic management for the ${matchingEvent.venue}. With a budget of ${matchingEvent.budget}, allocate 15% for premium lighting to enhance the ${matchingEvent.theme} atmosphere.\n`;
        advice += `• LOGISTICS: Buffer your timeline by 45 minutes to accommodate guest movement.\n`;
      } else {
        advice += `• INSIGHT: Your logistic success rate is predicted at 94%. I recommend confirming vendors 72 hours before the start.\n`;
      }

      advice += `\nWould you like me to analyze the budget breakdown or staffing requirements?`;
      return advice;
    }

    if (qLower.includes("hello") || qLower.includes("hi")) {
      return "Hello! I can help you with event strategies, budget optimization, or logistical analysis. Ask me about one of your saved events!";
    }

    if (qLower.includes("budget") || qLower.includes("money")) {
      return "To give you proper budget tips, please mention which event you're asking about! For example: 'budget tips for my office party'.";
    }

    return "I couldn't find a specific event linked to your query. Try asking something like 'suggestions for [Event Name]' or 'analyze my budget'.";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Processing
    setTimeout(() => {
      const aiText = generateAIResponse(userMessage.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: aiText }]);
      setIsTyping(false);
    }, 1000);
  };

  const QuickTags = ["Best Time", "Budget Tips", "Staffing", "Logistics"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-6 right-6 z-[200] w-full max-w-[420px] h-[600px] bg-[#0A0A0A] border border-white/10 rounded-[3rem] shadow-3xl flex flex-col overflow-hidden backdrop-blur-3xl"
    >
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">AI Assistant</h3>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Neural Link Active</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
          <X size={20} />
        </button>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 text-cyan-400 border border-white/10'}`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white font-bold' : 'bg-white/5 text-gray-300 border border-white/5 whitespace-pre-line font-medium underline-offset-4'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 border border-white/10">
                 <Bot size={14} />
               </div>
               <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-1 items-center h-10">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
             </div>
          </div>
        )}
      </div>

      {/* Quick Access Tags */}
      <div className="px-6 pb-4 flex flex-wrap gap-2">
        {QuickTags.map((tag) => (
          <button 
            key={tag} 
            onClick={() => { setInput(`Give me ${tag.toLowerCase()} for my events`); }}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="p-6 bg-[#080808] border-t border-white/5 space-y-4">
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-white/5 border border-white/10 p-5 pr-16 rounded-[2rem] text-sm font-bold text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
          />
          <button 
            type="submit"
            className="absolute right-3 top-3 w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Zap size={18} />
          </button>
        </form>
        
        <button 
          onClick={onClose}
          className="w-full py-3 border border-white/5 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-rose-500 transition-all"
        >
          Disconnect Neural Link
        </button>
      </div>
    </motion.div>
  );
};

export default AIAssistant;
