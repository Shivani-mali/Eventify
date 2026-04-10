import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Users } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2 leading-tight">Insights & Analytics</h1>
        <p className="text-gray-500 font-bold ml-1 text-sm md:text-base">AI-driven data to optimize your event performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {[
          { icon: <Users />, label: 'Invited Guest', val: '4,284', color: 'blue' },
          { icon: <TrendingUp />, label: 'Conversion', val: '64%', color: 'green' },
          { icon: <BarChart3 />, label: 'Budget Used', val: '$12.4k', color: 'purple' },
          { icon: <PieChart />, label: 'ROI Estimate', val: '5.2x', color: 'orange' }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-white/5 relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-16 md:w-24 h-16 md:h-24 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
            <div className={`text-${stat.color}-500 mb-3 md:mb-4`}>{stat.icon}</div>
            <div className="text-gray-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 truncate">{stat.label}</div>
            <div className="text-xl md:text-3xl font-black truncate">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-10 border-white/5 aspect-video flex flex-col items-center justify-center text-gray-500 font-bold border-2 border-dashed">
          <BarChart3 size={64} className="mb-4 opacity-20" />
          Analytics Chart Visualization Coming Soon
        </div>
        <div className="glass-card rounded-[2.5rem] p-8 border-white/5">
          <h3 className="text-xl font-black mb-6">AI Predictions</h3>
          <div className="space-y-6">
            {[
               { label: 'Expected Turnout', val: '92%', prob: 'High' },
               { label: 'Budget Risk', val: 'Low', prob: 'Stable' },
               { label: 'Peak Capacity', val: '8:30 PM', prob: 'Med' }
            ].map((p, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">{p.label}</div>
                  <div className="text-lg font-bold">{p.val}</div>
                </div>
                <div className="text-[10px] font-black px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md border border-blue-500/10">
                  {p.prob}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
