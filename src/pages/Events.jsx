import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase';
import { collection, query, onSnapshot, orderBy, where, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Calendar as CalendarIcon, 
  Clock, 
  Zap, 
  MapPin, 
  Bot, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Trash2
} from 'lucide-react';

const Events = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [reminders, setReminders] = useState([]);

  // Fetch Events from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "events"), 
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllEvents(docs);
      
      // Filter for Reminders (upcoming)
      const now = new Date().toISOString().split('T')[0];
      setReminders(docs.filter(e => e.date >= now).slice(0, 3));
    });
    return unsubscribe;
  }, []);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days };
  };

  const handleDateClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(dateStr);
    const filtered = allEvents.filter(e => e.date === dateStr);
    setSelectedDateEvents(filtered);
    
    // Smooth scroll to event list if needed
    const el = document.getElementById('selected-date-panel');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to cancel and remove this event?")) return;
    try {
      await deleteDoc(doc(db, "events", id));
      // Update local view
      setSelectedDateEvents(selectedDateEvents.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const renderCalendar = () => {
    const { firstDay, days } = getDaysInMonth(currentDate);
    const calendarDays = [];

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="h-20 md:h-32 border-r border-b border-white/5 opacity-0" />);
    }

    // Actual days
    for (let d = 1; d <= days; d++) {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hasEvents = allEvents.some(e => e.date === dateStr);
        const isSelected = selectedDateStr === dateStr;

        calendarDays.push(
          <motion.div 
            key={d} 
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            onClick={() => handleDateClick(d)}
            className={`h-20 md:h-32 border-r border-b border-white/5 p-4 cursor-pointer transition-all relative ${isSelected ? 'bg-blue-600/10' : ''}`}
          >
            <span className={`text-sm font-bold ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>{d}</span>
            {hasEvents && (
               <div className="absolute bottom-4 left-4 flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               </div>
            )}
          </motion.div>
        );
    }

    return calendarDays;
  };

  // Chat Logic
  const [messages, setMessages] = useState([{ role: 'ai', text: "How can I help you optimize your schedule today?" }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "I'm analyzing your request... Based on your current event density, I suggest keeping the buffer times at 30 minutes.";
      
      const lowerText = text.toLowerCase();
      // RAG Logic: Check if user is asking about a specific saved event
      const mentionedEvent = allEvents.find(e => lowerText.includes(e.name.toLowerCase()) || lowerText.includes(e.type.toLowerCase()));

      if (mentionedEvent) {
          response = `I've retrieved the data for "${mentionedEvent.name}". Based on the ₹${mentionedEvent.budget} budget and ${mentionedEvent.guestCount} guests, I predict a 94% logistical success rate. I recommend confirming the ${mentionedEvent.venue} 48 hours before the start.`;
      } else if (lowerText.includes('time')) {
          response = "Optimal peak turnout is between 8:00 PM and 9:30 PM for your upcoming schedule.";
      } else if (lowerText.includes('budget')) {
          const totalBudget = allEvents.reduce((acc, curr) => acc + parseInt(curr.budget.replace(/[^\d]/g, '') || 0), 0);
          response = `You have ₹${totalBudget.toLocaleString()} locked in upcoming events. I suggest a 10% contingency buffer for unforeseen vendor costs.`;
      }
      
      setMessages([...newMessages, { role: 'ai', text: response }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 bg-[#0A0A0A] min-h-screen text-white">
      {/* 1. REMINDERS SECTION */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-8">
          <Bell className="text-blue-500" size={24} />
          <h2 className="text-2xl font-black tracking-tighter uppercase italic">Upcoming Reminders</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reminders.length > 0 ? reminders.map((rem) => (
            <motion.div key={rem.id} className="glass-card p-6 rounded-[2rem] border-white/5 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/10 uppercase italic">{rem.type}</div>
                <div className="text-gray-500"><Clock size={16} /></div>
              </div>
              <h3 className="text-xl font-black mb-1 uppercase italic tracking-tight">{rem.name}</h3>
              <p className="text-gray-400 font-bold flex items-center gap-2 italic"><Sparkles size={14} className="text-yellow-500" />{rem.date}</p>
            </motion.div>
          )) : (
            <div className="col-span-3 py-12 text-center glass-card rounded-[2rem] border-dashed border-white/5 text-gray-600 font-bold">
               No upcoming reminders found.
            </div>
          )}
        </div>
      </section>

      {/* 2. CALENDAR INTEGRATION */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-purple-500" size={24} />
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Event Calendar</h2>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
             <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-white/10 rounded-xl transition-all"><ChevronLeft size={20}/></button>
             <span className="text-sm font-black uppercase tracking-[0.2em] min-w-[150px] text-center">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
             <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-white/10 rounded-xl transition-all"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden">
           <div className="grid grid-cols-7 bg-white/5 border-b border-white/5">
              {days.map(d => <div key={d} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-500 border-r border-white/5 last:border-0">{d}</div>)}
           </div>
           <div className="grid grid-cols-7">
              {renderCalendar()}
           </div>
        </div>

        {/* Selected Date Panel */}
        <div id="selected-date-panel" className="mt-8">
           <AnimatePresence mode="wait">
              {selectedDateStr && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-[2.5rem] p-8 border-white/5"
                >
                  <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6 text-blue-400">Events on {selectedDateStr}</h3>
                  <div className="space-y-4">
                    {selectedDateEvents.length > 0 ? selectedDateEvents.map(e => (
                      <div key={e.id} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><Sparkles size={24}/></div>
                           <div>
                             <h4 className="text-xl font-black italic uppercase">{e.name}</h4>
                             <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{e.venue} • {e.type}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="text-right hidden md:block">
                              <div className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">Budget</div>
                              <div className="text-lg font-black text-white">{e.budget}</div>
                           </div>
                           <button 
                             onClick={(ev) => { ev.stopPropagation(); handleDeleteEvent(e.id); }} 
                             className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                             title="Cancel Event"
                           >
                              <Trash2 size={18} />
                           </button>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-600 font-bold italic py-4 text-center">No events scheduled for this day.</p>
                    )}
                  </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </section>

      {/* 3. AI ASSISTANT / HELP PANEL */}
      <section className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
           <div className="flex items-center gap-2 mb-8">
             <Bot className="text-cyan-400" size={24} />
             <h2 className="text-2xl font-black tracking-tighter uppercase italic">AI Smart Suggestions</h2>
           </div>
           <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Peak Turnout Time", desc: "Based on trends, 8:45 PM is perfect for your keynote.", icon: <Clock /> },
                { title: "Resource Optimization", desc: "Reduce catering waste by 15% with guest-flow tracking.", icon: <Zap /> },
                { title: "Venue Match", desc: "Nexus Hub is 92% match for your capacity requirements.", icon: <MapPin /> },
                { title: "Risk Warning", desc: "Weather alert for outdoor setup. Recommending tent booking.", icon: <Bell /> }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] hover:border-cyan-500/30 transition-all group">
                   <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                   <h3 className="text-xl font-black mb-2 tracking-tight">{item.title}</h3>
                   <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-1">
           <div className="glass-card p-10 rounded-[3rem] border-white/5 h-full relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -z-10" />
              <div>
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><MessageSquare size={20} /></div>
                   <h3 className="text-xl font-black tracking-tight italic">AI Assistant</h3>
                </div>
                <div className="space-y-4 mb-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                   {messages.map((m, i) => (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i} className={`p-4 rounded-2xl text-sm font-medium border border-white/5 ${m.role === 'ai' ? 'bg-white/5 text-gray-400 italic' : 'bg-blue-600/10 text-blue-400 ml-8'}`}>
                        {m.text}
                     </motion.div>
                   ))}
                   {isTyping && <div className="text-xs text-gray-500 animate-pulse italic ml-2">AI is thinking...</div>}
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["Best Time", "Budget Tips", "Staffing", "Logistics"].map(tag => (
                    <button key={tag} onClick={() => sendMessage(tag)} className="px-4 py-2 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all">{tag}</button>
                  ))}
               </div>
              </div>
              <div className="relative">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputValue); }}>
                  <input type="text" className="w-full px-6 py-5 rounded-2xl border border-white/10 bg-white/5 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-sm" placeholder="Ask anything..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-xl text-white shadow-lg active:scale-95 transition-all"><Zap size={18}/></button>
                </form>
              </div>
           </div>
        </div>
      </section>

      {/* Footer Redirect */}
      <section className="mt-24 text-center">
         <Link to="/create-event" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-[2.5rem] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase italic tracking-widest">
            <Plus size={24} /> Create New Event
         </Link>
      </section>
    </div>
  );
};

export default Events;
