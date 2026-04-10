import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
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
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { BentoGrid, BentoCard } from '../components/ui/BentoGrid';

const Dashboard = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    setIsAdding(true);
    try {
      await addDoc(collection(db, "tasks"), {
        name: task,
        completed: false,
        createdAt: new Date(),
        userId: auth.currentUser.uid
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

  const features = [
    {
      name: "One-Click AI",
      description: "Generate complete event plan instantly with AI.",
      Icon: Zap,
      href: "/create-event",
      cta: "Launch AI",
      className: "md:col-span-2",
      background: <div className="absolute inset-0 bg-blue-500/5" />
    },
    {
      name: "Insights",
      description: "Track performance and predictions.",
      Icon: PieChart,
      href: "/analytics",
      cta: "View Data",
      className: "md:col-span-1",
      background: <div className="absolute inset-0 bg-purple-500/5" />
    },
    {
      name: "Event Calendar",
      description: "Manage schedules and timelines.",
      Icon: Calendar,
      href: "/events",
      cta: "Open Calendar",
      className: "md:col-span-1",
      background: <div className="absolute inset-0 bg-green-500/5" />
    },
    {
      name: "Risk Detection",
      description: "Identify conflicts and issues automatically.",
      Icon: ShieldAlert,
      href: "#",
      cta: "Check Risks",
      className: "md:col-span-1",
      background: <div className="absolute inset-0 bg-red-500/5" />
    },
    {
      name: "AI Assistant",
      description: "Ask anything about your event.",
      Icon: MessageSquare,
      href: "#",
      cta: "Chat Now",
      className: "md:col-span-1",
      background: <div className="absolute inset-0 bg-orange-500/5" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* 1. HEADER & SUMMARY CARDS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-16">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Command Center</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              {auth.currentUser?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Authenticated as</div>
              <div className="text-white font-bold text-xs md:text-sm leading-none truncate max-w-[200px]">{auth.currentUser?.email}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: <ListTodo size={18}/>, label: 'Tasks', val: tasks.length, color: 'blue' },
            { icon: <TrendingUp size={18}/>, label: 'Efficiency', val: '+12%', color: 'green' },
            { icon: <Users size={18}/>, label: 'Guests', val: '284', color: 'purple' },
            { icon: <DollarSign size={18}/>, label: 'Budget', val: '$4.2k', color: 'orange' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-4 rounded-[1.5rem] md:rounded-3xl min-w-0">
              <div className={`text-${stat.color}-500 mb-2`}>{stat.icon}</div>
              <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 truncate">{stat.label}</div>
              <div className="text-lg md:text-xl font-black text-white">{stat.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BENTO GRID */}
      <div className="mb-20">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-8 ml-1">Feature Control Panel</h2>
        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>

      {/* 4. EVENTS REDIRECT PANEL */}
      <div className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-8 ml-1">Event Navigator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "View All Events", icon: <ListTodo />, path: "/events", color: "blue", desc: "Browse your complete event history." },
            { title: "Create New Event", icon: <Plus />, path: "/create-event", color: "purple", desc: "Launch the AI generator for a new plan." },
            { title: "Manage Schedules", icon: <Calendar />, path: "/events", color: "cyan", desc: "Fine-tune your timelines and reminders." }
          ].map((card, i) => (
            <Link 
              key={i} 
              to={card.path}
              className={`group glass-card p-8 rounded-[2.5rem] border-white/5 hover:border-${card.color}-500/30 transition-all relative overflow-hidden`}
            >
              <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-${card.color}-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform`} />
              <div className={`w-14 h-14 bg-${card.color}-500/10 rounded-2xl flex items-center justify-center text-${card.color}-400 mb-6 border border-${card.color}-500/20`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">{card.title}</h3>
              <p className="text-gray-500 text-sm font-medium">{card.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                Open Panel <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
