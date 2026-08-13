import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Check, Edit3, Send, MessageSquare, Clock, XCircle } from 'lucide-react';

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

import { AuthContext } from '../../../context/AuthContext';

export default function RecentActivity() {
  const { user } = useContext(AuthContext) || { user: null };
  const [latestRfp, setLatestRfp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestRfp = async () => {
      if (!user?.userId) return;
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/rfp?userId=${user.userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setLatestRfp(data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching RFP for activity:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestRfp();
  }, [user]);

  let steps = [];
  if (latestRfp) {
    const isSubmitted = latestRfp.status !== 'Draft';
    const isApproved = latestRfp.status === 'Approved' || latestRfp.status === 'Quotation Received';
    const isRejected = latestRfp.status === 'Rejected';
    const isQuoted = latestRfp.status === 'Quotation Received';

    steps = [
      { id: 1, icon: Edit3, user: 'You', action: 'Created draft for', target: latestRfp.title || 'RFP', time: new Date(latestRfp.createdAt).toLocaleDateString(), active: true },
      { id: 2, icon: Send, user: 'You', action: 'Submitted', target: latestRfp.rfpId, time: '', active: isSubmitted },
      { id: 3, icon: isRejected ? XCircle : (isApproved ? Check : Clock), user: 'Admin', action: isRejected ? 'Rejected' : (isApproved ? 'Approved' : 'Pending Approval'), target: latestRfp.rfpId, time: '', active: isApproved || isRejected, isError: isRejected },
      { id: 4, icon: MessageSquare, user: 'Vendor', action: isQuoted ? 'Sent Quotation for' : 'Awaiting Quotation', target: latestRfp.rfpId, time: '', active: isQuoted }
    ];
  }

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
          {isLoading ? (
            // Skeleton Loader for Activity
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="relative flex gap-4 pl-1">
                <div className="shrink-0 w-6 h-6 rounded-full bg-slate-200 animate-pulse mt-0.5"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  {i === 1 && <div className="h-3 bg-slate-100 rounded w-1/4 animate-pulse"></div>}
                </div>
              </div>
            ))
          ) : steps.length > 0 ? steps.map((act) => {
            const iconBg = act.active ? (act.isError ? 'bg-red-100' : 'bg-blue-100') : 'bg-slate-100';
            const iconColor = act.active ? (act.isError ? 'text-red-600' : 'text-blue-600') : 'text-slate-400';
            const textColor = act.active ? 'text-slate-800' : 'text-slate-400';

            return (
              <motion.div key={act.id} variants={itemVariants} className="relative flex gap-4">
                <div className={`relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${iconBg} transition-colors`}>
                  <act.icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="flex-1 pt-1.5 pb-2">
                  <p className={`text-sm ${textColor} transition-colors`}>
                    <span className="font-semibold">{act.user}</span> {act.action} <span className="font-medium cursor-pointer hover:underline">{act.target}</span>
                  </p>
                  {act.time && <p className="text-xs text-slate-500 mt-1">{act.time}</p>}
                </div>
              </motion.div>
            );
          }) : (
            <div className="text-sm text-slate-500 pl-8 pt-2">No activity yet.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
