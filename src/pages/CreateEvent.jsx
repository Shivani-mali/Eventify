import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  Sparkles, 
  Calendar, 
  Zap, 
  Layout, 
  Bot, 
  CheckCircle, 
  ArrowRight, 
  Loader2,
  Heart,
  Cake,
  Users,
  Briefcase,
  Edit3,
  Save,
  Clock
} from 'lucide-react';

const CreateEvent = () => {
  const [eventType, setEventType] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [status, setStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State for Generated Event
  const [eventData, setEventData] = useState({
    name: '',
    theme: '',
    venue: '',
    date: new Date().toISOString().split('T')[0],
    budget: '',
    type: ''
  });

  const eventTypes = [
    { id: 'wedding', name: 'Wedding', icon: <Heart />, color: 'pink', desc: 'Elegant & Romantic' },
    { id: 'birthday', name: 'Birthday', icon: <Cake />, color: 'yellow', desc: 'Fun & Vibrant' },
    { id: 'corporate', name: 'Corporate', icon: <Briefcase />, color: 'blue', desc: 'Professional & Modern' },
    { id: 'gathering', name: 'Gathering', icon: <Users />, color: 'purple', desc: 'Social & Relaxed' }
  ];

  const handleGenerate = (type) => {
    setEventType(type);
    setIsGenerating(true);
    const steps = [
      `Analyzing ${type.name} trends...`,
      `Curating themes...`,
      `Sourcing venues...`,
      "Ready!"
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setStatus(steps[i]);
      i++;
      if (i === steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          
          // Set Mock Data based on type (Rupees)
          const mocks = {
            wedding: { name: 'Everlast Nuptials', theme: 'White & Gold', venue: 'Rose Manor', budget: '₹5,00,000' },
            birthday: { name: 'Neon Glow Bash', theme: 'Cyber-Pop', venue: 'Sky Lounge', budget: '₹25,000' },
            corporate: { name: 'Innovation Summit', theme: 'Glass Minimalist', venue: 'Tech Hall', budget: '₹1,50,000' },
            gathering: { name: 'Sunset Social', theme: 'Rustic Chic', venue: 'Harbor Terrace', budget: '₹10,000' }
          };
          
          setEventData({
            ...mocks[type.id],
            date: new Date().toISOString().split('T')[0],
            type: type.name
          });
          setShowResult(true);
        }, 800);
      }
    }, 800);
  };

  const handleSave = async () => {
    if (!auth.currentUser) return alert("Please login first");
    setIsSaving(true);
    console.log("Saving Event Data:", eventData);
    try {
      const docRef = await addDoc(collection(db, "events"), {
        ...eventData,
        userId: auth.currentUser.uid,
        createdAt: new Date()
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Event successfully saved to your calendar! 🎉");
      setShowResult(false);
      setEventType(null);
    } catch (err) {
      console.error("Save Error:", err);
      alert("Error saving: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div 
            key="interface"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 text-center relative overflow-hidden"
          >
            {isGenerating && (
              <div className="absolute inset-0 bg-[#030712]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8">
                <Loader2 className={`text-${eventType.color}-500 animate-spin mb-6`} size={64} />
                <h2 className="text-3xl font-black italic tracking-tighter mb-4 text-white">Eventify AI Planning...</h2>
                <p className={`text-${eventType.color}-400 font-bold uppercase tracking-widest text-sm animate-pulse`}>{status}</p>
              </div>
            )}

            <div className="w-16 md:w-20 h-16 md:h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 text-blue-500">
              <Sparkles size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tighter leading-tight italic text-white uppercase">AI Help Advisor</h1>
            <p className="text-gray-400 text-base md:text-xl font-medium max-w-2xl mx-auto mb-12">
              Select your event type and let our AI handle the logistics.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {eventTypes.map((type) => (
                 <button 
                  key={type.id}
                  onClick={() => handleGenerate(type)}
                  className="p-6 md:p-8 rounded-[2rem] border bg-white/5 border-white/5 hover:border-white/20 transition-all text-left flex flex-col group"
                 >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                      `bg-${type.color}-500/20 text-${type.color}-400`
                    }`}>
                      {type.icon}
                    </div>
                    <h3 className="text-lg font-black text-white mb-1 uppercase italic">{type.name}</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{type.desc}</p>
                 </button>
               ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[3rem] p-8 md:p-12 overflow-hidden relative"
          >
            <div className={`absolute top-0 right-0 w-64 h-64 bg-${eventType.color}-500/10 blur-[100px] -z-10`} />
            
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                   <div className={`inline-flex items-center gap-2 px-4 py-2 bg-${eventType.color}-500/10 text-${eventType.color}-500 rounded-full text-xs font-black uppercase tracking-widest border border-${eventType.color}-500/20`}>
                      <CheckCircle size={14} /> AI Recommendation
                   </div>
                   <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                   >
                      <Edit3 size={14} /> {isEditing ? "Viewing" : "Edit Details"}
                   </button>
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Event Name</label>
                        <input 
                          type="text" 
                          value={eventData.name} 
                          onChange={(e) => setEventData({...eventData, name: e.target.value})}
                          className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Venue</label>
                           <input type="text" value={eventData.venue} onChange={(e) => setEventData({...eventData, venue: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Date</label>
                           <input type="date" value={eventData.date} onChange={(e) => setEventData({...eventData, date: e.target.value})} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold" />
                        </div>
                     </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-5xl font-black italic tracking-tighter mb-4 leading-tight text-white uppercase">{eventData.name}</h1>
                    <p className="text-gray-400 text-lg font-medium mb-12">
                      Theme: {eventData.theme} <br />
                      Vibe: Balanced & Curated for {eventData.type}
                    </p>

                    <div className="space-y-6">
                       {[
                         { label: "Venue", val: eventData.venue },
                         { label: "Set Date", val: eventData.date },
                         { label: "Budget", val: eventData.budget }
                       ].map((item, i) => (
                         <div key={i} className="flex flex-col">
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{item.label}</span>
                            <span className="text-2xl font-bold text-white uppercase italic">{item.val}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full md:w-80 flex flex-col gap-4">
                <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-8 flex flex-col flex-1">
                   <h3 className="text-xl font-black mb-6 border-b border-white/5 pb-4 text-white italic uppercase">Final Check</h3>
                   <div className="space-y-4 mb-auto text-sm text-gray-400">
                      <p className="flex justify-between"><span>Guest Ready</span> <span className="text-green-500 font-black">YES</span></p>
                      <p className="flex justify-between"><span>Venue Pulse</span> <span className="text-green-500 font-black">92%</span></p>
                      <p className="flex justify-between"><span>Risk Level</span> <span className="text-blue-500 font-black">LOW</span></p>
                   </div>
                   
                   <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black uppercase italic transition-all flex items-center justify-center gap-3 mt-8 shadow-2xl shadow-blue-600/30"
                   >
                      {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save to Calendar</>}
                   </button>
                </div>
                
                <button 
                  onClick={() => setShowResult(false)}
                  className="w-full py-4 text-gray-500 hover:text-white font-black text-xs uppercase tracking-[0.3em] transition-all"
                >
                  Cancel Plan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateEvent;
