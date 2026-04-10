import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Bot, 
  Sparkles, 
  MessageSquare,
  Zap,
  Clock,
  MapPin,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock Reminders Data
  const reminders = [
    { id: 1, name: "Tech Summit 2026", time: "in 2 hours", type: "Corporate", color: "blue" },
    { id: 2, name: "AI Workshop", time: "Tomorrow, 10 AM", type: "Education", color: "purple" },
    { id: 3, name: "Product Launch", time: "Friday", type: "Marketing", color: "cyan" }
  ];

  // Helper for Calendar
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const renderCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);
    
    let calendarDays = [];
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-24 md:h-32 border border-white/5 opacity-20" />);
    }
    for (let d = 1; d <= totalDays; d++) {
      const isToday = d === new Date().getDate() && month === new Date().getMonth();
      calendarDays.push(
        <div key={d} className={`h-24 md:h-32 border border-white/5 p-2 transition-all hover:bg-white/5 cursor-pointer relative group ${isToday ? 'bg-blue-500/5' : ''}`}>
          <span className={`text-sm font-black ${isToday ? 'text-blue-500' : 'text-gray-500'}`}>{d}</span>
          {d % 7 === 0 && (
            <div className="mt-2 p-1 bg-blue-500/20 text-blue-400 text-[8px] md:text-[10px] font-black uppercase rounded truncate border border-blue-500/20">
              Demo Event
            </div>
          )}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-lg pointer-events-none" />
        </div>
      );
    }
    return calendarDays;
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
          {reminders.map((rem) => (
            <motion.div 
              key={rem.id}
              whileHover={{ y: -5 }}
              className="glass-card p-6 rounded-[2rem] border-white/5 relative overflow-hidden group"
            >
              <div className={`absolute -right-8 -top-8 w-24 h-24 bg-${rem.color}-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 bg-${rem.color}-500/10 text-${rem.color}-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-${rem.color}-500/10`}>
                  {rem.type}
                </div>
                <div className="text-gray-500"><Clock size={16} /></div>
              </div>
              <h3 className="text-xl font-black mb-1 group-hover:text-blue-400 transition-colors uppercase italic tracking-tight">{rem.name}</h3>
              <p className="text-gray-400 font-bold flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-500" />
                {rem.time}
              </p>
            </motion.div>
          ))}
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
                   <h3 className="text-xl font-black tracking-tight">AI Assistant</h3>
                </div>
                <div className="space-y-4 mb-8">
                   <div className="p-4 bg-white/5 rounded-2xl text-sm font-medium text-gray-400 border border-white/5 italic">"How can I help you optimize your schedule today?"</div>
                   <div className="flex flex-wrap gap-2">
                      {["Best Time", "Budget Tips", "Staffing", "Logistics"].map(tag => (
                        <button key={tag} className="px-4 py-2 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all">{tag}</button>
                      ))}
                   </div>
                </div>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full px-6 py-5 rounded-2xl border border-white/10 bg-white/5 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-sm"
                  placeholder="Ask anything..."
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-xl text-white shadow-lg active:scale-95 transition-all"><Zap size={18}/></button>
              </div>
           </div>
        </div>
      </section>

      {/* 4. FOOTER REDIRECT (Action Panel) */}
      <section className="mt-24 text-center">
         <Link to="/create-event" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-[2.5rem] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
            <Plus size={24} /> Create New Event
         </Link>
      </section>
    </div>
  );
};

export default Events;
