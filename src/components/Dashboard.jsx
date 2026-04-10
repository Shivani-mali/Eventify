import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle, Circle, Clock } from 'lucide-react';

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[3rem] p-8 sm:p-12 shadow-2xl border-white/10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-10 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/30">
              {auth.currentUser?.displayName?.[0] || auth.currentUser?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                {auth.currentUser?.displayName || 'Builder'}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 font-bold text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full w-fit mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                {auth.currentUser?.email}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <div className="px-6 py-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 text-center">
                <div className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">Total Tasks</div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{tasks.length}</div>
             </div>
             <div className="px-6 py-4 bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-100 dark:border-green-500/20 text-center">
                <div className="text-xs font-black uppercase tracking-widest text-green-500 mb-1">Completed</div>
                <div className="text-2xl font-black text-green-600 dark:text-green-400">{tasks.filter(t => t.completed).length}</div>
             </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">New Project</h2>
            <form onSubmit={addTask} className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-6 pr-14 py-5 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold placeholder:text-gray-400"
                  placeholder="App idea name..."
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <button 
                  disabled={isAdding}
                  className="absolute right-2 top-2 bottom-2 w-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/30"
                >
                  <Plus size={24} />
                </button>
              </div>
              <p className="text-xs text-gray-400 font-bold ml-2">Press enter to launch your idea instantly</p>
            </form>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">Roadmap</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {tasks.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-20 bg-gray-50/50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800"
                  >
                    <Clock className="mx-auto mb-4 text-gray-300 dark:text-gray-700" size={48} />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Nothing in the pipeline</p>
                  </motion.div>
                ) : (
                  tasks.map(t => (
                    <motion.div 
                      key={t.id} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`group p-6 rounded-[2rem] border transition-all flex items-center justify-between gap-4 ${
                        t.completed 
                        ? 'bg-green-50/50 dark:bg-green-500/5 border-green-100/50 dark:border-green-500/10' 
                        : 'bg-white/70 dark:bg-gray-800/50 border-gray-100 dark:border-white/5 hover:border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <button 
                          onClick={() => toggleTask(t.id, t.completed)}
                          className={`transition-colors ${t.completed ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}`}
                        >
                          {t.completed ? <CheckCircle size={28} /> : <Circle size={28} />}
                        </button>
                        <span className={`text-lg font-bold tracking-tight ${t.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                          {t.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-gray-900/50 px-3 py-1 rounded-full">
                          {t.createdAt?.toDate ? new Date(t.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                        </span>
                        <button 
                          onClick={() => deleteTask(t.id)}
                          className="p-2.5 text-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
