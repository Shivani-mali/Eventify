import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Bot, 
  BarChart3, 
  ShieldAlert, 
  Calendar, 
  Users, 
  Zap, 
  LineChart,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <div className="relative bg-[#030712] text-white">
      {/* 1. HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 pt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
            <Sparkles size={14} /> AI-Powered Event Management
          </div>
          
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] px-2">
            Plan Perfect Events <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              with AI Speed.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed px-4">
            The world's first unified platform that integrates smart scheduling, 
            risk detection, and predictive analytics into a seamless experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-6">
            <Link to="/login" className="px-8 md:px-10 py-4 md:py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-base md:text-lg shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              Start Building Now <ArrowRight size={20} />
            </Link>
            <button className="px-8 md:px-10 py-4 md:py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] font-bold text-base md:text-lg backdrop-blur-xl hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Floating Preview Card */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 40 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-full max-w-5xl mt-12 glass-card rounded-t-[3rem] p-4 border-b-0 hidden md:block"
        >
          <div className="bg-[#030712] rounded-t-[2rem] overflow-hidden border border-white/5">
             <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                <div className="ml-4 h-6 w-1/3 bg-white/5 rounded-md" />
             </div>
             <div className="p-12 h-[300px] flex gap-8">
                <div className="w-1/4 space-y-4">
                   <div className="h-8 bg-blue-500/20 rounded-lg w-full" />
                   <div className="h-8 bg-white/5 rounded-lg w-3/4" />
                   <div className="h-8 bg-white/5 rounded-lg w-1/2" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-6">
                   <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                      <div className="h-4 w-1/3 bg-blue-500/20 rounded mb-4" />
                      <div className="h-12 w-1/2 bg-white/10 rounded-xl" />
                   </div>
                   <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                      <div className="h-4 w-1/3 bg-indigo-500/20 rounded mb-4" />
                      <div className="h-12 w-1/2 bg-white/10 rounded-xl" />
                   </div>
                   <div className="col-span-2 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl p-8 border border-blue-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center"><Bot size={24} /></div>
                        <div className="text-xl font-black">AI is calculating your event risk...</div>
                      </div>
                      <div className="px-6 py-2 bg-blue-600 rounded-full font-bold text-sm text-white">92% Stable</div>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features section removed as requested */}


      {/* 3. SHOWCASE SECTION */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent to-blue-900/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <motion.div {...fadeInUp} className="flex-1">
            <div className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4">Precision Planning</div>
            <h2 className="text-5xl font-black tracking-tighter mb-8 leading-tight">
              Manage Everything <br /> In One Unified Panel
            </h2>
            <div className="space-y-6 mb-10">
              {[
                "Real-time Event Tracking",
                "Automated Resource Allocation",
                "Guest & Vendor Dashboard",
                "Instant Export to CSV/PDF"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-lg font-bold">
                  <div className="text-blue-500"><CheckCircle2 /></div>
                  {item}
                </div>
              ))}
            </div>
            <Link to="/login" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all">
              Explore Dashboard
            </Link>
          </motion.div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full" />
            <motion.div 
              {...fadeInUp}
              className="relative glass-card aspect-square rounded-[3rem] border-white/10 p-10 flex flex-col justify-between"
            >
               <div className="flex justify-between items-center">
                  <div className="text-2xl font-black italic">Event Statistics</div>
                  <div className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-xs font-black">Live Update</div>
               </div>
               <div className="space-y-4">
                  <div className="h-4 bg-blue-500/20 rounded-full w-full" />
                  <div className="h-4 bg-white/5 rounded-full w-[80%]" />
                  <div className="h-4 bg-white/5 rounded-full w-[90%]" />
                  <div className="h-4 bg-blue-500/20 rounded-full w-[60%]" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                     <div className="text-xs text-gray-500 font-bold mb-1 uppercase">Attendance</div>
                     <div className="text-3xl font-black">94%</div>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                     <div className="text-xs text-gray-500 font-bold mb-1 uppercase">Efficiency</div>
                     <div className="text-3xl font-black">+22%</div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight px-4">Ready to host your <br /> next breakthrough?</h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium mb-12 px-6">
            Join 5,000+ organizers using Eventify to automate their complex logistics. 
            Sign up for free and start planning in seconds.
          </p>
          <Link to="/login" className="px-10 md:px-12 py-5 md:py-6 bg-white text-black rounded-[2.5rem] font-black text-lg md:text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all inline-block">
            Get Started For Free
          </Link>
          <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-30 grayscale">
             {/* Logo Placeholders */}
             <div className="text-2xl font-black italic tracking-widest">COMPANY</div>
             <div className="text-2xl font-black italic tracking-widest">TECH</div>
             <div className="text-2xl font-black italic tracking-widest">GLOBAL</div>
             <div className="text-2xl font-black italic tracking-widest">FUTURE</div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-8 border-t border-white/5 text-center text-gray-600 font-bold text-sm">
        <p>&copy; 2026 Eventify AI. All rights reserved. Created for The Hackathon Project.</p>
      </footer>
    </div>
  );
};

export default Home;
