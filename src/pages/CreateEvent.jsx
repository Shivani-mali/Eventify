import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Zap, Layout } from 'lucide-react';

const CreateEvent = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 text-center"
      >
        <div className="w-16 md:w-20 h-16 md:h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 text-blue-500">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tighter leading-tight">AI Event Planning</h1>
        <p className="text-gray-400 text-base md:text-xl font-medium max-w-2xl mx-auto mb-8 md:mb-12">
          Harness the power of AI to generate themes, names, timelines, and resource allocations in seconds.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Zap />, title: 'One-Click AI', desc: 'Full plan in 60s' },
            { icon: <Layout />, title: 'Smart Themes', desc: 'Visual moodboards' },
            { icon: <Calendar />, title: 'Auto-Schedule', desc: 'Optimal timelines' }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all text-left group">
              <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <button className="mt-12 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
          Launch AI Generator
        </button>
      </motion.div>
    </div>
  );
};

export default CreateEvent;
