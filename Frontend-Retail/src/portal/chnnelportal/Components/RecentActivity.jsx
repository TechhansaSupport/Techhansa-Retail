import React from 'react';
import { motion } from 'framer-motion';
import { Check, Edit3, Send, MessageSquare } from 'lucide-react';

const activities = [
  { id: 1, type: 'approval', icon: Check, user: 'Admin', action: 'Approved RFP', target: 'RFP-2024-089', time: '10 mins ago', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 2, type: 'submit', icon: Send, user: 'You', action: 'Submitted new RFP', target: 'RFP-2024-090', time: '2 hours ago', color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 3, type: 'comment', icon: MessageSquare, user: 'Vendor (Dell)', action: 'Sent quotation for', target: 'RFP-2024-085', time: '5 hours ago', color: 'text-violet-600', bg: 'bg-violet-100' },
  { id: 4, type: 'draft', icon: Edit3, user: 'You', action: 'Saved draft for', target: 'New Laptops', time: '1 day ago', color: 'text-slate-600', bg: 'bg-slate-100' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 relative"
      >
        {/* Vertical Timeline Line */}
        <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200"></div>

        <div className="space-y-6">
          {activities.map((act) => (
            <motion.div key={act.id} variants={itemVariants} className="relative flex gap-4">
              <div className={`relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${act.bg}`}>
                <act.icon className={`w-4 h-4 ${act.color}`} />
              </div>
              <div className="flex-1 pt-1.5">
                <p className="text-sm text-slate-800">
                  <span className="font-semibold">{act.user}</span> {act.action} <span className="font-medium text-blue-600 cursor-pointer hover:underline">{act.target}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">{act.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
