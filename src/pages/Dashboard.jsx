import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import emailjs from '@emailjs/browser';
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Clock,
  Zap,
  Calendar,
  PieChart,
  ShieldAlert,
  MessageSquare,
  ListTodo,
  TrendingUp,
  Users,
  Activity,
  ArrowRight,
  Bell,
  Folder,
  Bot,
  Sparkles,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  Cpu
} from 'lucide-react';
import { BentoGrid, BentoCard } from '../components/ui/BentoGrid';
import AIAssistant from '../components/AIAssistant';

const Dashboard = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;
    
    // Fetch Tasks
    const qTasks = query(collection(db, "tasks"), where("userId", "==", user.uid));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Events for CSV
    const qEvents = query(collection(db, "events"), where("userId", "==", user.uid));
    const unsubEvents = onSnapshot(qEvents, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubTasks();
      unsubEvents();
    };
  }, [user]);

  const sendManualReminder = (taskName) => {
    const templateParams = {
        event_name: taskName,
        user_name: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
        message: `This is a manual reminder for your task: ${taskName}. Please ensure all preparations are on track.`,
        email: auth.currentUser.email
      };

      emailjs.send(
        'service_mq7uh8j',
        'template_wummb2b',
        templateParams,
        'GMN5uSfPH0yCwmOPM'
      ).then(() => {
        alert("Reminder sent to " + auth.currentUser.email);
      });
  };

  const downloadCSV = () => {
    if (events.length === 0) return alert("No events to download!");
    
    const headers = ["Name", "Type", "Venue", "Date", "Budget", "Guest Count", "Theme", "System ID"];
    const rows = events.map(e => [
      e.name,
      e.type,
      e.venue,
      e.date,
      e.budget,
      e.guestCount,
      e.theme || "N/A",
      e.id
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `eventify_export_${user.uid.slice(0, 5)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    setIsAdding(true);
    try {
      await addDoc(collection(db, "tasks"), {
        name: task,
        completed: false,
        createdAt: new Date(),
        userId: user.uid
      });
      setTask('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "tasks", id), {
        completed: !currentStatus
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (err) {
      console.error(err);
    }
  };

  const bentoCards = [
    {
      name: "Reminders",
      description: "Upcoming events and alerts.",
      Icon: Bell,
      href: "#tasks",
      cta: "View Reminders",
      className: "col-span-1",
      background: (
        <div className="absolute inset-0 bg-blue-500/5 transition-opacity" />
      )
    },
    {
      name: "Calendar",
      description: "Manage your event schedule.",
      Icon: Calendar,
      href: "/events",
      cta: "Open Calendar",
      className: "col-span-1",
      background: (
        <div className="absolute inset-0 bg-purple-500/5 transition-opacity" />
      )
    },
    {
      name: "AI Assistant",
      description: "Ask strategies for your events.",
      Icon: Cpu,
      href: "#",
      cta: "Activate Neural Link",
      className: "col-span-1",
      background: (
        <div className="absolute inset-0 bg-cyan-500/5 transition-opacity" />
      ),
      onClick: () => setShowAI(true)
    },
    {
      name: "Events Navigator",
      description: "Manage and navigate your history.",
      Icon: Folder,
      href: "/events",
      cta: "Go to Events",
      className: "md:col-span-3 col-span-1",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 bg-[#030712] text-white overflow-x-hidden">
      {/* 1. HEADER & SUMMARY CARDS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 md:mb-16">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic uppercase">Welcome <span className="text-blue-500">Home</span></h1>
          <div className="flex items-center gap-4 bg-white/5 p-3 pr-6 rounded-2xl border border-white/5 w-fit">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-blue-500/20">
              {auth.currentUser?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1.5">Active Session</div>
              <div className="text-white font-bold text-sm leading-none truncate max-w-[200px]">{auth.currentUser?.email}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
          {[
            { icon: <ListTodo size={20} />, label: 'Live Tasks', val: tasks.length, color: 'blue' },
            { icon: <TrendingUp size={20} />, label: 'Efficiency', val: '+12%', color: 'cyan' },
            { icon: <Users size={20} />, label: 'Active Guests', val: '284', color: 'purple' },
            { icon: <Activity size={20} />, label: 'Asset Value', val: '₹42K', color: 'rose' }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl border-white/5 min-w-0 hover:scale-105 transition-transform cursor-pointer group">
              <div className={`text-${stat.color}-500 mb-3 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1 truncate">{stat.label}</div>
              <div className="text-2xl font-black text-white italic">{stat.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BENTO GRID */}
      <div className="mb-20">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-8 ml-1 flex items-center gap-3">
          <Zap size={14} /> Control Center Architecture
        </h2>
        <BentoGrid className="grid-cols-1 md:grid-cols-3">
          {bentoCards.map((card, idx) => (
            <BentoCard key={idx} {...card} />
          ))}
        </BentoGrid>
      </div>

      {/* 4. MANAGER TOOLKIT */}
      <div id="toolkit" className="mb-24">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4 px-1">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 flex items-center gap-3">
               <Bot size={14} /> Strategic Manager Toolkit
            </h2>
            <button 
              onClick={downloadCSV}
              className="flex items-center justify-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-white active:scale-95"
            >
               <Download size={16} /> Export Events Data (CSV)
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card rounded-[3rem] p-8 md:p-12 border-white/5 relative overflow-hidden">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20">
                     <ShieldAlert size={24} />
                  </div>
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase">Deployment Protocols</h3>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-6 flex items-center gap-2 pb-2 border-b border-green-400/10">
                      <CheckCircle2 size={14} /> Essential Do's
                    </h4>
                    <ul className="space-y-5">
                      {[
                        "Confirm venue 48h early",
                        "Audit A/V systems",
                        "Sync guest list with RAG",
                        "Quality check catering"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4 text-xs font-bold text-gray-400 leading-relaxed">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-6 flex items-center gap-2 pb-2 border-b border-rose-500/10">
                      <XCircle size={14} /> Critical Avoids
                    </h4>
                    <ul className="space-y-5">
                      {[
                        "Late theme rotations",
                        "Unsecured vendor logs",
                        "Dismissing weather telemetry",
                        "Overloading grid capacity"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4 text-xs font-bold text-gray-400 leading-relaxed">
                           <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 flex-shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
               </div>
            </div>

            <div id="tasks" className="glass-card rounded-[3rem] p-8 md:p-12 border-white/5 relative overflow-hidden flex flex-col">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                     <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase">System Reminders</h3>
               </div>

               <div className="space-y-5 flex-1">
                  {tasks.length > 0 ? (
                    tasks.slice(0, 4).map((t, i) => (
                      <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-[2rem] flex items-center justify-between group hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-5 overflow-hidden">
                            <div className={`w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center text-xs font-black shrink-0 ${t.completed ? 'bg-green-500/20 text-green-500' : 'bg-gray-800 text-gray-400'}`}>
                               0{i + 1}
                            </div>
                            <span className={`text-sm md:text-base font-black uppercase italic truncate ${t.completed ? 'line-through text-gray-600' : 'text-white'}`}>{t.name}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <button 
                              onClick={() => sendManualReminder(t.name)}
                              title="Send Email Reminder"
                              className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                            >
                               <Mail size={16} />
                            </button>
                            <button 
                              onClick={() => toggleTask(t.id, t.completed)}
                              className={`p-2.5 rounded-xl transition-all ${t.completed ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                            >
                               <CheckCircle size={16}/>
                            </button>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 flex flex-col items-center opacity-40">
                       <Zap size={32} className="mb-4" />
                       <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Neural link clear - No alerts</p>
                    </div>
                  )}
               </div>

               <Link to="/events" className="mt-10 flex items-center justify-center gap-3 w-full py-5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all group">
                  Global Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
         </div>
      </div>

      {/* 5. NAVIGATOR TILES */}
      <div className="pb-20">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-8 ml-1 flex items-center gap-3">
          <Activity size={14} /> Quick Navigation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Vault", icon: <ListTodo />, path: "/events", color: "blue", desc: "Access encrypted event archives." },
            { title: "Generator", icon: <Plus />, path: "/create-event", color: "purple", desc: "Initialize new event neural-nets." },
            { title: "Tempo", icon: <Calendar />, path: "/events", color: "cyan", desc: "Sync timelines with global nodes." }
          ].map((card, i) => (
            <Link
              key={i}
              to={card.path}
              className={`group glass-card p-10 rounded-[3rem] border-white/5 hover:border-${card.color}-500/30 transition-all relative overflow-hidden`}
            >
              <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-${card.color}-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform`} />
              <div className={`w-16 h-16 bg-${card.color}-500/10 rounded-3xl flex items-center justify-center text-${card.color}-400 mb-8 border border-${card.color}-500/20`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tighter uppercase italic">{card.title}</h3>
              <p className="text-gray-500 text-xs font-bold leading-relaxed">{card.desc}</p>
              <div className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-cyan-400 transition-colors">
                Initialize <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* 6. AI ASSISTANT TOGGLE & COMPONENT */}
      <AnimatePresence>
        {showAI && (
          <AIAssistant onClose={() => setShowAI(false)} />
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAI(!showAI)}
        className="fixed bottom-8 right-8 z-[150] w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-3xl shadow-blue-500/30 border border-white/20 group hover:bg-blue-500 transition-all overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {showAI ? <XCircle size={28} /> : (
          <div className="relative">
            <Cpu size={28} className="animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#030712] animate-ping" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default Dashboard;
