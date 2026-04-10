import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  BarChart3, TrendingUp, PieChart, Users, Zap, 
  ShieldCheck, Target, ChevronDown, Calendar, 
  Activity, Bot, Lightbulb, MessageSquare
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const Analytics = () => {
  const [user] = useAuthState(auth);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "events"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(fetchedEvents);
      if (fetchedEvents.length > 0 && !selectedEvent) {
        setSelectedEvent(fetchedEvents[0]);
      }
    });
    return unsubscribe;
  }, [user]);

  // Derived Data for Charts & RAG Simulation
  const chartData = selectedEvent ? [
    { name: 'Preparation', val: 75 },
    { name: 'Logistic', val: 92 },
    { name: 'Guest Sat', val: 88 },
    { name: 'Timeline', val: selectedEvent.guestCount > 100 ? 95 : 85 },
    { name: 'Efficiency', val: 91 },
  ] : [];

  const getAIAdvice = () => {
    if (!selectedEvent) return null;
    const type = selectedEvent.type?.toLowerCase() || '';
    
    if (type.includes('wedding')) {
      return {
        strategy: "Focus on 'Experience Architecture'. With a budget of " + selectedEvent.budget + ", prioritize the venue aesthetics over high-count menu items.",
        risk: "Budget creep is high in luxury florals. Stick to the generated plan.",
        insight: "Your guest count of " + selectedEvent.guestCount + " requires at least 3 coordination staff members."
      };
    } else if (type.includes('corporate') || type.includes('business')) {
      return {
        strategy: "Networking optimization is key. Use the 'Digital ID' feature to track attendee interactions.",
        risk: "Low engagement during keynote sessions. Consider 'Interactive Q&A' modules.",
        insight: "Projected ROI based on budget efficiency is 4.8x."
      };
    }
    return {
      strategy: "Balanced Resource Allocation. Ensure vendor contracts are finalized at least 2 weeks prior.",
      risk: "Minor logistical delays may occur due to guest count density.",
      insight: "Your event efficiency score is currently 91/100."
    };
  };

  const aiAnalysis = getAIAdvice();
  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 bg-[#030712] min-h-screen text-white overflow-x-hidden">
      {/* Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-2 leading-tight uppercase italic flex flex-wrap items-center gap-3">
              <Zap className="text-yellow-400 w-8 h-8 md:w-12 md:h-12" /> Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Insights</span>
            </h1>
            <p className="text-gray-500 font-bold text-xs sm:text-sm md:text-lg uppercase tracking-widest italic flex items-center gap-2">
               <Activity size={18} className="text-cyan-500" /> Advanced AI Analysis
            </p>
         </motion.div>

         <div className="relative z-[60] w-full md:w-auto">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full md:w-auto px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:border-cyan-500/30 transition-all backdrop-blur-xl"
            >
               <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 flex-shrink-0">
                  <Calendar size={20} />
               </div>
               <div className="text-left flex-1 min-w-[140px]">
                  <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Selected Event</div>
                  <div className="text-sm font-black text-white italic uppercase truncate w-full">
                    {selectedEvent ? selectedEvent.name : "Select Event"}
                  </div>
               </div>
               <ChevronDown className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} size={16} />
            </button>

            <AnimatePresence>
               {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 w-full md:w-80 mt-2 bg-[#0A101F]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-3xl p-3 z-[100] max-h-[60vh] overflow-y-auto"
                  >
                     {events.length === 0 ? (
                        <div className="p-6 text-xs font-black text-gray-500 text-center uppercase tracking-widest">No plans found.</div>
                     ) : (
                        events.map(event => (
                           <button 
                              key={event.id}
                              onClick={() => {
                                 setSelectedEvent(event);
                                 setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left p-4 rounded-2xl mb-1 transition-all flex items-center gap-4 ${
                                 selectedEvent?.id === event.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                              }`}
                           >
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-black uppercase opacity-60 mb-1">{event.type}</div>
                                <div className="text-sm font-black uppercase italic truncate">{event.name}</div>
                              </div>
                              <Zap size={14} className="flex-shrink-0" />
                           </button>
                        ))
                     )}
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>

      {!selectedEvent ? (
         <div className="glass-card rounded-[3rem] py-20 px-6 text-center flex flex-col items-center border-dashed border-2 border-white/5">
            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 text-gray-700 animate-pulse">
               <Bot size={48} />
            </div>
            <h2 className="text-3xl font-black italic uppercase text-white mb-4">Awaiting Signal...</h2>
            <p className="text-gray-500 font-bold max-w-md text-sm md:text-base leading-relaxed">
              Our AI analysis engine is ready. Please select an event plan from the dropdown to start the deep-data retrieval and strategic analysis.
            </p>
         </div>
      ) : (
         <div className="space-y-8 md:space-y-12 pb-20">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
               {[
                  { icon: <Users />, label: 'Guest Capacity', val: selectedEvent.guestCount, color: 'blue', tag: 'verified' },
                  { icon: <Activity />, label: 'Logistic Flow', val: '94%', color: 'cyan', tag: 'optimized' },
                  { icon: <Activity />, label: 'Theme Match', val: '98%', color: 'purple', tag: 'premium' },
                  { icon: <Activity />, label: 'Budget Total', val: selectedEvent.budget, color: 'rose', tag: 'locked' }
               ].map((stat, i) => (
                  <div key={i} className="glass-card p-6 md:p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all">
                    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform`} />
                    <div className={`text-${stat.color}-500 mb-6 scale-125 origin-left`}>{stat.icon}</div>
                    <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-2xl md:text-4xl font-black truncate italic text-white uppercase leading-tight mb-3">{stat.val}</div>
                    <div className={`inline-block px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-${stat.color}-500/10 text-${stat.color}-500 border border-${stat.color}-500/20`}>
                      {stat.tag}
                    </div>
                  </div>
               ))}
            </div>

            {/* AI ANALYSIS SECTION */}
            <section className="grid lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 space-y-6">
                  <div className="glass-card rounded-[3rem] p-8 md:p-10 border-white/5 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <Lightbulb className="text-yellow-400" size={24} />
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">AI Strategic Report</h3>
                      </div>
                      <div className="space-y-8">
                         <div>
                            <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">Core Strategy</div>
                            <p className="text-sm font-bold text-gray-300 leading-relaxed italic border-l-2 border-cyan-500/30 pl-4">
                              "{aiAnalysis.strategy}"
                            </p>
                         </div>
                         <div>
                            <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Security Risk</div>
                            <p className="text-sm font-bold text-gray-300 leading-relaxed border-l-2 border-rose-500/30 pl-4">
                              {aiAnalysis.risk}
                           </p>
                         </div>
                      </div>
                    </div>
                    <div className="mt-10 p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center gap-4">
                       <MessageSquare size={32} className="text-blue-500 opacity-50" />
                       <div className="text-xs font-bold text-blue-400/80 italic">"{aiAnalysis.insight}"</div>
                    </div>
                  </div>
               </div>

               <div className="lg:col-span-2 glass-card rounded-[3rem] p-8 md:p-12 border-white/5 min-h-[450px]">
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Event Performance Matrix</h3>
                     <div className="hidden sm:block px-4 py-1.5 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">Active Analysis</div>
                  </div>
                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                           <defs>
                              <linearGradient id="colorSucc" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                           <XAxis dataKey="name" stroke="#6b7280" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                           <YAxis stroke="#6b7280" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} domain={[0, 100]} />
                           <Tooltip 
                              contentStyle={{ backgroundColor: '#0A0A0A', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                              itemStyle={{ fontWeight: 'bold' }}
                           />
                           <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSucc)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </section>
            
            {/* Visual Breakdown */}
            <div className="glass-card rounded-[3rem] p-8 md:p-12 border-white/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Granular Engagement Mix</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full" />
                    <span className="text-[10px] font-black uppercase text-gray-500">Live Trend</span>
                  </div>
              </div>
              <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} fontWeight="black" axisLine={false} tickLine={false} />
                        <YAxis stroke="#6b7280" fontSize={12} fontWeight="black" axisLine={false} tickLine={false} />
                        <Tooltip 
                          cursor={{fill: 'rgba(255,255,255,0.05)'}}
                          contentStyle={{ backgroundColor: '#0A0A0A', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px' }}
                        />
                        <Bar dataKey="val" radius={[15, 15, 0, 0]}>
                          {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                    </BarChart>
                  </ResponsiveContainer>
              </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Analytics;
